"use strict";
// LoopAI Phase 1 — Mock Agent
// Ref: docs/agent-contract.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAgent = void 0;
const base_agent_1 = require("./base-agent");
// MockAgent: does no real work, just proves the execution loop
// (Task -> Orchestrator -> Agent -> Result) functions end to end.
class MockAgent extends base_agent_1.BaseAgent {
    constructor() {
        super(...arguments);
        this.id = "mock-agent";
    }
    async execute(input) {
        try {
            return {
                agentId: this.id,
                state: "COMPLETED",
                output: {
                    summary: `Mock response for: "${input.request}"`,
                },
            };
        }
        catch (err) {
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
exports.MockAgent = MockAgent;
