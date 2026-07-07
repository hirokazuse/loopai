// LoopAI Phase 1 — Task State Machine
// Ref: docs/engine.md

import { TaskState } from "../../types/contracts";

const TRANSITIONS: Record<TaskState, TaskState[]> = {
  CREATED: ["RUNNING", "FAILED"],
  RUNNING: ["WAITING", "COMPLETED", "FAILED"],
  WAITING: ["RUNNING", "COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

export class InvalidTransitionError extends Error {
  constructor(from: TaskState, to: TaskState) {
    super(`Invalid task state transition: ${from} -> ${to}`);
    this.name = "InvalidTransitionError";
  }
}

export function canTransition(from: TaskState, to: TaskState): boolean {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export function transition(from: TaskState, to: TaskState): TaskState {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
  return to;
}
