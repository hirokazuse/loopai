"use strict";
// LoopAI Phase 1 — Orchestrator
// Ref: docs/orchestrator-contract.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const state_machine_1 = require("../core/state/state-machine");
// Orchestrator decides execution flow. It does not perform task work itself
// (see orchestrator-contract.md: Does not / Generate final content, Perform research itself).
class Orchestrator {
    constructor(deps) {
        this.agent = deps.agent;
    }
    async run(task) {
        let current = { ...task };
        current.state = this.setState(current.state, "RUNNING");
        const input = {
            taskId: current.id,
            request: current.request,
        };
        const result = await this.agent.execute(input);
        if (result.state === "FAILED") {
            current.state = this.setState(current.state, "FAILED");
            current.error = result.error;
            return current;
        }
        current.state = this.setState(current.state, "COMPLETED");
        current.result = {
            taskId: current.id,
            output: result.output?.summary ?? "(no output returned)",
            approved: true, // Phase 1: no Review Agent gating yet.
        };
        return current;
    }
    setState(from, to) {
        return (0, state_machine_1.transition)(from, to);
    }
}
exports.Orchestrator = Orchestrator;
