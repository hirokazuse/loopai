// LoopAI Phase 1 — Engine Runner
// Ref: docs/engine.md

import { Task, Workspace, WorkspaceEvent } from "../types/contracts";
import { Orchestrator } from "../orchestrator/orchestrator";

let eventCounter = 0;
function nextEventId(): string {
  eventCounter++;
  return `evt_${eventCounter}`;
}

function logEvent(
  workspace: Workspace,
  type: WorkspaceEvent["type"],
  payload?: Record<string, unknown>
): void {
  workspace.events.push({
    id: nextEventId(),
    type,
    timestamp: new Date().toISOString(),
    payload,
  });
}

// Engine executes what Orchestrator decides. It manages state and the
// Workspace log, but does not decide business logic (see engine.md).
export class Engine {
  private orchestrator: Orchestrator;

  constructor(orchestrator: Orchestrator) {
    this.orchestrator = orchestrator;
  }

  async runTask(task: Task, workspace: Workspace): Promise<Task> {
    logEvent(workspace, "TASK_CREATED", { taskId: task.id });

    logEvent(workspace, "AGENT_STARTED", { taskId: task.id });

    const updated = await this.orchestrator.run(task);

    logEvent(workspace, "STATE_CHANGED", { state: updated.state });

    if (updated.state === "FAILED") {
      logEvent(workspace, "AGENT_FAILED", { error: updated.error });
    } else {
      logEvent(workspace, "AGENT_COMPLETED", { result: updated.result });
    }

    updated.updatedAt = new Date().toISOString();
    return updated;
  }
}
