// LoopAI Phase 1 — Exit condition check
// User Request -> Task/Workspace生成 -> Orchestrator起動 -> Mock Agent実行 -> State更新 -> Result保存

import { createTask, createWorkspace } from "./core/task/task";
import { Orchestrator } from "./orchestrator/orchestrator";
import { MockAgent } from "./agents/mock-agent";
import { Engine } from "./engine/engine";

console.log("script loaded");
console.log("script loaded");
async function main() {
  const task = createTask("千葉の畑スケジュールを整理して");
  const workspace = createWorkspace(task);

  const orchestrator = new Orchestrator({ agent: new MockAgent() });
  const engine = new Engine(orchestrator);

  const result = await engine.runTask(task, workspace);

  console.log("Task state:", result.state);
  console.log("Result:", result.result);
  console.log("Workspace events:", workspace.events.map((e) => e.type));
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
