# {{PROJECT_NAME}} Demo 演示脚本

> Demo 版本：{{VERSION}}
> 演示日期：{{DATE}}
> 目标听众：{{AUDIENCE}}
> 对应产品合同：{{PRODUCT_VERSION}}

演示中的结论使用 `PRD 明确`、`基于 PRD 推导`、`Demo Mock` 或 `待产品确认` 标记；不要把 Mock 表现说成已确认的真实能力。

## 演示目标

- 业务问题：{{BUSINESS_PROBLEM}}
- 核心角色：{{PRIMARY_ROLE}}
- 要证明的产品价值：{{VALUE}}
- 本次不证明：{{OUT_OF_SCOPE}}

## 前置状态

| 项目 | 初始值 | 原因 |
| --- | --- | --- |
| 登录角色 | {{ROLE}} | {{REASON}} |
| 当前对象 | {{OBJECT_AND_STATE}} | {{REASON}} |
| Mock 数据集 | {{FIXTURE}} | {{COVERAGE}} |
| 页面状态面板 | {{STATE_PANEL_SETTING}} | {{PURPOSE}} |

## 演示步骤

### 场景 1：{{SCENARIO_NAME}}

| 步骤 | 可见操作 | 预期界面反馈 | 模拟的后台动作 | 要说明的业务决策 | 证据类别 | 追踪 ID |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | {{VISIBLE_ACTION}} | {{UI_FEEDBACK}} | {{MOCK_BACKGROUND_ACTION}} | {{DECISION}} | {{EVIDENCE_CLASS}} | {{REQ_IDS}} |

### 异常或权限分支

| 场景 | 如何触发 | 预期反馈 | 恢复路径 | 演示目的 |
| --- | --- | --- | --- | --- |
| {{EDGE_CASE}} | {{TRIGGER}} | {{FEEDBACK}} | {{RECOVERY}} | {{PURPOSE}} |

## Mock 边界

| Demo 表现 | 当前实现 | 真实系统需要 | 不应声称的能力 |
| --- | --- | --- | --- |
| {{BEHAVIOR}} | {{FRONTEND_MOCK}} | {{BACKEND_OR_SERVICE}} | {{LIMITATION}} |

## 研发说明

| 主题 | 当前产品合同 | 建议接口/数据 | 风险或待确认 |
| --- | --- | --- | --- |
| {{TOPIC}} | {{CONTRACT}} | {{API_OR_DATA}} | {{RISK}} |

## 验证清单

- [ ] 使用正确角色和初始数据。
- [ ] P0 流程从入口走到结果。
- [ ] 关键按钮、菜单和弹层都有反馈。
- [ ] 至少展示一个异常、空或无权限状态。
- [ ] 明确指出 Mock 与真实系统边界。
- [ ] 浏览器控制台无未解释异常。
- [ ] 汇报后记录产品与研发的新决策。
