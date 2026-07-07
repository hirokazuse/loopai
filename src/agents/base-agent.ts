// LoopAI Phase 1 — Base Agent
// Ref: docs/agent-contract.md

import { Agent, AgentInput, AgentResult } from "../types/contracts";

// All Agents (mock or real) extend this shell.
// BaseAgent enforces the contract: execute assigned task, return structured result.
// It does not control other Agents or decide workflow (see agent-contract.md).
export abstract class BaseAgent implements Agent {
  abstract id: string;
  abstract execute(input: AgentInput): Promise<AgentResult>;
}
