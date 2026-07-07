"use strict";
// LoopAI Phase 1 — Base Agent
// Ref: docs/agent-contract.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
// All Agents (mock or real) extend this shell.
// BaseAgent enforces the contract: execute assigned task, return structured result.
// It does not control other Agents or decide workflow (see agent-contract.md).
class BaseAgent {
}
exports.BaseAgent = BaseAgent;
