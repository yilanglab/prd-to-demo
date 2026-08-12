#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const HELP = `Usage: node validate-deliverables.mjs --target <directory> [--stage <stage>]

Validate PRD-to-Demo documents and implementation contracts.

Options:
  --target <directory>  Target project directory. Defaults to the current directory.
  --stage <stage>       product | prototype | implementation | all (default: all)
  -h, --help            Show this help message.

Exit codes:
  0  All required checks passed.
  1  Deliverables are incomplete or invalid.
  2  Invalid command arguments or target.`;

const VALID_STAGES = new Set(["product", "prototype", "implementation", "all"]);
const PRODUCT_DOCUMENTS = ["PRODUCT.md", "PRD-TRACEABILITY.md", "OPEN-QUESTIONS.md"];
const PROTOTYPE_DOCUMENTS = ["DESIGN.md", "DEMO-SCRIPT.md"];
const EVIDENCE_CLASSES = ["PRD 明确", "基于 PRD 推导", "Demo Mock", "待产品确认"];

const DOCUMENT_RULES = {
  "PRODUCT.md": ["产品目标", "范围", "非目标", "用户与角色", "核心对象", "生命周期", "业务规则", "权限矩阵", "后台动作", "假设与决策"],
  "PRD-TRACEABILITY.md": ["证据分类", "来源登记", "需求追踪", "覆盖摘要"],
  "OPEN-QUESTIONS.md": ["待确认问题", "已确认决策"],
  "DESIGN.md": ["体验目标", "信息架构", "页面清单", "范围优先级", "关键任务流", "状态矩阵", "设计基础", "组件计划", "Mock 数据", "响应式", "无障碍与动效"],
  "DEMO-SCRIPT.md": ["演示目标", "前置状态", "演示步骤", "Mock 边界", "研发说明", "验证清单"],
};

function parseArgs(argv) {
  let target = process.cwd();
  let stage = "all";
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") return { help: true, target, stage };
    if (argument === "--target") {
      if (!argv[index + 1]) throw new Error("--target requires a directory path");
      target = argv[index + 1];
      index += 1;
      continue;
    }
    if (argument === "--stage") {
      if (!argv[index + 1]) throw new Error("--stage requires a value");
      stage = argv[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  if (!VALID_STAGES.has(stage)) throw new Error(`Invalid stage: ${stage}`);
  return { help: false, target, stage };
}

async function fileExists(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function directoryExists(filePath) {
  try {
    return (await fs.stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}

async function findDocument(target, fileName) {
  const candidates = [path.join(target, fileName), path.join(target, "docs", fileName)];
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }
  return null;
}

async function readJson(filePath) {
  try {
    return { ok: true, value: JSON.parse(await fs.readFile(filePath, "utf8")) };
  } catch (error) {
    return { ok: false, value: null, error: String(error.message ?? error) };
  }
}

function dependencyVersion(packageJson, name) {
  return packageJson?.dependencies?.[name] ?? packageJson?.devDependencies?.[name] ?? null;
}

function addCheck(checks, id, ok, message, relativePath = null) {
  checks.push({ id, status: ok ? "pass" : "fail", path: relativePath, message });
}

function documentNamesForStage(stage) {
  if (stage === "product") return PRODUCT_DOCUMENTS;
  if (stage === "prototype" || stage === "all") return [...new Set([...PRODUCT_DOCUMENTS, ...PROTOTYPE_DOCUMENTS])];
  return [];
}

async function validateDocuments(target, names, checks) {
  for (const name of names) {
    const filePath = await findDocument(target, name);
    if (!filePath) {
      addCheck(checks, `document:${name}`, false, `Missing required document: ${name}`, name);
      continue;
    }
    const relativePath = path.relative(target, filePath).split(path.sep).join("/");
    const content = await fs.readFile(filePath, "utf8");
    addCheck(checks, `document:${name}`, true, `Found ${name}`, relativePath);
    const unresolvedPlaceholders = [...new Set(content.match(/\{\{[^{}\r\n]+\}\}/g) ?? [])].sort();
    addCheck(
      checks,
      `placeholders:${name}`,
      unresolvedPlaceholders.length === 0,
      unresolvedPlaceholders.length === 0
        ? `No unresolved template placeholders in ${name}`
        : `Unresolved placeholders in ${name}: ${unresolvedPlaceholders.join(", ")}`,
      relativePath,
    );
    for (const heading of DOCUMENT_RULES[name]) {
      const headingPattern = new RegExp(`^#{2,3}\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`, "m");
      const hasHeading = headingPattern.test(content);
      addCheck(
        checks,
        `section:${name}:${heading}`,
        hasHeading,
        hasHeading ? `Found section: ${heading}` : `Missing section "${heading}" in ${name}`,
        relativePath,
      );
    }
    if (name === "PRODUCT.md" || name === "PRD-TRACEABILITY.md") {
      const missingEvidenceClasses = EVIDENCE_CLASSES.filter((evidenceClass) => !content.includes(evidenceClass));
      addCheck(
        checks,
        `evidence:${name}`,
        missingEvidenceClasses.length === 0,
        missingEvidenceClasses.length === 0
          ? `Found all four evidence classes in ${name}`
          : `Missing evidence classes in ${name}: ${missingEvidenceClasses.join(", ")}`,
        relativePath,
      );
    }
  }
}

async function findSourceFiles(target, matcher) {
  const roots = ["src", "app", "components", "pages"];
  const ignored = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage"]);
  const files = [];

  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (entry.isDirectory() && ignored.has(entry.name)) continue;
      const itemPath = path.join(directory, entry.name);
      if (entry.isFile() && matcher(entry.name)) files.push(itemPath);
      if (entry.isDirectory()) await visit(itemPath);
    }
  }

  for (const root of roots) {
    await visit(path.join(target, root));
  }
  return files.sort((a, b) => a.localeCompare(b));
}

async function findModuleImports(target, packageName) {
  const sourceFiles = await findSourceFiles(target, (name) => /\.(?:tsx|ts|jsx|js)$/i.test(name));
  const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importPattern = new RegExp(`(?:\\bfrom\\s*|\\bimport\\s*(?:\\(\\s*)?|\\brequire\\s*\\()\\s*["']${escapedPackageName}(?:/[^"']*)?["']`);
  const matches = [];

  for (const sourceFile of sourceFiles) {
    const content = await fs.readFile(sourceFile, "utf8").catch(() => "");
    if (importPattern.test(content)) matches.push(path.relative(target, sourceFile).split(path.sep).join("/"));
  }
  return matches;
}

async function findTailwindStylesheet(target) {
  const roots = [target, path.join(target, "src"), path.join(target, "app"), path.join(target, "styles")];
  const ignored = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage"]);
  const visited = new Set();

  async function visit(directory) {
    const resolved = path.resolve(directory);
    if (visited.has(resolved)) return false;
    visited.add(resolved);
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (entry.isDirectory() && ignored.has(entry.name)) continue;
      const itemPath = path.join(directory, entry.name);
      if (entry.isFile() && /\.css$/i.test(entry.name)) {
        const content = await fs.readFile(itemPath, "utf8").catch(() => "");
        if (/@import\s+["']tailwindcss["']|@tailwind\s+(?:base|components|utilities)/.test(content)) return true;
      }
      if (entry.isDirectory() && (await visit(itemPath))) return true;
    }
    return false;
  }

  for (const root of roots) {
    if (await visit(root)) return true;
  }
  return false;
}

async function validateImplementation(target, checks) {
  const packagePath = path.join(target, "package.json");
  const packagePresent = await fileExists(packagePath);
  addCheck(checks, "implementation:package-json", packagePresent, packagePresent ? "Found package.json" : "Missing package.json", "package.json");
  if (!packagePresent) return;

  const packageResult = await readJson(packagePath);
  addCheck(checks, "implementation:package-json-valid", packageResult.ok, packageResult.ok ? "package.json is valid JSON" : `Invalid package.json: ${packageResult.error}`, "package.json");
  if (!packageResult.ok) return;

  const packageJson = packageResult.value;
  const dependencies = [
    ["react", "React"],
    ["typescript", "TypeScript"],
    ["tailwindcss", "Tailwind CSS"],
    ["@base-ui/react", "Base UI"],
    ["lucide-react", "Lucide React"],
  ];

  for (const [dependency, label] of dependencies) {
    const version = dependencyVersion(packageJson, dependency);
    addCheck(
      checks,
      `implementation:dependency:${dependency}`,
      Boolean(version),
      version ? `${label} dependency found (${version})` : `Missing ${label} dependency (${dependency})`,
      "package.json",
    );
  }

  const tsconfigCandidates = (await fs.readdir(target).catch(() => [])).filter((name) => /^tsconfig(?:\..+)?\.json$/.test(name));
  addCheck(
    checks,
    "implementation:tsconfig",
    tsconfigCandidates.length > 0,
    tsconfigCandidates.length > 0 ? `Found TypeScript config: ${tsconfigCandidates.sort().join(", ")}` : "Missing tsconfig*.json",
    tsconfigCandidates[0] ?? "tsconfig.json",
  );

  const componentsPath = path.join(target, "components.json");
  const componentsPresent = await fileExists(componentsPath);
  addCheck(checks, "implementation:components-json", componentsPresent, componentsPresent ? "Found shadcn components.json" : "Missing shadcn components.json", "components.json");
  if (componentsPresent) {
    const componentsResult = await readJson(componentsPath);
    addCheck(
      checks,
      "implementation:components-json-valid",
      componentsResult.ok,
      componentsResult.ok ? "components.json is valid JSON" : `Invalid components.json: ${componentsResult.error}`,
      "components.json",
    );
  }

  const uiDirectories = [path.join(target, "components", "ui"), path.join(target, "src", "components", "ui")];
  const hasUiDirectory = (await Promise.all(uiDirectories.map(directoryExists))).some(Boolean);
  addCheck(
    checks,
    "implementation:components-ui",
    hasUiDirectory,
    hasUiDirectory ? "Found components/ui directory" : "Missing components/ui or src/components/ui directory",
    "components/ui",
  );

  const tsxSources = await findSourceFiles(target, (name) => /\.tsx$/i.test(name));
  addCheck(
    checks,
    "implementation:react-source",
    tsxSources.length > 0,
    tsxSources.length > 0
      ? `Found TypeScript React source: ${tsxSources.map((sourceFile) => path.relative(target, sourceFile).split(path.sep).join("/")).join(", ")}`
      : "Missing .tsx source file; .jsx does not satisfy the React + TypeScript contract",
    "src",
  );

  const hasTailwindStylesheet = await findTailwindStylesheet(target);
  addCheck(
    checks,
    "implementation:tailwind-stylesheet",
    hasTailwindStylesheet,
    hasTailwindStylesheet ? "Found Tailwind CSS import or directives" : "Missing Tailwind CSS import or @tailwind directives",
    "src",
  );

  const baseUiImports = await findModuleImports(target, "@base-ui/react");
  addCheck(
    checks,
    "implementation:base-ui-import",
    baseUiImports.length > 0,
    baseUiImports.length > 0
      ? `Found @base-ui/react import in: ${baseUiImports.join(", ")}`
      : "Missing @base-ui/react import in project source files",
    "src",
  );

  const lucideImports = await findModuleImports(target, "lucide-react");
  addCheck(
    checks,
    "implementation:lucide-import",
    lucideImports.length > 0,
    lucideImports.length > 0
      ? `Found lucide-react import in: ${lucideImports.join(", ")}`
      : "Missing lucide-react import in project source files",
    "src",
  );

  for (const scriptName of ["lint", "typecheck", "test", "build"]) {
    const command = packageJson.scripts?.[scriptName];
    addCheck(
      checks,
      `implementation:script:${scriptName}`,
      typeof command === "string" && command.trim().length > 0,
      command ? `Found ${scriptName} script: ${command}` : `Missing package script: ${scriptName}`,
      "package.json",
    );
  }
}

export async function validateDeliverables(targetInput, stage = "all") {
  if (!VALID_STAGES.has(stage)) throw new Error(`Invalid stage: ${stage}`);
  const target = path.resolve(targetInput);
  const stat = await fs.stat(target).catch(() => null);
  if (!stat) throw new Error(`Target does not exist: ${target}`);
  if (!stat.isDirectory()) throw new Error(`Target is not a directory: ${target}`);

  const checks = [];
  const documentNames = documentNamesForStage(stage);
  if (documentNames.length > 0) await validateDocuments(target, documentNames, checks);
  if (stage === "implementation" || stage === "all") {
    await validateImplementation(target, checks);
  }

  const failures = checks.filter((check) => check.status === "fail");
  return {
    schemaVersion: 1,
    target,
    stage,
    ok: failures.length === 0,
    summary: {
      passed: checks.length - failures.length,
      failed: failures.length,
      total: checks.length,
    },
    checks,
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(`${HELP}\n`);
      return;
    }
    const result = await validateDeliverables(options.target, options.stage);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: String(error.message ?? error) }, null, 2)}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
