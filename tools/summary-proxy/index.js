require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT || 8787);
const GATEWAY_URL =
  process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';
const MODEL = process.env.OPENCLAW_SUMMARY_MODEL || 'openai/gpt-5.2-mini';
const GATEWAY_SCOPES = process.env.OPENCLAW_GATEWAY_SCOPES || 'operator.write';

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/summarize', async (req, res) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text : '';
    if (!text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }

    if (!GATEWAY_TOKEN.trim()) {
      return res
        .status(500)
        .json({ error: 'OPENCLAW_GATEWAY_TOKEN is not configured' });
    }

    const response = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GATEWAY_TOKEN}`,
        'x-openclaw-scopes': GATEWAY_SCOPES,
        'x-openclaw-model': MODEL,
      },
      body: JSON.stringify({
        model: 'openclaw',
        messages: [
          {
            role: 'system',
            content:
              'Summarize the user text in 4-6 concise bullet points. Keep key facts and action items.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return res
        .status(response.status)
        .json({ error: 'OpenClaw gateway request failed', details });
    }

    const payload = await response.json();
    const summary = payload?.choices?.[0]?.message?.content;
    if (typeof summary !== 'string' || !summary.trim()) {
      return res.status(502).json({
        error: 'OpenClaw gateway response did not include summary content',
      });
    }

    return res.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Summary proxy listening on http://127.0.0.1:${PORT}`);
});
