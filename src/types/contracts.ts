// LoopAI Phase 1 — Core Type Contracts
// Ref: docs/agent-contract.md, docs/orchestrator-contract.md, docs/engine.md

// ---------- Task ----------

export type TaskState =
  | "CREATED"
  | "RUNNING"
  | "WAITING"
  | "COMPLETED"
  | "FAILED";

export interface Task {
  id: string;
  request: string;
  state: TaskState;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  result?: FinalResult;
  error?: TaskError;
}

export interface TaskError {
  reason: string;
  missingInformation?: string[];
  retrySuggestion?: string;
}

// ---------- Workspace ----------
// Workspace = Single Source of Truth (see architecture.md)

export interface Workspace {
  id: string;
  taskId: string;
  createdAt: string;
  events: WorkspaceEvent[];
  context: Record<string, unknown>;
}

// ---------- Event ----------
// Append-only log of everything that happens inside a Workspace.

export type EventType =
  | "TASK_CREATED"
  | "AGENT_STARTED"
  | "AGENT_COMPLETED"
  | "AGENT_FAILED"
  | "STATE_CHANGED"
  | "HUMAN_APPROVAL_REQUESTED"
  | "HUMAN_APPROVAL_RECEIVED";

export interface WorkspaceEvent {
  id: string;
  type: EventType;
  timestamp: string;
  agentId?: string;
  payload?: Record<string, unknown>;
}

// ---------- Agent ----------
// See agent-contract.md for responsibility boundaries.

export type AgentState = "READY" | "RUNNING" | "COMPLETED" | "FAILED";

export interface AgentResult {
  agentId: string;
  state: AgentState;
  output?: Record<string, unknown>;
  error?: TaskError;
}

export interface AgentInput {
  taskId: string;
  request: string;
  context?: Record<string, unknown>;
}

// Every Agent (mock or real) must implement this contract.
export interface Agent {
  id: string;
  execute(input: AgentInput): Promise<AgentResult>;
}

// ---------- Final Result ----------

export interface FinalResult {
  taskId: string;
  output: string;
  approved: boolean;
}
