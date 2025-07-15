# AI Assistant Setup

Direct integration with Cloudflare Workers AI for intelligent documentation assistance.

## How It Works

1. User asks question (Cmd/Ctrl + K)
2. RAG searches documentation
3. Context built from top 3 relevant sections
4. Llama3 processes query with context
5. Returns intelligent response

## Configuration

```bash
NEXT_PUBLIC_ENABLE_AI="true"
NEXT_PUBLIC_AI_WORKER_URL="https://your-worker.workers.dev"
```

## Security

**CORS Protection** (recommended):

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'POST',
};
```

**Rate Limiting**: Use Cloudflare dashboard → Security → Rate Limiting

**Public Usage**: Workers have DDoS protection, 100k requests/day free

## Cost

**Direct approach benefits**:

- Single API call per query
- 100k requests/day free tier
- Llama3 included in Workers AI
- Simple architecture

## Fallback

If AI unavailable:

1. Local keyword responses
2. Documentation snippets
3. Related topic suggestions

## Testing

1. Enable AI in `.env.local`
2. `npm run dev`
3. Cmd/Ctrl + K → "Ask AI Assistant"
4. Ask about documentation

## Monitoring

Cloudflare Dashboard → Workers & Pages → your worker → metrics

## Troubleshooting

**AI not responding**:

- Check `NEXT_PUBLIC_ENABLE_AI="true"`
- Verify `NEXT_PUBLIC_AI_WORKER_URL`
- Check browser console
- Test worker directly with curl

**Poor responses**:

- Check documentation indexing
- Verify RAG finding context
- Adjust temperature in clientRAG.ts

## Benefits

- Simple direct integration
- Cost-effective (free tier)
- Fast responses
- Easy maintenance
- Built-in security
