const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');

chromium.use(stealth);

const SESSION_PATH = path.join(__dirname, '..', 'sessions', 'default', 'chatgpt');

const SELECTORS = {
  editable: 'div[contenteditable="true"]:visible',
  stopButton: '[data-testid="stop-button"], button[aria-label*="Stop"]',
  assistantMessage: '[data-message-author-role="assistant"]',
};

class ChatGPTConnector {
  constructor() {
    this.context = null;
    this.page = null;
  }

  async init() {
    this.context = await chromium.launchPersistentContext(SESSION_PATH, {
      headless: false,
      channel: 'chrome',
      viewport: { width: 1280, height: 800 },
    });
    this.page = await this.context.newPage();
    await this.page.goto('https://chatgpt.com/', { waitUntil: 'networkidle' });
  }

  input() {
    return this.page.locator(SELECTORS.editable).first();
  }

  stopBtn() {
    return this.page.locator(SELECTORS.stopButton).first();
  }

  async ensureReady(timeout = 15000) {
    await this.input().waitFor({ state: 'visible', timeout });
  }

  async extractLatestText() {
    const messages = this.page.locator(SELECTORS.assistantMessage);
    const count = await messages.count();
    if (count === 0) return '';
    return await messages.nth(count - 1).innerText();
  }

  async sendPrompt(text) {
    await this.ensureReady();
    const input = this.input();
    await input.click();
    await input.fill(text);
    await input.press('Enter');

    // 生成開始確認
    await this.stopBtn().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    // 生成終了確認: stopボタンが消え、かつ入力欄が復帰する
    await this.stopBtn().waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {});
    await this.ensureReady(15000).catch(() => {});

    return await this.extractLatestText();
  }

  async interrupt() {
    const stopBtn = this.stopBtn();
    const visible = await stopBtn.isVisible().catch(() => false);
    if (!visible) {
      return { stopped: false, partial: await this.extractLatestText() };
    }
    const partial = await this.extractLatestText();
    await stopBtn.click();
    return { stopped: true, partial };
  }

  async close() {
    await this.context.close();
  }
}

module.exports = { ChatGPTConnector };
