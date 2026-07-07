// LoopAI Phase 1 — Orchestrator
// Ref: docs/orchestrator-contract.md

import { Agent, AgentInput, Task, TaskState } from "../types/contracts";
import { transition } from "../core/state/state-machine";

export interface OrchestratorDeps {
  agent: Agent; // Phase 1: single Mock Agent. Later: Agent selection logic.
}

// Orchestrator decides execution flow. It does not perform task work itself
// (see orchestrator-contract.md: Does not / Generate final content, Perform research itself).
export class Orchestrator {
  private agent: Agent;

  constructor(deps: OrchestratorDeps) {
    this.agent = deps.agent;
  }

  async run(task: Task): Promise<Task> {
    let current = { ...task };

    current.state = this.setState(current.state, "RUNNING");

    const input: AgentInput = {
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
      output:
        (result.output?.summary as string) ?? "(no output returned)",
      approved: true, // Phase 1: no Review Agent gating yet.
    };

    return current;
  }

  private setState(from: TaskState, to: TaskState): TaskState {
    return transition(from, to);
  }
}
