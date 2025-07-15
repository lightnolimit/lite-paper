# Vercel Deployment

Complete guide to deploying your documentation site on Vercel.

## Quick Start

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel --prod
```

## Automatic GitHub Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure build settings

### 2. Build Configuration

Vercel auto-detects Next.js projects, but you can customize:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

### 3. Environment Variables

Add environment variables in Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app`
- `NEXT_PUBLIC_BACKGROUND_TYPE=dither`
- `NODE_VERSION=18`

## Custom Domain Setup

### 1. Add Domain

In Vercel dashboard:

1. Go to project **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records

### 2. DNS Configuration

For `docs.yoursite.com`:

```
CNAME docs.yoursite.com cname.vercel-dns.com
```

For root domain `yoursite.com`:

```
A @ 76.76.19.19
AAAA @ 2606:4700:4700::1111
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

## Advanced Configuration

### vercel.json

Create `vercel.json` for advanced configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "out"
      }
    }
  ],
  "routes": [
    {
      "src": "/docs/(.*)",
      "dest": "/docs/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-docs/(.*)",
      "destination": "/docs/$1",
      "permanent": true
    }
  ]
}
```

### Security Headers

Add security headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## Environment Configuration

### Development Environment

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3333
NEXT_PUBLIC_BACKGROUND_TYPE=wave
```

### Production Environment

Set in Vercel dashboard:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
NEXT_PUBLIC_BACKGROUND_TYPE=dither
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### Environment-specific Builds

```javascript
// next.config.js
module.exports = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Different configs per environment
  ...(process.env.VERCEL_ENV === 'production' && {
    // Production-only config
    productionBrowserSourceMaps: false,
  }),

  ...(process.env.VERCEL_ENV === 'preview' && {
    // Preview/staging config
    basePath: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  }),
};
```

## Performance Optimization

### Edge Network

Vercel automatically distributes your site globally:

- **Global CDN** with 40+ edge locations
- **Smart routing** to nearest edge
- **Automatic compression** (Gzip/Brotli)

### Image Optimization

Enable Vercel's image optimization:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],

    // For static export, disable optimization
    unoptimized: process.env.VERCEL_ENV !== 'production',
  },
};
```

### Analytics Integration

Enable Vercel Analytics:

```bash
npm install @vercel/analytics
```

```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

## Branch Deployments

### Preview Deployments

Vercel creates preview deployments for every push:

- **Feature branches** get unique URLs
- **Pull requests** include deployment previews
- **Staging** environments for testing

### Branch-specific Configuration

```json
{
  "github": {
    "deploymentEnabled": {
      "main": true,
      "staging": true
    }
  },
  "alias": [
    {
      "domain": "docs-staging.yoursite.com",
      "deployment": {
        "VERCEL_GIT_COMMIT_REF": "staging"
      }
    }
  ]
}
```

## CI/CD Integration

### GitHub Actions with Vercel

```yaml
# .github/workflows/vercel.yml
name: Vercel Deployment

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Custom Build Scripts

```json
{
  "scripts": {
    "build": "next build",
    "build:vercel": "npm run test && npm run build",
    "vercel-build": "npm run build:vercel"
  }
}
```

## Monitoring and Debugging

### Vercel Functions Logs

Monitor function execution:

```bash
# View logs
vercel logs

# Tail logs in real-time
vercel logs --follow
```

### Performance Monitoring

Track Core Web Vitals:

```typescript
// lib/vercel-analytics.ts
export function reportWebVitals(metric: any) {
  // Vercel Analytics
  if (window.va) {
    window.va('track', 'web-vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  }

  // Custom tracking
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  });
}
```

### Error Tracking

```typescript
// lib/error-tracking.ts
export function setupErrorTracking() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  });
}
```

## Database Integration

### Vercel Storage Options

1. **Vercel Postgres** - Serverless PostgreSQL
2. **Vercel KV** - Redis-compatible key-value store
3. **Vercel Blob** - File storage

### Example: Vercel KV Setup

```bash
npm install @vercel/kv
```

```typescript
// lib/kv.ts
import { kv } from '@vercel/kv';

export async function getCachedData(key: string) {
  return await kv.get(key);
}

export async function setCachedData(key: string, data: any, ttl = 3600) {
  return await kv.setex(key, ttl, JSON.stringify(data));
}

// Usage in API routes
export async function GET(request: Request) {
  const cached = await getCachedData('docs-data');

  if (cached) {
    return Response.json(JSON.parse(cached));
  }

  const data = await fetchDocumentationData();
  await setCachedData('docs-data', data);

  return Response.json(data);
}
```

## Troubleshooting

### Common Issues

**Build Failures:**

```bash
# Check build logs
vercel logs --since 1h

# Local build test
npm run build
```

**Domain Configuration:**

```bash
# Verify DNS propagation
dig docs.yoursite.com

# Check certificate status
curl -I https://docs.yoursite.com
```

**Function Timeouts:**

```typescript
// Increase timeout in vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Debug Mode

Enable debug logging:

```bash
# Environment variable
DEBUG=1 vercel dev

# Or in vercel.json
{
  "env": {
    "DEBUG": "1"
  }
}
```

### Performance Issues

**Slow builds:**

```json
{
  "installCommand": "npm ci --prefer-offline",
  "buildCommand": "npm run build --max-old-space-size=4096"
}
```

**Large bundle size:**

```bash
# Analyze bundle
npm run build && npx @next/bundle-analyzer
```

## Cost Optimization

### Free Tier Limits

Vercel Hobby plan includes:

- **100GB** bandwidth per month
- **1000** build executions per month
- **10GB-hours** function execution time

### Pro Plan Benefits

For production sites:

- **1TB** bandwidth
- **Advanced analytics**
- **Team collaboration**
- **Priority support**

### Optimization Tips

1. **Static Generation** - Use `getStaticProps` for pre-rendering
2. **Image Optimization** - Use Next.js Image component
3. **Bundle Analysis** - Regular bundle size monitoring
4. **Caching** - Implement proper cache headers

## Security Best Practices

### Environment Variables

- Use Vercel dashboard for secrets
- Different configs per environment
- Never commit sensitive data

### Content Security Policy

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' vercel.live"
  );

  return response;
}
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { kv } from '@vercel/kv';

export async function rateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const key = `rate_limit:${ip}`;

  const current = await kv.incr(key);

  if (current === 1) {
    await kv.expire(key, 60); // 1 minute window
  }

  if (current > 60) {
    // 60 requests per minute
    throw new Error('Rate limit exceeded');
  }
}
```

## Migration Guide

### From Other Platforms

**From Netlify:**

1. Export existing build configuration
2. Update `vercel.json` with redirects/headers
3. Migrate environment variables
4. Update DNS records

**From Cloudflare Pages:**

1. Import Git repository
2. Configure build settings
3. Set up custom domains
4. Update CI/CD workflows

### Zero-downtime Migration

1. **Set up Vercel** deployment alongside existing
2. **Test thoroughly** on preview URL
3. **Update DNS** with low TTL
4. **Monitor** for issues
5. **Rollback** if needed

## Next Steps

- **[Netlify Deployment](./netlify)** - Alternative platform guide
- **[Production Setup](../production-setup)** - Advanced configuration
- **[Monitoring](../../user-guide/troubleshooting)** - Error tracking and analytics
