# AI Assistant Setup - Simplified Architecture

This documentation site uses a direct integration with Cloudflare's Llama3 AI model for intelligent documentation assistance.

## Architecture

```
User Query → RAG Search → Llama3 Worker → AI Response
     ↓                                          ↓
Command Palette → Local Doc Search → Fallback Response
```

## How It Works

1. **User asks a question** in the command palette (Cmd/Ctrl + K)
2. **RAG searches** your documentation for relevant content
3. **Context is built** from the top 3 most relevant documentation sections
4. **Llama3 processes** the query with the documentation context
5. **Intelligent response** is returned to the user

## Configuration

The AI assistant is configured via environment variables:

```bash
# Enable AI features
NEXT_PUBLIC_ENABLE_AI="true"

# Your Cloudflare Llama3 worker URL
NEXT_PUBLIC_AI_WORKER_URL="https://llama3-8b-instruct.lightnolimit.workers.dev/"
```

## Security Considerations

### Option 1: CORS Protection (Recommended)

To protect your Llama3 worker from unauthorized use, add CORS headers to your worker:

```javascript
// In your Llama3 worker, add:
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### Option 2: Rate Limiting

Use Cloudflare's built-in rate limiting:

- Dashboard → Security → Rate Limiting
- Create rule for your worker endpoint
- Limit to reasonable requests per minute

### Option 3: Accept Public Usage

- The Llama3 worker URL being exposed isn't critical
- Cloudflare Workers have built-in DDoS protection
- Free tier allows 100,000 requests/day
- Monitor usage and add protection if needed

## Cost Analysis

**Direct Llama3 approach:**

- ✅ No proxy worker needed (saves requests)
- ✅ Single API call per query
- ✅ Cloudflare Workers free tier: 100,000 requests/day
- ✅ Llama3 model included in Workers AI free tier

**Previous proxy approach:**

- ❌ Double the requests (client → proxy → AI)
- ❌ More complex architecture
- ❌ Additional worker to maintain

## Fallback System

If Llama3 is unavailable, the system automatically falls back to:

1. Local keyword-based response generation
2. Returns relevant documentation snippets
3. Suggests related topics

## Testing

1. Enable AI in your `.env.local`
2. Start dev server: `npm run dev`
3. Open command palette: `Cmd/Ctrl + K`
4. Select "Ask AI Assistant"
5. Ask a question about your documentation

## Monitoring

View Llama3 worker analytics:

1. Cloudflare Dashboard → Workers & Pages
2. Select your Llama3 worker
3. View metrics, logs, and usage

## Troubleshooting

**AI not responding:**

- Check `NEXT_PUBLIC_ENABLE_AI` is set to "true"
- Verify `NEXT_PUBLIC_AI_WORKER_URL` is correct
- Check browser console for errors
- Test Llama3 worker directly:

```bash
curl -X POST https://llama3-8b-instruct.lightnolimit.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "max_tokens": 100
  }'
```

**Poor AI responses:**

- Ensure documentation is properly indexed
- Check that RAG is finding relevant context
- Adjust temperature in clientRAG.ts (lower = more factual)

## Benefits of This Approach

1. **Simplicity** - Direct integration, no proxy needed
2. **Cost-effective** - Single API call, uses free tier
3. **Performance** - Fewer hops, faster responses
4. **Maintainability** - Less code to maintain
5. **Security** - Cloudflare's built-in protections

The simplified architecture provides the same AI capabilities with less complexity and cost!
