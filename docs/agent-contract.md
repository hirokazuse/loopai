# LoopAI Agent Contract

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:06

Decision:
Agent Contractを先に定義する。Orchestratorの責務はAgent Contractの集合から逆算する。

Reason:
先にOrchestratorを書くと抽象論になりやすい。
Agentの責務境界（does / does not）を先に固めることで、実行順序・失敗時の再実行判断・人間確認ポイントが自然に決まる。

Status:
agent-contract.md Ver0.1 の内容確定。

Defined Agents:

- Research Agent
- Analysis Agent
- Writer Agent
- Review Agent

Next:
agent-contract.md詳細定義。
その後 architecture.md に Orchestrator Contract を追加する。

---

# 1. Agent Contract Principles

## Core Rule

Agent executes assigned responsibility only.

Agent does not:

- Control another Agent
- Change workflow
- Decide retry
- Request human approval

These decisions belong to Orchestrator.

---

# 2. Agent Definition Template

Each Agent must define:

- Responsibility
- Does
- Does not
- Input
- Output
- Connector
- Failure Handling
- State

---

# 3. Research Agent

## Responsibility

Collect required information.

## Does

- Search information
- Collect references
- Extract facts

## Does not

- Make final decisions
- Create final response

## Input

- Task description
- Research requirements

## Output

ResearchResult

Example:

```json
{
  "facts": [],
  "sources": [],
  "confidence": ""
}
```

## Connector

- Search Connector
- Knowledge Connector

## Failure Handling

Agent:

- Detect failure
- Return error information

Orchestrator:

- Decide retry
- Decide fallback
- Decide human approval

---

# 4. Analysis Agent

## Responsibility

Analyze collected information.

## Does

- Compare options
- Evaluate risks
- Identify patterns

## Does not

- Collect raw information
- Write final response

## Input

ResearchResult

## Output

AnalysisResult

## Connector

- LLM Connector

## Failure Handling

Agent:

- Detect failure
- Return error information

Orchestrator:

- Decide retry
- Decide fallback
- Decide human approval

---

# 5. Writer Agent

## Responsibility

Create user-facing response.

## Does

- Structure information
- Adjust explanation level
- Create final answer

## Does not

- Modify facts
- Invent missing information
- Change analysis conclusions

## Input

AnalysisResult

## Output

FinalResponse

## Connector

- LLM Connector

## Failure Handling

Agent:

- Detect failure
- Return error information

Orchestrator:

- Decide retry
- Decide fallback
- Decide human approval

---

# 6. Review Agent

## Responsibility

Validate quality before delivery.

## Does

- Check consistency
- Detect missing points
- Identify risks

## Does not

- Replace original analysis
- Rewrite entire response automatically

## Input

FinalResponse

## Output

ReviewResult

Example:

```json
{
  "approved": true,
  "issues": []
}
```

## Connector

- LLM Connector

## Failure Handling

Agent:

- Detect failure
- Return error information

Orchestrator:

- Decide retry
- Decide fallback
- Decide human approval

---

# 7. Agent State

Initial states:

- CREATED
- READY
- RUNNING
- COMPLETED
- FAILED
- WAITING_FOR_APPROVAL
