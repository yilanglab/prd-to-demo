# {{PROJECT_NAME}} 原型与设计合同

> 版本：{{VERSION}}
> 更新日期：{{DATE}}
> 对应产品合同：{{PRODUCT_VERSION}}
> 原型计划状态：{{DRAFT_OR_CONFIRMED}}

本文档中的任务、页面和 Mock 均标记为 `PRD 明确`、`基于 PRD 推导`、`Demo Mock` 或 `待产品确认`；未标记项不得视为已确认范围。

## 体验目标

| 目标 | 对应角色 | 对应任务 | 可观察结果 | 追踪 ID |
| --- | --- | --- | --- | --- |
| {{EXPERIENCE_GOAL}} | {{ROLE}} | {{TASK}} | {{OBSERVABLE_RESULT}} | {{REQ_IDS}} |

## 信息架构

```text
{{NAVIGATION_TREE}}
```

### 对象上下文

| 页面组 | 当前对象如何确定 | 如何切换 | 返回时如何保持 | 无可用对象时 |
| --- | --- | --- | --- | --- |
| {{PAGE_GROUP}} | {{CONTEXT_SOURCE}} | {{SWITCHER}} | {{PERSISTENCE}} | {{EMPTY_BEHAVIOR}} |

## 页面清单

| Page ID | 页面 | 入口 | 角色 | 任务 | 优先级 | 追踪 ID |
| --- | --- | --- | --- | --- | --- | --- |
| PAGE-001 | {{PAGE_NAME}} | {{ENTRY}} | {{ROLE}} | {{TASK}} | P0 | {{REQ_IDS}} |

## 范围优先级

| 优先级 | 任务或页面 | 取舍理由 | 证据类别 | 追踪 ID |
| --- | --- | --- | --- | --- |
| P0 | {{P0_TASK_OR_PAGE}} | {{P0_RATIONALE}} | {{EVIDENCE_CLASS}} | {{REQ_IDS}} |
| P1 | {{P1_TASK_OR_PAGE}} | {{P1_RATIONALE}} | {{EVIDENCE_CLASS}} | {{REQ_IDS}} |
| P2 | {{P2_TASK_OR_PAGE}} | {{P2_RATIONALE}} | {{EVIDENCE_CLASS}} | {{REQ_IDS}} |

## 关键任务流

### FLOW-001：{{FLOW_NAME}}

| 步骤 | 页面/弹层 | 用户动作 | 系统反馈或后台动作 | 成功结果 | 失败/回退 |
| --- | --- | --- | --- | --- | --- |
| 1 | {{SURFACE}} | {{ACTION}} | {{FEEDBACK}} | {{RESULT}} | {{RECOVERY}} |

## 状态矩阵

| 页面/模块 | 正常 | 空 | 加载 | 错误 | 成功 | 无权限 |
| --- | --- | --- | --- | --- | --- | --- |
| {{SURFACE}} | {{NORMAL}} | {{EMPTY}} | {{LOADING}} | {{ERROR}} | {{SUCCESS}} | {{NO_PERMISSION}} |

若某状态不适用，写明业务理由，不留空。

## 设计基础

### 色彩与 Token

| 基础 Token | 值 | 语义 Token | 用途 |
| --- | --- | --- | --- |
| {{PALETTE_TOKEN}} | {{VALUE}} | {{SEMANTIC_TOKEN}} | {{USAGE}} |

### 字阶

| Token | 字号/行高 | 字重 | 用途 |
| --- | --- | --- | --- |
| {{TYPE_TOKEN}} | {{SIZE_AND_LEADING}} | {{WEIGHT}} | {{USAGE}} |

### 间距、尺寸、圆角与阴影

| 类别 | Token | 值 | 使用范围 |
| --- | --- | --- | --- |
| {{FOUNDATION_TYPE}} | {{TOKEN}} | {{VALUE}} | {{USAGE}} |

### 页面框架与层级

| 项目 | 约束 |
| --- | --- |
| 内容宽度上限 | {{CONTENT_MAX_WIDTH}} |
| 默认页面内边距 | {{PAGE_PADDING}} |
| 弹层层级 | {{OVERLAY_Z_INDEX_RULE}} |
| 表格密度 | {{TABLE_DENSITY}} |

## 组件计划

组件来源只允许：现有 `components/ui`、shadcn registry、Base UI Primitive 组合、自研。

新 Demo 页面必须使用 Base UI-backed 组件。若现有 shadcn 组件不是 Base UI 路线，写明保留范围、隔离方式或迁移计划；不得覆盖式重新初始化。

| 组件 | 使用页面 | 状态/API | 来源 | 复用或新增理由 | 无障碍合同 |
| --- | --- | --- | --- | --- | --- |
| {{COMPONENT}} | {{PAGES}} | {{STATES_OR_API}} | {{SOURCE_LEVEL}} | {{RATIONALE}} | {{A11Y_CONTRACT}} |

## Mock 数据

| Entity | 字段与关系 | 覆盖状态 | 真实来源 | Demo 转换方式 |
| --- | --- | --- | --- | --- |
| {{ENTITY}} | {{FIELDS_AND_RELATIONS}} | {{STATES}} | {{REAL_SOURCE}} | {{MOCK_TRANSITION}} |

## 响应式

| 视口 | 页面策略 | 导航 | 表格/表单 | 固定元素 | 验证结果 |
| --- | --- | --- | --- | --- | --- |
| 375×812 | {{MOBILE_STRATEGY}} | {{NAV}} | {{CONTENT}} | {{FIXED_UI}} | {{RESULT}} |
| 768×1024 | {{TABLET_STRATEGY}} | {{NAV}} | {{CONTENT}} | {{FIXED_UI}} | {{RESULT}} |
| 常规桌面 | {{DESKTOP_STRATEGY}} | {{NAV}} | {{CONTENT}} | {{FIXED_UI}} | {{RESULT}} |
| 2560×1440 | {{WIDE_STRATEGY}} | {{NAV}} | {{CONTENT}} | {{FIXED_UI}} | {{RESULT}} |

## 无障碍与动效

| 范围 | 规则 | 验证方式 |
| --- | --- | --- |
| 键盘 | {{KEYBOARD_RULE}} | {{KEYBOARD_CHECK}} |
| 焦点 | {{FOCUS_RULE}} | {{FOCUS_CHECK}} |
| 可访问名称 | {{NAME_RULE}} | {{NAME_CHECK}} |
| 状态公告 | {{LIVE_REGION_RULE}} | {{LIVE_REGION_CHECK}} |
| 减弱动效 | {{REDUCED_MOTION_RULE}} | {{MOTION_CHECK}} |

## 验证与未覆盖项

| 项目 | 证据 | 结果 | 未覆盖原因/后续 |
| --- | --- | --- | --- |
| {{CHECK}} | {{EVIDENCE}} | {{PASS_FAIL_UNVERIFIED}} | {{FOLLOW_UP}} |
