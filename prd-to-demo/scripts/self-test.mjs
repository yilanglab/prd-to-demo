#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspectProject } from "./inspect-project.mjs";
import { validateDeliverables } from "./validate-deliverables.mjs";

const HELP = `Usage: node self-test.mjs

Run isolated success and failure cases for the PRD-to-Demo helper scripts.

Options:
  -h, --help  Show this help message.

The test creates and removes its own operating-system temporary directory.`;

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");
const TEMPLATE_DIRECTORY = path.join(SKILL_ROOT, "assets", "templates");
const VALIDATOR_CLI = path.join(SCRIPT_DIRECTORY, "validate-deliverables.mjs");

const DOCS = {
  "PRODUCT.md": `# Fixture 产品合同
PRD 明确、基于 PRD 推导、Demo Mock、待产品确认
## 产品目标
## 范围
## 非目标
## 用户与角色
## 核心对象
## 生命周期
## 业务规则
## 权限矩阵
## 后台动作
## 假设与决策
`,
  "PRD-TRACEABILITY.md": `# Fixture 追踪表
PRD 明确、基于 PRD 推导、Demo Mock、待产品确认
## 证据分类
## 来源登记
## 需求追踪
## 覆盖摘要
`,
  "OPEN-QUESTIONS.md": `# Fixture 问题
## 待确认问题
## 已确认决策
`,
  "DESIGN.md": `# Fixture 设计合同
## 体验目标
## 信息架构
## 页面清单
## 范围优先级
## 关键任务流
## 状态矩阵
## 设计基础
## 组件计划
## Mock 数据
## 响应式
## 无障碍与动效
`,
  "DEMO-SCRIPT.md": `# Fixture Demo
## 演示目标
## 前置状态
## 演示步骤
## Mock 边界
## 研发说明
## 验证清单
`,
};

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function createCompleteFixture(directory) {
  for (const name of Object.keys(DOCS)) {
    await fs.mkdir(directory, { recursive: true });
    const template = await fs.readFile(path.join(TEMPLATE_DIRECTORY, name), "utf8");
    await writeFile(path.join(directory, name), template.replace(/\{\{[A-Z0-9_]+\}\}/g, "fixture"));
  }
  await writeFile(path.join(directory, "requirements.md"), "# Original PRD\n");
  await writeFile(
    path.join(directory, "package.json"),
    `${JSON.stringify(
      {
        name: "prd-to-demo-fixture",
        scripts: {
          lint: "eslint .",
          typecheck: "tsc --noEmit",
          test: "node --test",
          build: "vite build",
        },
        dependencies: {
          react: "19.0.0",
          "@base-ui/react": "1.0.0",
          "lucide-react": "0.500.0",
        },
        devDependencies: {
          typescript: "5.8.0",
          tailwindcss: "4.0.0",
        },
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(path.join(directory, "components.json"), `${JSON.stringify({ style: "base-nova", tsx: true }, null, 2)}\n`);
  await writeFile(path.join(directory, "tsconfig.json"), `${JSON.stringify({ compilerOptions: { strict: true } }, null, 2)}\n`);
  await writeFile(path.join(directory, "src", "components", "ui", "button.tsx"), "export function Button() { return <button />; }\n");
  await writeFile(
    path.join(directory, "src", "main.tsx"),
    'import { Button } from "@base-ui/react/button";\nimport { ArrowRight } from "lucide-react";\nexport function Demo() { return <Button><ArrowRight /></Button>; }\n',
  );
  await writeFile(path.join(directory, "src", "styles.css"), '@import "tailwindcss";\n');
}

async function run() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "prd-to-demo-self-test-"));
  const results = [];

  try {
    const complete = path.join(temporaryRoot, "complete project with spaces");
    await createCompleteFixture(complete);

    const inspection = await inspectProject(complete);
    assert.equal(inspection.frontend.detected.react, "19.0.0");
    assert.equal(inspection.frontend.detected.typescript, "5.8.0");
    assert.equal(inspection.frontend.detected.tailwindcss, "4.0.0");
    assert.equal(inspection.frontend.detected.baseUi, "1.0.0");
    assert.equal(inspection.frontend.detected.lucideReact, "0.500.0");
    assert.equal(inspection.frontend.detected.shadcn, true);
    assert.equal(inspection.frontend.packageJson.scripts.build, "vite build");
    assert.equal(inspection.sources.some((source) => source.path === "requirements.md"), true);
    results.push({ name: "inspect complete project and spaced path", status: "pass" });

    const completeValidation = await validateDeliverables(complete, "all");
    assert.equal(completeValidation.ok, true, JSON.stringify(completeValidation.checks.filter((check) => check.status === "fail")));
    assert.equal(new Set(completeValidation.checks.map((check) => check.id)).size, completeValidation.checks.length);
    results.push({ name: "validate complete product, prototype, and implementation", status: "pass" });

    const unresolvedPlaceholders = path.join(temporaryRoot, "unresolved-placeholders");
    await fs.mkdir(unresolvedPlaceholders, { recursive: true });
    for (const name of Object.keys(DOCS)) {
      await fs.copyFile(path.join(TEMPLATE_DIRECTORY, name), path.join(unresolvedPlaceholders, name));
    }
    const placeholderValidation = await validateDeliverables(unresolvedPlaceholders, "product");
    assert.equal(placeholderValidation.ok, false);
    assert.equal(placeholderValidation.checks.some((check) => check.id === "placeholders:PRODUCT.md" && check.status === "fail"), true);
    results.push({ name: "reject unreplaced document placeholders", status: "pass" });

    const missingProduct = path.join(temporaryRoot, "missing-product");
    await fs.mkdir(missingProduct, { recursive: true });
    const missingProductValidation = await validateDeliverables(missingProduct, "product");
    assert.equal(missingProductValidation.ok, false);
    assert.equal(missingProductValidation.checks.some((check) => check.id === "document:PRODUCT.md" && check.status === "fail"), true);
    results.push({ name: "reject missing product documents", status: "pass" });

    const failedCliValidation = spawnSync(process.execPath, [VALIDATOR_CLI, "--target", missingProduct, "--stage", "product"], { encoding: "utf8" });
    assert.equal(failedCliValidation.status, 1);
    assert.equal(JSON.parse(failedCliValidation.stdout).ok, false);
    const invalidCliArguments = spawnSync(process.execPath, [VALIDATOR_CLI, "--target", missingProduct, "--stage", "unknown"], { encoding: "utf8" });
    assert.equal(invalidCliArguments.status, 2);
    results.push({ name: "report documented validator exit codes", status: "pass" });

    const incompletePrototype = path.join(temporaryRoot, "incomplete-prototype");
    await fs.mkdir(incompletePrototype, { recursive: true });
    for (const [name, content] of Object.entries(DOCS)) {
      await writeFile(path.join(incompletePrototype, name), name === "DESIGN.md" ? "# Incomplete\n## 体验目标\n" : content);
    }
    const prototypeValidation = await validateDeliverables(incompletePrototype, "prototype");
    assert.equal(prototypeValidation.ok, false);
    assert.equal(prototypeValidation.checks.some((check) => check.id === "section:DESIGN.md:状态矩阵" && check.status === "fail"), true);
    results.push({ name: "reject incomplete prototype sections", status: "pass" });

    const incompleteStack = path.join(temporaryRoot, "incomplete-stack");
    await fs.mkdir(incompleteStack, { recursive: true });
    await writeFile(path.join(incompleteStack, "package.json"), `${JSON.stringify({ dependencies: { react: "19.0.0" } }, null, 2)}\n`);
    const stackValidation = await validateDeliverables(incompleteStack, "implementation");
    assert.equal(stackValidation.ok, false);
    assert.equal(stackValidation.checks.some((check) => check.id === "implementation:dependency:@base-ui/react" && check.status === "fail"), true);
    assert.equal(stackValidation.checks.some((check) => check.id === "implementation:script:build" && check.status === "fail"), true);
    results.push({ name: "reject incomplete frontend stack and scripts", status: "pass" });

    return {
      ok: true,
      summary: { passed: results.length, failed: 0, total: results.length },
      tests: results,
    };
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}

async function main() {
  if (process.argv.slice(2).some((argument) => argument === "--help" || argument === "-h")) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (process.argv.length > 2) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: `Unknown argument: ${process.argv[2]}` }, null, 2)}\n`);
    process.exitCode = 2;
    return;
  }
  try {
    const result = await run();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: String(error.stack ?? error) }, null, 2)}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
