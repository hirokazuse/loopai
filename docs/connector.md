# LoopAI Connector Contract

Version: 0.1
Status: Draft

---

## Update History

### 2026/7/7 17:16

Decision:
Connectorを外部能力提供の抽象契約として定義する。

Reason:
Connector Contractがないと、実装時に以下が曖昧になる。

- Agentが直接APIを呼んでよいか
- Connectorが認証を管理するか
- SearchはAgentかConnectorか
- LLM切替はどの層で行うか
- 将来のERP/API連携をどう扱うか

Status:
Connector Contract Ver0.1 作成完了。

Next:
vision.md確認、および各Connector種別ごとの詳細仕様（connector-llm.md等）の要否を検討する。

---

# 1. Responsibility

## Core Rule

Connector is an Adapter that provides external capability to Agents.

## Does

- Connect to external service
- Manage authentication
- Transform request / response
- Return errors in a structured format

## Does not

- Make task decisions
- Control Agents
- Change workflow

これらの判断はAgent / Orchestratorが担当する。

---

# 2. Position in Architecture

```
Agent
  ↓
Connector
  ↓
External Service
```

Agentは処理内容を判断し、Connectorはその実行手段を提供する。
AgentはConnectorの実装（どのLLM、どのAPIか）を意識しない。

---

# 3. Connector Types

## LLM Connector

Purpose:

Provide language model capability.

Examples:

- OpenAI
- Anthropic
- Google
- Local LLM

---

## Search Connector

Purpose:

Provide information retrieval capability.

Examples:

- Web Search
- Knowledge Base

---

## Data Connector

Purpose:

Provide structured data access.

Examples:

- Database
- Spreadsheet
- ERP

---

## Tool Connector

Purpose:

Provide action / automation capability.

Examples:

- Browser
- Automation
- External API

---

# 4. Connector Interface (Common Contract)

Each Connector must define:

- Capability type (LLM / Search / Data / Tool)
- Input format
- Output format
- Authentication method
- Failure format

## Input

Task-specific request payload from Agent.

## Output

ConnectorResult

Example:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## Failure Handling

Connector:

- Detect failure (auth error, timeout, rate limit, etc.)
- Return structured error

Orchestrator:

- Decide retry / fallback (per orchestrator-contract.md)

---

# 5. Replaceability

Connector実装は、契約（Input/Output/Failure形式）を満たす限り自由に交換できる。

例:

- Writer AgentはLLM Connectorの種類（GPT / Claude / Gemini）を意識しない
- Research AgentはSearch Connectorの実装（Web Search / 内部DB）を意識しない

これはLoopAIの拡張性の中心であり、Agent側のコード変更なしにConnectorを追加・交換できることを目的とする。

---

# 6. Out of Scope (Ver0.1)

以下は将来のバージョンで検討する。

- 個別Connector（LLM Connector, Search Connector等）の詳細仕様書
- 認証情報の具体的な管理方式
- レート制限・コスト管理
