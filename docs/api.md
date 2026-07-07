# LoopAI API

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create initial API document.

Reason:
api.md was empty.
Define the communication boundary between Pilot UI and Engine.

Confirmed:

- API is a communication boundary, not a decision layer.
- API does not execute Agents or call Connectors directly.
- Initial endpoints: /ask, /status, /stop, /result.

---

# 1. Purpose

API connects Pilot UI to Engine.

```
Pilot UI
  ↓
API
  ↓
Engine
  ↓
Orchestrator
```

---

# 2. Responsibilities

## Does

- Receive requests from Pilot UI
- Forward requests to Engine
- Return execution state
- Return results

## Does not

- Decide workflow
- Execute Agents directly
- Call Connectors directly

---

# 3. Endpoints (Ver0.1)

## POST /ask

Purpose:

Create a new task execution.

Input:

- User request text
- (optional) target connector / agent hint

Output:

- Task ID
- Initial state (CREATED)

---

## GET /status

Purpose:

Get current execution state for a task.

Input:

- Task ID

Output:

- Engine state (see engine.md)
- Current Agent (if applicable)

---

## POST /stop

Purpose:

Interrupt an in-progress task.

Input:

- Task ID

Output:

- Updated state (should transition per orchestrator-contract.md handling)

---

## GET /result

Purpose:

Get the completed output for a task.

Input:

- Task ID

Output:

- Final result
- Completion state

---

# 4. Relation to Other Documents

- Task/Engine states returned by /status: see engine.md
- User-facing state labels shown in UI: see ui.md
- Retry / approval decisions triggered via API calls: see orchestrator-contract.md

---

# 5. Out of Scope (Ver0.1)

- Authentication / authorization details
- Rate limiting
- Checkpoint / Rewind endpoints (pending UI/Engine integration design)
