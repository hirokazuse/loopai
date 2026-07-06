const { ChatGPTConnector } = require('./connectors/chatgpt');

// 拡張ポイント: 対応するConnectorをここに登録していく
const REGISTRY = {
  chatgpt: ChatGPTConnector,
  // claude: ClaudeConnector,   // 未実装
  // gemini: GeminiConnector,   // 未実装
};

class ConnectorFactory {
  constructor() {
    this.instances = new Map(); // connectorId -> 起動済みインスタンス
  }

  async get(connectorId) {
    if (this.instances.has(connectorId)) {
      return this.instances.get(connectorId);
    }
    const ConnectorClass = REGISTRY[connectorId];
    if (!ConnectorClass) {
      throw new Error(`Unknown connector: ${connectorId}`);
    }
    const instance = new ConnectorClass();
    await instance.init();
    this.instances.set(connectorId, instance);
    return instance;
  }
}

module.exports = { ConnectorFactory };
