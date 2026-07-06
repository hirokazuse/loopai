const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');

chromium.use(stealth);

const SESSION_PATH = path.join(__dirname, 'sessions', 'default', 'chatgpt');

async function main() {
  const context = await chromium.launchPersistentContext(SESSION_PATH, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto('https://chatgpt.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('title:', await page.title());
  await page.screenshot({ path: '/tmp/1.png', fullPage: true });

  console.log('ログインが終わっていたらEnterキーを押してください...');
  await new Promise((resolve) => process.stdin.once('data', resolve));

  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/2.png', fullPage: true });

  const inputs = page.locator('textarea, input, div[contenteditable="true"]');
  const count = await inputs.count();
  console.log('candidate input count:', count);

  for (let i = 0; i < count; i++) {
    const el = inputs.nth(i);
    const box = await el.boundingBox();
    const tag = await el.evaluate((n) => n.tagName);
    console.log(`[${i}] tag=${tag} box=${JSON.stringify(box)}`);
  }

  console.log('確認が終わったらEnterキーを押すとブラウザを閉じます...');
  await new Promise((resolve) => process.stdin.once('data', resolve));
  await context.close();
}

main();
