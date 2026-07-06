const { ChatGPTConnector } = require('./connectors/chatgpt');

async function main() {
  const gpt = new ChatGPTConnector();
  await gpt.init();

  console.log('ログインが終わったらEnterキーを押してください...');
  await new Promise((resolve) => process.stdin.once('data', resolve));

  const reply = await gpt.sendPrompt('こんにちは。1文だけ自己紹介してください。');
  console.log('--- ChatGPT回答 ---');
  console.log(reply);

  await gpt.close();
}

main();
