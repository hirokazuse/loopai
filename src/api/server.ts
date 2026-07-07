// LoopAI Phase 2-A — Minimal API Layer over Phase 1 Engine
// Ref: docs/api.md
//
// Endpoints:
//   POST /ask            { prompt } -> { taskId, status }
//   GET  /status/:taskId -> { taskId, status, result? }
//   GET  /result/:taskId -> { taskId, result }
//   POST /stop/:taskId   -> { taskId, status }  (stub: Mock Agent completes too fast to interrupt)

import * as http from "http";
import { createTask, createWorkspace } from "../core/task/task";
import { Orchestrator } from "../orchestrator/orchestrator";
import { MockAgent } from "../agents/mock-agent";
import { Engine } from "../engine/engine";
import { Task, Workspace } from "../types/contracts";

const PORT = process.env.LOOPAI_API_PORT
  ? parseInt(process.env.LOOPAI_API_PORT, 10)
  : 3001;

// In-memory store. Fine for Phase 2-A validation only.
const tasks = new Map<string, Task>();
const workspaces = new Map<string, Workspace>();
let latestTaskId: string | null = null;

// UI-facing status, matching web/types/conversation.ts ConversationStatus
// plus two additions ("completed" / "failed") needed to represent
// Engine TaskState fully. See ui.md state-mapping table.
type UiStatus = "idle" | "generating" | "waitingUser" | "interrupted" | "completed" | "failed";

function toUiStatus(task: Task): UiStatus {
  switch (task.state) {
    case "CREATED":
      return "generating";
    case "RUNNING":
      return "generating";
    case "WAITING":
      return "waitingUser";
    case "COMPLETED":
      return "completed";
    case "FAILED":
      return "failed";
  }
}

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function handleAsk(req: http.IncomingMessage, res: http.ServerResponse) {
  const body = await readBody(req);
  let prompt = "";
  try {
    const parsed = JSON.parse(body || "{}");
    prompt = parsed.prompt ?? "";
  } catch {
    return sendJson(res, 400, { error: "invalid JSON body" });
  }
  if (!prompt) {
    return sendJson(res, 400, { error: "prompt is required" });
  }

  const task = createTask(prompt);
  const workspace = createWorkspace(task);
  tasks.set(task.id, task);
  workspaces.set(task.id, workspace);
  latestTaskId = task.id;

  const orchestrator = new Orchestrator({ agent: new MockAgent() });
  const engine = new Engine(orchestrator);

  // Run in background; /status polls for completion.
  engine.runTask(task, workspace).then((updated) => {
    tasks.set(updated.id, updated);
  });

  sendJson(res, 200, { taskId: task.id, status: toUiStatus(task), session: task.id });
}

function handleStatus(taskId: string, res: http.ServerResponse) {
  const task = tasks.get(taskId);
  if (!task) return sendJson(res, 404, { error: "task not found" });
  sendJson(res, 200, {
    taskId: task.id,
    status: toUiStatus(task),
    result: task.result,
    error: task.error,
  });
}

function handleResult(taskId: string, res: http.ServerResponse) {
  const task = tasks.get(taskId);
  if (!task) return sendJson(res, 404, { error: "task not found" });
  sendJson(res, 200, { taskId: task.id, result: task.result ?? null });
}

function handleStop(taskId: string, res: http.ServerResponse) {
  const task = tasks.get(taskId);
  if (!task) return sendJson(res, 404, { error: "task not found" });
  // Mock Agent completes synchronously/instantly in Phase 1, so there is
  // nothing to interrupt yet. Real interruption arrives once Orchestrator
  // supports cancellation tokens (see orchestrator-contract.md, future work).
  sendJson(res, 200, { taskId: task.id, status: toUiStatus(task) });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean); // e.g. ["status", "task_1"]

  try {
    if (req.method === "POST" && parts[0] === "ask" && parts.length === 1) {
      return await handleAsk(req, res);
    }
    if (req.method === "GET" && parts[0] === "status") {
      const id = parts[1] ?? latestTaskId;
      if (!id) return sendJson(res, 200, { status: "idle" });
      return handleStatus(id, res);
    }
    if (req.method === "GET" && parts[0] === "result") {
      const id = parts[1] ?? latestTaskId;
      if (!id) return sendJson(res, 404, { error: "no task yet" });
      return handleResult(id, res);
    }
    if (req.method === "POST" && parts[0] === "stop") {
      const id = parts[1] ?? latestTaskId;
      if (!id) return sendJson(res, 404, { error: "no task yet" });
      return handleStop(id, res);
    }
    sendJson(res, 404, { error: "not found" });
  } catch (err) {
    sendJson(res, 500, { error: err instanceof Error ? err.message : "unknown error" });
  }
});

server.listen(PORT, () => {
  console.log(`LoopAI Phase 1 API listening on http://localhost:${PORT}`);
});
