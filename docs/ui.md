# LoopAI UI

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create initial UI document based on prototype evaluation (index.html / future-ui.html) and confirmed Vision/Architecture.

Reason:
ui.md was empty.
Prototype review concluded that the Claude-style conversational UI should be the default, with Operation-Center-style detail (Connector status, Timeline, Logs) available as an optional expanded view.

Confirmed:

- Default view is simple and conversation-centered.
- Detailed execution info is opt-in, not always visible.
- UI reflects Engine State, not internal implementation detail.

---

# 1. Purpose

Pilot UI is the human interaction point defined in architecture.md.

Pilot UI does not make decisions.
It reflects Orchestrator/Engine state and relays human intent.

---

# 2. Design Principles

## Priority

- 迷わない（入力場所が瞬時に分かる）
- 入力が中心
- 状態が分かる
- 必要時だけ詳細表示

## Avoid

- 内部ログの常時表示
- 開発者向け情報の常設
- 複雑な操作導線

---

# 3. Two-Layer View

## Default View

- Conversation with the user's request and final Agent/Orchestrator output
- Current state (e.g. "処理中です" / "回答が完了しました")
- Input box, always visible and reachable without scrolling

## Expanded View (optional, user-initiated)

- Agent activity (which Agent is running)
- Connector status
- Execution logs / timeline
- Checkpoint / Rewind controls

Expanded View maps to Operation-Center-style prototype elements, but is never shown by default.

---

# 4. State Display

UI displays Engine Task State (see engine.md) in plain language, not raw state names shown to non-technical users:

| Engine State | User-facing label |
|---|---|
| CREATED | 受け付けました |
| RUNNING | 処理中です |
| WAITING | 確認をお願いします |
| COMPLETED | 完了しました |
| FAILED | うまく進みませんでした |

Expanded View may show raw state names for developers.

---

# 5. Human Intervention Controls

Minimal, explicit, rare:

- Stop（停止）
- Redirect（修正）
- Checkpoint（保存）
- Rewind（やり直す）

These map to Orchestrator Contract's human approval and control points.
They are not shown as a constant 6-button row; only relevant controls appear based on current state.

---

# 6. Does / Does not

## Does

- Show user's request and final result clearly
- Reflect current Engine/Orchestrator state
- Provide optional access to execution detail
- Provide minimal, state-relevant controls

## Does not

- Make workflow decisions
- Display Agent internals by default
- Require the user to understand Engine/Agent/Connector terminology

---

# 7. Relation to Other Documents

- Engine states: see engine.md
- Agent behavior surfaced in Expanded View: see agent-contract.md
- Orchestrator-driven approval prompts: see orchestrator-contract.md
- API endpoints backing this UI: see api.md (pending)
