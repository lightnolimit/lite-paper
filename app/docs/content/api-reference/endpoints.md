# API Endpoints

Reference for all available API endpoints in the documentation system.

## Base URL

```
Development: http://localhost:3333
Production: https://your-domain.com
```

## Documentation Endpoints

### GET /docs/[...slug]

Retrieve documentation page content.

**Parameters:**

- `slug` (array): Path segments for the documentation page

**Example:**

```
GET /docs/getting-started/introduction
GET /docs/api-reference/overview
```

**Response:**

```json
{
  "content": "# Introduction\n\nWelcome to the documentation...",
  "path": "getting-started/introduction",
  "title": "Introduction",
  "lastModified": "2024-01-15T10:30:00Z"
}
```

### GET /api/docs/search

Search documentation content.

**Query Parameters:**

- `q` (string): Search query
- `limit` (number): Maximum results (default: 10)

**Example:**

```
GET /api/docs/search?q=installation&limit=5
```

**Response:**

```json
{
  "results": [
    {
      "title": "Installation Guide",
      "path": "getting-started/installation",
      "excerpt": "Complete installation instructions...",
      "score": 0.95
    }
  ],
  "total": 5,
  "query": "installation"
}
```

## Configuration Endpoints

### GET /api/config/theme

Get current theme configuration.

**Response:**

```json
{
  "themes": {
    "light": {
      "primary": "#678D58",
      "background": "#F3F5F0",
      "text": "#2E3A23"
    },
    "dark": {
      "primary": "#FF85A1",
      "background": "#0F0F12",
      "text": "#F0F0F5"
    }
  },
  "current": "light"
}
```

### POST /api/config/theme

Update theme preferences.

**Request Body:**

```json
{
  "theme": "dark",
  "reduceMotion": false
}
```

**Response:**

```json
{
  "success": true,
  "theme": "dark",
  "reduceMotion": false
}
```

### GET /api/config/navigation

Get navigation structure.

**Response:**

```json
{
  "navigation": [
    {
      "name": "Getting Started",
      "path": "getting-started",
      "type": "directory",
      "children": [
        {
          "name": "Introduction",
          "path": "getting-started/introduction",
          "type": "file"
        }
      ]
    }
  ]
}
```

## Analytics Endpoints

### POST /api/analytics/page-view

Track page views.

**Request Body:**

```json
{
  "path": "/docs/getting-started/introduction",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "id": "pageview_123456"
}
```

### POST /api/analytics/search

Track search queries.

**Request Body:**

```json
{
  "query": "installation guide",
  "results": 5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "id": "search_123456"
}
```

### GET /api/analytics/popular

Get popular content.

**Query Parameters:**

- `period` (string): Time period (day, week, month)
- `limit` (number): Maximum results (default: 10)

**Response:**

```json
{
  "pages": [
    {
      "path": "/docs/getting-started/introduction",
      "title": "Introduction",
      "views": 1250,
      "growth": 15.3
    }
  ],
  "period": "week",
  "total": 10
}
```

## Feedback Endpoints

### POST /api/feedback

Submit page feedback.

**Request Body:**

```json
{
  "path": "/docs/getting-started/introduction",
  "type": "helpful" | "not-helpful" | "suggestion",
  "message": "This page was very helpful!",
  "rating": 5,
  "email": "user@example.com" // optional
}
```

**Response:**

```json
{
  "success": true,
  "id": "feedback_123456",
  "message": "Thank you for your feedback!"
}
```

### GET /api/feedback/summary

Get feedback summary for a page.

**Query Parameters:**

- `path` (string): Page path

**Response:**

```json
{
  "path": "/docs/getting-started/introduction",
  "rating": 4.5,
  "totalFeedback": 45,
  "helpful": 38,
  "notHelpful": 7,
  "suggestions": 12
}
```

## Export Endpoints

### GET /api/export/pdf

Export documentation as PDF.

**Query Parameters:**

- `paths` (array): Pages to include
- `format` (string): Output format (pdf, epub)

**Response:**
Binary PDF file or job ID for async processing.

### GET /api/export/json

Export documentation structure as JSON.

**Response:**

```json
{
  "meta": {
    "exportDate": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "totalPages": 45
  },
  "pages": [
    {
      "path": "getting-started/introduction",
      "title": "Introduction",
      "content": "# Introduction\n\n...",
      "lastModified": "2024-01-10T10:30:00Z"
    }
  ]
}
```

## Webhook Endpoints

### POST /api/webhooks/github

Handle GitHub webhook for automatic updates.

**Headers:**

- `X-GitHub-Event`: Event type
- `X-Hub-Signature-256`: HMAC signature

**Request Body:**
GitHub webhook payload

**Response:**

```json
{
  "success": true,
  "processed": ["docs/getting-started/introduction.md"],
  "message": "Documentation updated successfully"
}
```

### POST /api/webhooks/content-update

Trigger content rebuild.

**Request Body:**

```json
{
  "paths": ["getting-started/introduction"],
  "source": "cms",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "rebuild_123456",
  "estimatedTime": "30s"
}
```

## Error Handling

### Standard Error Response

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "query",
      "issue": "Required parameter missing"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

### HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 429  | Rate Limited          |
| 500  | Internal Server Error |

## Rate Limiting

API endpoints are rate limited to prevent abuse:

| Endpoint Type    | Limit     |
| ---------------- | --------- |
| Read operations  | 1000/hour |
| Write operations | 100/hour  |
| Search           | 60/minute |
| Analytics        | 500/hour  |

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705312200
```

## Authentication

Some endpoints require authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## SDKs and Clients

### JavaScript/TypeScript SDK

```typescript
import { DocsAPI } from '@your-org/docs-sdk';

const api = new DocsAPI({
  baseURL: 'https://your-domain.com',
  apiKey: 'your-api-key',
});

// Search documentation
const results = await api.search('installation guide');

// Get page content
const page = await api.getPage('getting-started/introduction');

// Submit feedback
await api.submitFeedback({
  path: '/docs/getting-started/introduction',
  type: 'helpful',
  rating: 5,
});
```

### Python SDK

```python
from docs_api import DocsClient

client = DocsClient(
    base_url='https://your-domain.com',
    api_key='your-api-key'
)

# Search documentation
results = client.search('installation guide')

# Get page content
page = client.get_page('getting-started/introduction')

# Submit feedback
client.submit_feedback({
    'path': '/docs/getting-started/introduction',
    'type': 'helpful',
    'rating': 5
})
```

## OpenAPI Specification

The complete OpenAPI specification is available at:

```
GET /api/openapi.json
```

This can be used with tools like:

- Swagger UI
- Postman
- Insomnia
- OpenAPI Generator

## Webhook Security

### Signature Verification

Verify webhook signatures to ensure authenticity:

```typescript
import crypto from 'crypto';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest('hex')}`;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

## Examples

### Curl Examples

```bash
# Search documentation
curl "https://your-domain.com/api/docs/search?q=installation"

# Get page content
curl "https://your-domain.com/docs/api-reference/overview"

# Submit feedback
curl -X POST "https://your-domain.com/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{"path": "/docs/getting-started", "type": "helpful", "rating": 5}'
```

### JavaScript Fetch Examples

```javascript
// Search documentation
const searchResults = await fetch('/api/docs/search?q=installation').then((res) => res.json());

// Submit feedback
const feedback = await fetch('/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: '/docs/getting-started',
    type: 'helpful',
    rating: 5,
  }),
}).then((res) => res.json());
```

## Next Steps

- **[Authentication Guide](./authentication)** - Implement API authentication
- **[Code Examples](../developer-guides/code-examples)** - Practical API usage examples
- **[Overview](./overview)** - API architecture and concepts
