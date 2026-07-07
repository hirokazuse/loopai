"use strict";
// LoopAI Phase 1 — Exit condition check
// User Request -> Task/Workspace生成 -> Orchestrator起動 -> Mock Agent実行 -> State更新 -> Result保存
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("./core/task/task");
const orchestrator_1 = require("./orchestrator/orchestrator");
const mock_agent_1 = require("./agents/mock-agent");
const engine_1 = require("./engine/engine");
console.log("script loaded");
console.log("script loaded");
async function main() {
    const task = (0, task_1.createTask)("千葉の畑スケジュールを整理して");
    const workspace = (0, task_1.createWorkspace)(task);
    const orchestrator = new orchestrator_1.Orchestrator({ agent: new mock_agent_1.MockAgent() });
    const engine = new engine_1.Engine(orchestrator);
    const result = await engine.runTask(task, workspace);
    console.log("Task state:", result.state);
    console.log("Result:", result.result);
    console.log("Workspace events:", workspace.events.map((e) => e.type));
}
main().catch((err) => {
    console.error("ERROR:", err);
    process.exit(1);
});
