"use strict";
// LoopAI Phase 1 — Task State Machine
// Ref: docs/engine.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTransitionError = void 0;
exports.canTransition = canTransition;
exports.transition = transition;
const TRANSITIONS = {
    CREATED: ["RUNNING", "FAILED"],
    RUNNING: ["WAITING", "COMPLETED", "FAILED"],
    WAITING: ["RUNNING", "COMPLETED", "FAILED"],
    COMPLETED: [],
    FAILED: [],
};
class InvalidTransitionError extends Error {
    constructor(from, to) {
        super(`Invalid task state transition: ${from} -> ${to}`);
        this.name = "InvalidTransitionError";
    }
}
exports.InvalidTransitionError = InvalidTransitionError;
function canTransition(from, to) {
    return (TRANSITIONS[from] ?? []).includes(to);
}
function transition(from, to) {
    if (!canTransition(from, to)) {
        throw new InvalidTransitionError(from, to);
    }
    return to;
}
