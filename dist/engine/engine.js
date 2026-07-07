"use strict";
// LoopAI Phase 1 — Engine Runner
// Ref: docs/engine.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
let eventCounter = 0;
function nextEventId() {
    eventCounter++;
    return `evt_${eventCounter}`;
}
function logEvent(workspace, type, payload) {
    workspace.events.push({
        id: nextEventId(),
        type,
        timestamp: new Date().toISOString(),
        payload,
    });
}
// Engine executes what Orchestrator decides. It manages state and the
// Workspace log, but does not decide business logic (see engine.md).
class Engine {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    async runTask(task, workspace) {
        logEvent(workspace, "TASK_CREATED", { taskId: task.id });
        logEvent(workspace, "AGENT_STARTED", { taskId: task.id });
        const updated = await this.orchestrator.run(task);
        logEvent(workspace, "STATE_CHANGED", { state: updated.state });
        if (updated.state === "FAILED") {
            logEvent(workspace, "AGENT_FAILED", { error: updated.error });
        }
        else {
            logEvent(workspace, "AGENT_COMPLETED", { result: updated.result });
        }
        updated.updatedAt = new Date().toISOString();
        return updated;
    }
}
exports.Engine = Engine;
