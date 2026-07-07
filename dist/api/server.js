"use strict";
// LoopAI Phase 2-A — Minimal API Layer over Phase 1 Engine
// Ref: docs/api.md
//
// Endpoints:
//   POST /ask            { prompt } -> { taskId, status }
//   GET  /status/:taskId -> { taskId, status, result? }
//   GET  /result/:taskId -> { taskId, result }
//   POST /stop/:taskId   -> { taskId, status }  (stub: Mock Agent completes too fast to interrupt)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const task_1 = require("../core/task/task");
const orchestrator_1 = require("../orchestrator/orchestrator");
const mock_agent_1 = require("../agents/mock-agent");
const engine_1 = require("../engine/engine");
const PORT = process.env.LOOPAI_API_PORT
    ? parseInt(process.env.LOOPAI_API_PORT, 10)
    : 3001;
// In-memory store. Fine for Phase 2-A validation only.
const tasks = new Map();
const workspaces = new Map();
let latestTaskId = null;
function toUiStatus(task) {
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
function sendJson(res, status, body) {
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(JSON.stringify(body));
}
function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", reject);
    });
}
async function handleAsk(req, res) {
    const body = await readBody(req);
    let prompt = "";
    try {
        const parsed = JSON.parse(body || "{}");
        prompt = parsed.prompt ?? "";
    }
    catch {
        return sendJson(res, 400, { error: "invalid JSON body" });
    }
    if (!prompt) {
        return sendJson(res, 400, { error: "prompt is required" });
    }
    const task = (0, task_1.createTask)(prompt);
    const workspace = (0, task_1.createWorkspace)(task);
    tasks.set(task.id, task);
    workspaces.set(task.id, workspace);
    latestTaskId = task.id;
    const orchestrator = new orchestrator_1.Orchestrator({ agent: new mock_agent_1.MockAgent() });
    const engine = new engine_1.Engine(orchestrator);
    // Run in background; /status polls for completion.
    engine.runTask(task, workspace).then((updated) => {
        tasks.set(updated.id, updated);
    });
    sendJson(res, 200, { taskId: task.id, status: toUiStatus(task), session: task.id });
}
function handleStatus(taskId, res) {
    const task = tasks.get(taskId);
    if (!task)
        return sendJson(res, 404, { error: "task not found" });
    sendJson(res, 200, {
        taskId: task.id,
        status: toUiStatus(task),
        result: task.result,
        error: task.error,
    });
}
function handleResult(taskId, res) {
    const task = tasks.get(taskId);
    if (!task)
        return sendJson(res, 404, { error: "task not found" });
    sendJson(res, 200, { taskId: task.id, result: task.result ?? null });
}
function handleStop(taskId, res) {
    const task = tasks.get(taskId);
    if (!task)
        return sendJson(res, 404, { error: "task not found" });
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
            if (!id)
                return sendJson(res, 200, { status: "idle" });
            return handleStatus(id, res);
        }
        if (req.method === "GET" && parts[0] === "result") {
            const id = parts[1] ?? latestTaskId;
            if (!id)
                return sendJson(res, 404, { error: "no task yet" });
            return handleResult(id, res);
        }
        if (req.method === "POST" && parts[0] === "stop") {
            const id = parts[1] ?? latestTaskId;
            if (!id)
                return sendJson(res, 404, { error: "no task yet" });
            return handleStop(id, res);
        }
        sendJson(res, 404, { error: "not found" });
    }
    catch (err) {
        sendJson(res, 500, { error: err instanceof Error ? err.message : "unknown error" });
    }
});
server.listen(PORT, () => {
    console.log(`LoopAI Phase 1 API listening on http://localhost:${PORT}`);
});
