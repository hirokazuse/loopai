const express = require('express');
const cors = require('cors');
const { SessionManager } = require('./sessions');
const { ConnectorFactory } = require('./connector-factory');

const app = express();
app.use(cors());
app.use(express.json());

const sessionManager = new SessionManager();
const factory = new ConnectorFactory();

const state = {
  status: 'idle',      // idle | generating | interrupted | waitingUser
  text: '',
  connector: 'chatgpt',
};

let inFlight = false;

app.post('/ask', async (req, res) => {
  const session = sessionManager.get(req.body.userId);
  const { prompt, connector = 'chatgpt' } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }
  if (state.status === 'generating') {
    return res.status(409).json({ error: 'already generating' });
  }

  let conn;
  try {
    conn = await factory.get(connector);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  state.status = 'generating';
  state.text = '';
  state.connector = connector;
  inFlight = true;
  res.json({ status: state.status, connector, session: session.userId });

  try {
    const reply = await conn.sendPrompt(prompt);
    if (inFlight) {
      state.text = reply || '';
      state.status = 'waitingUser';
    }
  } catch (err) {
    console.error('sendPrompt error:', err.message);
    if (inFlight) {
      state.status = 'interrupted';
    }
  } finally {
    inFlight = false;
  }
});

app.post('/stop', async (req, res) => {
  const session = sessionManager.get(req.body.userId);

  if (state.status !== 'generating') {
    return res.json({ status: state.status, partial: state.text, session: session.userId });
  }

  const conn = await factory.get(state.connector);
  const result = await conn.interrupt();
  inFlight = false;
  state.status = 'interrupted';
  state.text = result.partial || state.text;

  res.json({ status: state.status, partial: state.text, session: session.userId });
});

app.get('/status', (req, res) => {
  const session = sessionManager.get(req.query.userId);
  res.json({ ...state, session: session.userId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Engine listening on http://localhost:${PORT}`);
});
