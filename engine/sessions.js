const path = require('path');

class SessionManager {
  constructor(baseDir = path.join(__dirname, 'sessions')) {
    this.baseDir = baseDir;
  }

  get(userId = 'default') {
    return {
      userId: 'default',
      chatgptSessionPath: path.join(this.baseDir, 'default', 'chatgpt'),
      claudeSessionPath: path.join(this.baseDir, 'default', 'claude'),
      geminiSessionPath: path.join(this.baseDir, 'default', 'gemini'),
    };
  }

  release(userId) {
    // Ver.0.1では何もしない
  }
}

module.exports = { SessionManager };
