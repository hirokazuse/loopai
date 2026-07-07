"use strict";
// LoopAI Phase 1 — Task / Workspace factories
// Ref: docs/architecture.md (Workspace = Single Source of Truth)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.createWorkspace = createWorkspace;
let taskCounter = 0;
let workspaceCounter = 0;
function createTask(request) {
    taskCounter++;
    const now = new Date().toISOString();
    return {
        id: `task_${taskCounter}`,
        request,
        state: "CREATED",
        createdAt: now,
        updatedAt: now,
        workspaceId: "", // set by createWorkspace
    };
}
function createWorkspace(task) {
    workspaceCounter++;
    const workspace = {
        id: `ws_${workspaceCounter}`,
        taskId: task.id,
        createdAt: new Date().toISOString(),
        events: [],
        context: {},
    };
    task.workspaceId = workspace.id;
    return workspace;
}
