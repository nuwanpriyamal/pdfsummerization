# OpenClaw Summary Proxy

Small local proxy that converts `POST /summarize` into an OpenClaw Gateway
`/v1/chat/completions` request.

## Setup

```bash
cp .env.example .env
# set OPENCLAW_GATEWAY_TOKEN in .env
npm install
npm start
```

## Endpoint

`POST /summarize`

Request:

```json
{
  "task": "summarize",
  "text": "Long text to summarize"
}
```

Response:

```json
{
  "summary": "- bullet 1\n- bullet 2"
}
```

Health:

`GET /health`
