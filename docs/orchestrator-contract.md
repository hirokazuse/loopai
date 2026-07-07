# LoopAI Orchestrator Contract

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:06

Decision:
OrchestratorをAgentとは別責務として定義する。

Reason:
Agentは専門処理を担当し、Orchestratorは実行制御を担当する。
責務を分離することで、Agent追加・Connector変更時にもWorkflow設計を維持できる。

Status:
Orchestrator Contract Ver0.1 作成完了。

Next:
architecture.mdへ全体構造として反映する（詳細はagent-contract.md / orchestrator-contract.mdを参照する形にする）。

---

# Orchestrator Contract

## Responsibility

Manage execution flow between Agents.

Orchestrator does not perform domain tasks.
It coordinates execution.

---

## Does

- Select Agent sequence
- Pass inputs between Agents
- Handle failures
- Request human approval when required
- Track execution state

## Does not

- Generate final content
- Perform research itself
- Replace specialized Agents
- Make domain decisions

---

## Three Layer Decision Model

### Agent = 専門作業者

Decision:

このタスクの中身をどう処理するか。

Responsibilities:

- Execute assigned task
- Return structured result
- Report failure

Does not:

- Control workflow
- Select next Agent

---

### Orchestrator = 進行管理者

Decision:

次に何を動かすか。
失敗をどう扱うか。

Responsibilities:

- Select Agent execution order
- Pass context between Agents
- Manage task state
- Handle failures
- Request human approval

Does not:

- Generate final content
- Perform research itself
- Replace specialized Agents

---

### Pilot = 人間との接点

Decision:

人間の意図を伝える。
必要な承認を出す。

Responsibilities:

- Receive user request
- Display progress
- Ask for approval when required
- Present final result

Does not:

- Manage Agent execution directly

---

## Failure Handling Ownership

Agent:

- Detect failure
- Return error information

Orchestrator:

- Decide retry
- Decide fallback
- Decide human approval

---

## Execution State

Orchestrator tracks task-level state across Agents:

- PENDING
- RUNNING
- WAITING_FOR_APPROVAL
- COMPLETED
- FAILED
