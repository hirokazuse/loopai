# LoopAI Architecture

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create initial architecture document.

Reason:
architecture.md was empty.
Define the overall system structure based on Agent Contract and Orchestrator Contract.

Confirmed:

- Agent responsibility is defined separately.
- Orchestrator responsibility is defined separately.
- Architecture describes system relationships, not detailed behavior.

---

# 1. Core Principle

LoopAI separates:

- Human interaction
- Workflow orchestration
- Specialized execution
- External capability access

The system is designed around clear responsibility boundaries.

---

# 2. Design Principles

## Workspace = Single Source of Truth

Workspace is the central context shared across:

- User
- Pilot
- Orchestrator
- Agents
- Connectors

All task state, artifacts, and decisions are managed through Workspace.

---

## Separation of Responsibility

LoopAI separates three major roles.

### Pilot

Human interface.

Responsibility:

- Receive user intent
- Display progress
- Request approval when necessary

Does not:

- Control workflow decisions

---

### Orchestrator

Workflow coordinator.

Responsibility:

- Manage execution flow
- Select Agent sequence
- Handle failures
- Manage approval points

Detailed definition:

See:
- orchestrator-contract.md

---

### Agent

Specialized task executor.

Responsibility:

- Perform assigned tasks
- Return structured results

Detailed definition:

See:
- agent-contract.md

---

# 3. Layer Structure

```
User
  ↓
Pilot UI
  ↓
Orchestrator
  ↓
Agent
  ↓
Connector
  ↓
External Service
```

---

# 4. Layer Definition

## Pilot Layer

Purpose:

Human interaction point.

---

## Orchestrator Layer

Purpose:

Coordinate execution.

The Orchestrator does not perform specialized tasks.

---

## Agent Layer

Purpose:

Execute specialized tasks.

Examples:

- Research
- Analysis
- Writing
- Review

---

## Connector Layer

Purpose:

Provide external capabilities.

Examples:

- LLM
- Search
- Database
- API
- Tools

Connector implementations can be replaced without changing Agent responsibilities.

---

# 5. Contract References

Detailed responsibility definitions:

Agent:

- agent-contract.md

Orchestrator:

- orchestrator-contract.md

Connector:

- connector.md

---

# 6. Architecture Goal

LoopAI aims to create an AI orchestration platform where:

- Humans provide intent.
- Orchestrator manages execution.
- Agents perform specialized work.
- Connectors provide capabilities.

The system can evolve by adding Agents and Connectors without changing the core architecture.
