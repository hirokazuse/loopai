// LoopAI Phase 1 — Task / Workspace factories
// Ref: docs/architecture.md (Workspace = Single Source of Truth)

import { Task, Workspace } from "../../types/contracts";

let taskCounter = 0;
let workspaceCounter = 0;

export function createTask(request: string): Task {
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

export function createWorkspace(task: Task): Workspace {
  workspaceCounter++;
  const workspace: Workspace = {
    id: `ws_${workspaceCounter}`,
    taskId: task.id,
    createdAt: new Date().toISOString(),
    events: [],
    context: {},
  };
  task.workspaceId = workspace.id;
  return workspace;
}
