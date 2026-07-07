# LoopAI Vision

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Create initial Vision document.

Reason:
vision.md was empty.
Define the purpose and direction of LoopAI based on established architecture decisions.

Confirmed:

- LoopAI is an AI orchestration platform.
- Search is treated as a Connector capability.
- Agent, Orchestrator, and Pilot have separated responsibilities.
- User experience prioritizes intuitive operation.

---

# 1. Purpose

LoopAI aims to create an AI orchestration layer that receives human intent, selects appropriate AI agents and tools, and delivers completed results.

---

# 2. What LoopAI Is

LoopAI is not:

- A simple chatbot
- An AI comparison tool
- A search aggregator

LoopAI is:

An orchestration platform that coordinates multiple AI capabilities to complete tasks.

---

# 3. Core Concept

```
Human
  ↓
Pilot
  ↓
Orchestrator
  ↓
Agent
  ↓
Connector
```

Pilot understands user intent and provides interaction.

Orchestrator manages execution flow.

Agents perform specialized work.

Connectors provide external capabilities.

---

# 4. Design Principles

## AI is a team

Different AI systems have different strengths.

LoopAI does not depend on a single model.

---

## Search is a capability

Search is not the core product.

Search is one type of Connector.

---

## Transparency when needed

Default experience:

- Simple
- Intuitive
- Easy to use

Advanced experience:

- Execution visibility
- Agent activity
- System state

---

# 5. User Experience Goal

LoopAI should allow users to start working without manuals.

The system should:

- Hide unnecessary complexity
- Show important decisions
- Provide control when needed

---

# 6. Future Direction

LoopAI can expand through:

- New Agents
- New Connectors
- New Workflows
- Enterprise integrations
