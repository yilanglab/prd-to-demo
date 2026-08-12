# {{PROJECT_NAME}} PRD 追踪表

> 更新日期：{{DATE}}
> 原始 PRD 版本：{{PRD_VERSION}}

## 证据分类

- `PRD 明确`：来源直接陈述。
- `基于 PRD 推导`：由已知事实连接得到，必须说明依据。
- `Demo Mock`：仅为演示构造，必须说明真实责任方。
- `待产品确认`：缺失、冲突或高影响未知项。

## 来源登记

| Source ID | 文件/说明 | 类型 | 版本/日期 | 作者 | 优先级 | 可读性 | 覆盖范围 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-001 | {{SOURCE_PATH}} | {{SOURCE_TYPE}} | {{VERSION_DATE}} | {{AUTHOR}} | {{PRIORITY}} | {{READABILITY}} | {{SCOPE}} |

## 需求追踪

| Trace ID | 需求或规则 | 来源位置 | 证据类别 | 置信度 | 角色/对象 | 页面 | 状态 | 交互/后台动作 | Mock 边界 | 验证证据 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | {{REQUIREMENT}} | SRC-001 {{LOCATION}} | {{EVIDENCE_CLASS}} | {{HIGH_MEDIUM_LOW}} | {{ROLE_OBJECT}} | PAGE-001 | {{STATE}} | {{INTERACTION}} | {{MOCK_BOUNDARY}} | {{EVIDENCE}} | {{PASS_GAP_PENDING}} |

## 冲突记录

| Conflict ID | 来源 A | 来源 B | 冲突内容 | 影响 | 决策 | 决策人/日期 |
| --- | --- | --- | --- | --- | --- | --- |
| CONFLICT-001 | {{SOURCE_A}} | {{SOURCE_B}} | {{CONFLICT}} | {{IMPACT}} | {{DECISION}} | {{OWNER_DATE}} |

## 覆盖摘要

| 指标 | 数量 | 说明 |
| --- | --- | --- |
| 总追踪项 | {{TOTAL}} | {{NOTE}} |
| 已覆盖 | {{COVERED}} | 有页面、状态、交互和验证证据 |
| 部分覆盖 | {{PARTIAL}} | {{PARTIAL_REASON}} |
| 未覆盖 | {{UNCOVERED}} | {{UNCOVERED_REASON}} |
| 待确认 | {{PENDING}} | 对应 OPEN-QUESTIONS 中的问题 |
