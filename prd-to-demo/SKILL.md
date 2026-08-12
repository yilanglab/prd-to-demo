---
name: prd-to-demo
description: 将 DOCX、PDF、Markdown、MDX、产品截图、流程图或混合来源的 PRD 转化为可运行、可验证的高保真前端交互 Demo。用于用户提出“从 PRD 做原型”“把需求文档做成 Demo”“读取产品文档并开发管理端/工作台”“先分析 PRD 再生成页面”或需要在已有 React 项目中落地交互原型时；强制先完成事实追踪和产品建模，再规划原型，确认后才使用 React、TypeScript、shadcn/ui、Base UI、Tailwind CSS 与 Lucide 实现。
---

# PRD to Demo

把 PRD 转化为产品合同，再把产品合同转化为原型计划，最后实现 Demo。不要把页面生成当作第一步，因为未经确认的推导会在代码中伪装成产品事实。

## 执行约束

- 保持原始来源只读。把已有 Agent 分析、竞品和视觉参考视为二级材料，不得覆盖原始 PRD。
- 将每条产品信息标为 `PRD 明确`、`基于 PRD 推导`、`Demo Mock` 或 `待产品确认`。禁止省略证据类别，因为 Demo 的完整外观容易掩盖未知项。
- 遇到互相冲突的来源时，记录冲突、来源和影响；等待用户决策，不要自行融合。
- 用户说“先讨论”“先分析”或“确认后推进”时，停在相应确认门禁。只输出当前门禁允许的材料，不初始化、不修改产品代码。
- 两道确认门禁必须顺序通过，默认不得合并。即使用户在同一请求中要求“分析产品并给原型计划”，门禁 1 获得明确确认前也只能输出产品边界、角色、对象、状态与规则、证据分类、冲突和待确认问题；不得输出页面清单、IA、P0/P1/P2、状态矩阵、Mock 计划或 Demo Script。只有产品合同获得明确确认后，才可进入原型规划并生成这些材料。
- 保存并避开已有用户改动。不要盲目重新初始化已有项目或覆盖配置。
- 默认交付前端高保真 Demo 与 Mock 数据。只有用户明确要求并授权时才实现真实后端、持久化、鉴权或部署。

## 资源路由

- 开始盘点多格式来源或已有项目时，读取 [references/prd-intake.md](references/prd-intake.md)。
- 提取角色、对象、生命周期、权限、规则和证据分类时，读取 [references/product-modeling.md](references/product-modeling.md)。
- 规划 IA、任务、状态矩阵、优先级、Mock 数据和演示叙事时，读取 [references/prototype-planning.md](references/prototype-planning.md)。
- 进入设计基础、组件决策或前端实现前，读取 [references/frontend-stack.md](references/frontend-stack.md)。
- 准备通过门禁、验证或交付时，读取 [references/quality-gates.md](references/quality-gates.md)。
- 创建文档时，从 `assets/templates/` 复制对应模板并替换其中的双大括号占位字段；不要直接修改 Skill 内模板。

## 工作流

### 1. 盘点输入

1. 运行 `node scripts/inspect-project.mjs --target <项目目录>`，记录来源文件、现有前端栈、组件配置、脚本和文档。
2. 为每个来源记录类型、版本、日期、作者、优先级和可读性。
3. 确定原始事实来源、二级分析、视觉参考与实现约束。
4. 若关键来源不可读或缺失，停止推导受影响范围并加入待确认问题。

### 2. 建立产品合同

1. 复制 `PRODUCT.md`、`PRD-TRACEABILITY.md` 和 `OPEN-QUESTIONS.md` 模板到目标项目。
2. 提取产品目标、范围与非目标、角色、核心对象、生命周期、业务规则、权限边界、后台动作和异常分支。
3. 为需求分配稳定 ID；在追踪表中记录来源位置、证据类别和置信度。
4. 只把 PRD 明确支持的内容写成事实。把补全流程所需的假设标为推导或 Mock。
5. 运行 `node scripts/validate-deliverables.mjs --target <项目目录> --stage product`。

### 门禁 1：确认产品合同

向用户提交范围、非目标、核心模型、关键规则、冲突和待确认项。获得明确确认后才继续。若用户修改了产品事实，先更新合同与追踪表，再重新确认。

### 3. 制定原型计划

1. 复制 `DESIGN.md` 和 `DEMO-SCRIPT.md` 模板到目标项目。
2. 将核心对象和任务转化为 IA、页面清单、入口关系与端到端任务流。
3. 为每个页面列出正常、空、加载、错误、成功和无权限状态；不适用时记录理由。
4. 按 P0/P1/P2 分级。P0 必须形成从入口到结果的完整闭环。
5. 定义 Mock 实体、关联、状态转换、时间线和权限矩阵。Mock 必须服务于任务，不得只为填满页面。
6. 编写面向产品和研发的演示叙事，区分已实现交互、模拟后台动作与真实研发建议。
7. 运行 `node scripts/validate-deliverables.mjs --target <项目目录> --stage prototype`。

### 门禁 2：确认原型计划

向用户提交 IA、P0 主链路、页面范围、状态矩阵、Mock 边界和演示脚本。获得明确确认后才进入设计和研发。范围变化时回到受影响门禁，不要让代码成为默认决策。

### 4. 建立设计基础与组件计划

1. 先盘点现有 Token、`components/ui`、`components.json` 和页面模式。
2. 在 `DESIGN.md` 中定义语义色彩、字阶、间距、圆角、阴影、层级、内容宽度、断点与交互反馈。
3. 对每个交互组件依次检查：现有 `components/ui` → shadcn registry 或 dry-run → Base UI Primitive 组合 → 自研。
4. 记录选择与理由。前三层能满足时禁止自研，因为重复实现会破坏语义、键盘行为和一致性。

### 5. 实现高保真 Demo

1. 固定使用 React + TypeScript、shadcn/ui、`@base-ui/react`、Tailwind CSS 和 Lucide。
2. 新项目采用 shadcn 的 Base UI 路线 `base-nova`。保留已有代码，但新 Demo 页面必须使用 Base UI-backed 组件；若现有 shadcn 不在 Base UI 路线上，在 `DESIGN.md` 记录隔离或迁移计划，禁止覆盖式重新初始化。
3. 先纵向实现一条 P0 主链路，再补齐其他 P0 页面，最后处理 P1/P2。
4. 使用 Tailwind 消费语义 Token。禁止在业务页面散落硬编码颜色。
5. 使用 Lucide 作为常规产品图标唯一来源。禁止用 Emoji 充当 UI 图标。
6. 禁止用 `div + click` 重写按钮、菜单、弹窗、选择器或其他已有控件。
7. 为每个入口提供结果、进度、错误或明确禁用原因。禁止死按钮。
8. 每完成一个任务，更新 PRD 追踪表中的页面、状态和验证证据。

### 6. 验证并交付

1. 运行 `node scripts/validate-deliverables.mjs --target <项目目录> --stage all`。
2. 实际运行项目提供的 lint、typecheck、test 和 build；不存在的脚本标为“未验证”，不得写成通过。
3. 执行 diff check，并用浏览器 Smoke 覆盖首页、P0 主链路、关键弹层和主要状态。
4. 检查桌面、平板、移动端和宽屏；检查键盘顺序、焦点进入与恢复、可访问名称、页面横向溢出和控制台异常。
5. 交付 Demo、五份文档、验证结果、Mock 边界、未验证项和已知缺口。
6. 不自动提交、推送或部署；仅在用户明确授权后执行相应动作。
