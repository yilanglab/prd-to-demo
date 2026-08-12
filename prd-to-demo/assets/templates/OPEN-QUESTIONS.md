# {{PROJECT_NAME}} 待确认问题与决策

> 更新日期：{{DATE}}
> 维护原则：问题必须可回答，并说明不回答会影响什么；确认后保留历史，不直接删除。

证据类别使用 `PRD 明确`、`基于 PRD 推导`、`Demo Mock` 和 `待产品确认`；未决问题当前必须标为 `待产品确认`，确认后保留原类别和决策记录。

## 待确认问题

| Question ID | 问题 | 来源/冲突 | 当前证据类别 | 建议选项 | 推荐与理由 | 影响 | 决策人 | 截止门禁 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Q-001 | {{QUESTION}} | {{SOURCE_OR_CONFLICT}} | 待产品确认 | {{OPTIONS}} | {{RECOMMENDATION}} | {{IMPACT}} | {{DECISION_OWNER}} | 产品合同 / 原型计划 |

## 已确认决策

| Decision ID | 原问题 | 决策 | 决策人 | 日期 | 影响的追踪 ID | 需要重验的页面/流程 |
| --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | Q-001 | {{DECISION}} | {{DECISION_OWNER}} | {{DATE}} | {{TRACE_IDS}} | {{REGRESSION_SCOPE}} |

## 已失效决策

| Decision ID | 原决策 | 失效原因 | 被哪个决策替代 | 日期 |
| --- | --- | --- | --- | --- |
| DEC-000 | {{OLD_DECISION}} | {{REASON}} | {{REPLACEMENT_ID}} | {{DATE}} |
