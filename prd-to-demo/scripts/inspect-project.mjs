#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const SKIP_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".turbo",
  ".cache",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "out",
]);

const SOURCE_EXTENSIONS = new Set([
  ".docx",
  ".pdf",
  ".md",
  ".mdx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
]);

const HELP = `Usage: node inspect-project.mjs [--target <directory>]

Read-only inspection of a PRD-to-Demo target project.

Options:
  --target <directory>  Directory to inspect. Defaults to the current directory.
  -h, --help            Show this help message.

Output:
  Stable JSON on stdout. Invalid arguments or targets exit with code 2.`;

function sortedObject(input = {}) {
  return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)));
}

function dependencyVersion(packageJson, name) {
  return packageJson?.dependencies?.[name] ?? packageJson?.devDependencies?.[name] ?? null;
}

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return { present: true, valid: true, value: JSON.parse(content), error: null };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { present: false, valid: false, value: null, error: null };
    }
    return { present: true, valid: false, value: null, error: String(error.message ?? error) };
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(root) {
  const files = [];

  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  await visit(root);
  return files;
}

function parseArgs(argv) {
  let target = process.cwd();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") return { help: true, target };
    if (argument === "--target") {
      const value = argv[index + 1];
      if (!value) throw new Error("--target requires a directory path");
      target = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return { help: false, target };
}

export async function inspectProject(targetInput) {
  const target = path.resolve(targetInput);
  const targetStat = await fs.stat(target).catch(() => null);
  if (!targetStat) throw new Error(`Target does not exist: ${target}`);
  if (!targetStat.isDirectory()) throw new Error(`Target is not a directory: ${target}`);

  const files = await walkFiles(target);
  const relativeFiles = files.map((file) => path.relative(target, file).split(path.sep).join("/"));
  const packageResult = await readJson(path.join(target, "package.json"));
  const componentsResult = await readJson(path.join(target, "components.json"));
  const packageJson = packageResult.value ?? {};

  const sources = [];
  for (let index = 0; index < files.length; index += 1) {
    const extension = path.extname(files[index]).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(extension)) continue;
    const stat = await fs.stat(files[index]);
    sources.push({
      path: relativeFiles[index],
      extension,
      sizeBytes: stat.size,
      modifiedAt: stat.mtime.toISOString(),
    });
  }

  const docs = relativeFiles.filter((file) => /(^|\/)(PRODUCT|DESIGN|PRD-TRACEABILITY|OPEN-QUESTIONS|DEMO-SCRIPT)\.md$/i.test(file));
  const componentsUi = relativeFiles.filter((file) => /(^|\/)components\/ui\/[^/]+\.(tsx?|jsx?)$/i.test(file));
  const typeScriptConfigs = relativeFiles.filter((file) => /(^|\/)tsconfig(?:\.[^/]+)?\.json$/i.test(file));
  const reactSources = relativeFiles.filter((file) => /\.(tsx|jsx)$/i.test(file));
  let tailwindStylesheetDetected = false;
  for (let index = 0; index < files.length && !tailwindStylesheetDetected; index += 1) {
    if (!/\.css$/i.test(files[index])) continue;
    const content = await fs.readFile(files[index], "utf8").catch(() => "");
    tailwindStylesheetDetected = /@import\s+["']tailwindcss["']|@tailwind\s+(?:base|components|utilities)/.test(content);
  }

  return {
    schemaVersion: 1,
    target: {
      path: target,
      exists: true,
      isDirectory: true,
    },
    sources,
    documents: docs.sort(),
    frontend: {
      packageJson: {
        present: packageResult.present,
        valid: packageResult.valid,
        error: packageResult.error,
        name: packageJson.name ?? null,
        scripts: sortedObject(packageJson.scripts),
      },
      componentsJson: {
        present: componentsResult.present,
        valid: componentsResult.valid,
        error: componentsResult.error,
        style: componentsResult.value?.style ?? null,
        baseColor: componentsResult.value?.tailwind?.baseColor ?? null,
        tsx: componentsResult.value?.tsx ?? null,
        aliases: sortedObject(componentsResult.value?.aliases),
      },
      detected: {
        react: dependencyVersion(packageJson, "react"),
        typescript: dependencyVersion(packageJson, "typescript"),
        tailwindcss: dependencyVersion(packageJson, "tailwindcss"),
        baseUi: dependencyVersion(packageJson, "@base-ui/react"),
        lucideReact: dependencyVersion(packageJson, "lucide-react"),
        shadcn: componentsResult.present && componentsResult.valid,
      },
      typeScriptConfigs: typeScriptConfigs.sort(),
      reactSourceCount: reactSources.length,
      componentsUi: componentsUi.sort(),
      tailwindStylesheetDetected,
    },
    inventory: {
      fileCount: files.length,
      sourceCount: sources.length,
      documentCount: docs.length,
      componentCount: componentsUi.length,
      hasSrcDirectory: await exists(path.join(target, "src")),
      hasAppDirectory: await exists(path.join(target, "app")),
    },
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(`${HELP}\n`);
      return;
    }
    const result = await inspectProject(options.target);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: String(error.message ?? error) }, null, 2)}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
