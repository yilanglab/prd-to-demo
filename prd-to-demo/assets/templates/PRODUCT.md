# {{PROJECT_NAME}} 产品合同

> 版本：{{VERSION}}
> 更新日期：{{DATE}}
> 产品合同状态：{{DRAFT_OR_CONFIRMED}}
> 原始来源：{{PRIMARY_SOURCE_IDS}}

本文档区分 `PRD 明确`、`基于 PRD 推导`、`Demo Mock` 和 `待产品确认`。未标记的内容不得视为已确认产品事实。

## 产品目标

### 一句话目标

{{ONE_SENTENCE_GOAL}}

### 要解决的问题

| ID | 问题 | 目标用户 | 成功表现 | 证据类别 | 来源 |
| --- | --- | --- | --- | --- | --- |
| REQ-001 | {{PROBLEM}} | {{USER}} | {{OUTCOME}} | {{EVIDENCE_CLASS}} | {{SOURCE_LOCATION}} |

## 范围

| ID | 本版包含 | 优先级 | 证据类别 | 备注 |
| --- | --- | --- | --- | --- |
| REQ-002 | {{IN_SCOPE_CAPABILITY}} | P0 | {{EVIDENCE_CLASS}} | {{NOTE}} |

## 非目标

| ID | 本版不包含 | 原因 | 后续条件 | 证据类别 |
| --- | --- | --- | --- | --- |
| REQ-003 | {{OUT_OF_SCOPE_CAPABILITY}} | {{REASON}} | {{REVISIT_CONDITION}} | {{EVIDENCE_CLASS}} |

## 用户与角色

| Role ID | 角色 | 目标 | 主要任务 | 数据范围 | 禁止动作 | 证据类别 |
| --- | --- | --- | --- | --- | --- | --- |
| ROLE-001 | {{ROLE_NAME}} | {{GOAL}} | {{TASKS}} | {{SCOPE}} | {{PROHIBITED_ACTIONS}} | {{EVIDENCE_CLASS}} |

## 核心对象

| Object ID | 对象 | 唯一标识 | 关键字段 | Owner | 关系 | 数据来源 | 证据类别 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OBJ-001 | {{OBJECT_NAME}} | {{IDENTIFIER}} | {{FIELDS}} | {{OWNER}} | {{RELATIONS}} | {{SOURCE}} | {{EVIDENCE_CLASS}} |

## 生命周期

### 状态定义

| State ID | 对象 | 状态 | 进入条件 | 可用动作 | 退出条件 | 证据类别 |
| --- | --- | --- | --- | --- | --- | --- |
| STATE-001 | OBJ-001 | {{STATE_NAME}} | {{ENTRY_CONDITION}} | {{AVAILABLE_ACTIONS}} | {{EXIT_CONDITION}} | {{EVIDENCE_CLASS}} |

### 状态转换

| Transition ID | 起点 | 动作 | 执行者 | 后台动作 | 成功终点 | 失败/回退 | 证据类别 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REQ-004 | {{FROM_STATE}} | {{ACTION}} | {{ACTOR}} | {{BACKGROUND_ACTION}} | {{TO_STATE}} | {{FAILURE_PATH}} | {{EVIDENCE_CLASS}} |

## 业务规则

| Rule ID | 条件 | 结果 | 优先级 | 例外 | 证据类别 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-005 | {{CONDITION}} | {{RESULT}} | {{RULE_PRIORITY}} | {{EXCEPTION}} | {{EVIDENCE_CLASS}} | {{SOURCE_LOCATION}} |

## 权限矩阵

| 能力 | {{ROLE_NAME}} | 资源范围 | 状态条件 | 自操作限制 | 无权限表达 |
| --- | --- | --- | --- | --- | --- |
| 查看 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 创建 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 编辑 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 提交 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 审批 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 发布 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 撤回 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 删除 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 配置 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |
| 审计 | {{ALLOW_OR_DENY}} | {{RESOURCE_SCOPE}} | {{STATE_CONDITION}} | {{SELF_RESTRICTION}} | {{HIDE_DISABLE_OR_READONLY}} |

## 后台动作

| ID | 触发动作 | 后台处理 | 同步/异步 | 进度反馈 | 失败恢复 | 真实系统责任方 | Demo 表达 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REQ-006 | {{TRIGGER}} | {{PROCESS}} | {{SYNC_OR_ASYNC}} | {{PROGRESS}} | {{RECOVERY}} | {{OWNER_SYSTEM}} | {{MOCK_BEHAVIOR}} |

## 异常与边界

| ID | 场景 | 系统行为 | 用户反馈 | 恢复路径 | 证据类别 |
| --- | --- | --- | --- | --- | --- |
| REQ-007 | {{EDGE_CASE}} | {{SYSTEM_BEHAVIOR}} | {{USER_FEEDBACK}} | {{RECOVERY}} | {{EVIDENCE_CLASS}} |

## 假设与决策

| Decision ID | 内容 | 原类别 | 决策人 | 决策日期 | 影响 |
| --- | --- | --- | --- | --- | --- |
| DEC-001 | {{DECISION}} | {{INFERENCE_MOCK_OR_QUESTION}} | {{DECISION_OWNER}} | {{DATE}} | {{IMPACT}} |

## 变更记录

| 日期 | 变更 | 原因 | 影响的追踪 ID | 确认人 |
| --- | --- | --- | --- | --- |
| {{DATE}} | {{CHANGE}} | {{REASON}} | {{IDS}} | {{APPROVER}} |
