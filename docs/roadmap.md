# LoopAI Roadmap

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create LoopAI development roadmap.

Basis:
Roadmap is defined after Vision, Architecture, Contract, Engine, UI, API are established.

Confirmed:

- Roadmap is phased to protect responsibility boundaries, not to list features.
- First milestone is the core loop (request → orchestrate → agent → result), not a feature-complete assistant.

---

# Phase 0: Architecture Foundation

Completed:

- Vision
- Architecture
- Agent Contract
- Orchestrator Contract
- Connector Contract

Purpose:

責務境界を固定する。

---

# Phase 1: Prototype Runtime

Target:

- Engine state management
- Task lifecycle (CREATED → RUNNING → WAITING → COMPLETED / FAILED)
- Basic Orchestrator
- Mock Agent execution

Purpose:

AIオーケストレーションの流れを確認する。

Exit condition:

人間が依頼する → Orchestratorが流れを管理する → Agentが役割分担する → 結果が返る、という循環が動作すること。

---

# Phase 2: Pilot UI

Target:

- Chat interface (default view)
- State display (user-facing labels per ui.md)
- Stop / Resume
- Optional expanded detail view

Purpose:

触れば分かるUX。

---

# Phase 3: Connector Expansion

Target:

- LLM Connector
- Search Connector
- Data Connector
- Tool Connector

Purpose:

外部能力を拡張する。Agent側の変更なしに接続先を追加・交換できることを確認する。

---

# Phase 4: Production Platform

Target:

- Authentication
- Workspace persistence
- Multi-user session
- Monitoring

---

# Relation to Other Documents

- Runtime/state details: see engine.md
- Responsibility boundaries: see agent-contract.md, orchestrator-contract.md, connector.md
- UI behavior per phase: see ui.md
- API surface per phase: see api.md
