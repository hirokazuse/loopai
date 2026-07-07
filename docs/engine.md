# LoopAI Engine

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create initial Engine document.

Reason:
engine.md was empty.
Define execution model connecting Architecture Layer and Contract Layer.

Confirmed:

- Orchestrator controls workflow.
- Engine executes workflow.
- Agents perform specialized tasks.
- Connectors provide external capabilities.

---

# 1. Purpose

Engine provides the runtime environment for LoopAI execution.

Engine does not decide task strategy.
Engine executes decisions made by Orchestrator.

---

# 2. Execution Model

```
User Request
  ↓
Pilot
  ↓
Orchestrator
  ↓
Engine
  ↓
Agent
  ↓
Connector
  ↓
External Service
```

---

# 3. Engine Responsibilities

## Does

- Create task execution context
- Manage execution state
- Invoke Agents
- Provide Connector access
- Store execution results
- Handle runtime errors

---

## Does not

- Decide business logic
- Replace Agents
- Generate final responses
- Select workflow strategy

---

# 4. State Management

Task State:

- CREATED
- RUNNING
- WAITING
- COMPLETED
- FAILED

Agent State:

- READY
- RUNNING
- COMPLETED
- FAILED

---

# 5. Error Handling

Engine receives failures from Agents and Connectors.

Engine:

- Records failure
- Returns status to Orchestrator

Orchestrator:

- Decides retry
- Decides fallback
- Decides approval

---

# 6. Connector Execution

Agents do not directly call external services.

Flow:

```
Agent
  ↓
Engine
  ↓
Connector
  ↓
External Service
```

---

# 7. Future Extension

Engine can support:

- Parallel Agent execution
- Queue management
- Workflow persistence
- Distributed execution
