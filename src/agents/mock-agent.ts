// LoopAI Phase 1 — Mock Agent
// Ref: docs/agent-contract.md

import { AgentInput, AgentResult } from "../types/contracts";
import { BaseAgent } from "./base-agent";

// MockAgent: does no real work, just proves the execution loop
// (Task -> Orchestrator -> Agent -> Result) functions end to end.
export class MockAgent extends BaseAgent {
  id = "mock-agent";

  async execute(input: AgentInput): Promise<AgentResult> {
    try {
      return {
        agentId: this.id,
        state: "COMPLETED",
        output: {
          summary: `Mock response for: "${input.request}"`,
        },
      };
    } catch (err) {
      return {
        agentId: this.id,
        state: "FAILED",
        error: {
          reason: err instanceof Error ? err.message : "Unknown error",
        },
      };
    }
  }
}
