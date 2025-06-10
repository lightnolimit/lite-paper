# Netlify Deployment

Complete guide to deploying your documentation site on Netlify.

## Quick Start

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Login to Netlify

```bash
netlify login
```

### 3. Deploy

```bash
netlify deploy --prod --dir=out
```

## Automatic GitHub Deployment

### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub repository
4. Configure build settings

### 2. Build Configuration

Configure build settings in Netlify dashboard:

```bash
# Build command
npm run build

# Publish directory
out

# Environment variables
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### 3. netlify.toml Configuration

Create `netlify.toml` for advanced configuration:

```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/old-docs/*"
  to = "/docs/:splat"
  status = 301

[[redirects]]
  from = "/docs/*"
  to = "/docs/:splat"
  status = 200

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

## Custom Domain Setup

### 1. Add Domain

In Netlify dashboard:
1. Go to **Site settings** → **Domain management**
2. Add custom domain
3. Configure DNS

### 2. DNS Configuration

For `docs.yoursite.com`:

```
CNAME docs.yoursite.com your-site.netlify.app
```

For root domain with Netlify DNS:

```
A @ 75.2.60.5
AAAA @ 2600:1800:4000:1::
```

### 3. SSL Certificate

Netlify provides automatic HTTPS with Let's Encrypt certificates.

## Environment Configuration

### Development Environment

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BACKGROUND_TYPE=wave
```

### Production Environment

Set in Netlify dashboard under **Site settings** → **Environment variables**:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
NEXT_PUBLIC_BACKGROUND_TYPE=dither
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### Branch-specific Variables

```toml
# netlify.toml
[context.production.environment]
  NEXT_PUBLIC_ENVIRONMENT = "production"
  
[context.deploy-preview.environment]
  NEXT_PUBLIC_ENVIRONMENT = "preview"
  
[context.branch-deploy.environment]
  NEXT_PUBLIC_ENVIRONMENT = "development"
```

## Advanced Features

### Form Handling

Netlify provides built-in form handling:

```html
<!-- Contact form example -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p>
    <label>Name: <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Email: <input type="email" name="email" required /></label>
  </p>
  <p>
    <label>Message: <textarea name="message" required></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
```

### Serverless Functions

Create serverless functions for dynamic features:

```typescript
// netlify/functions/api.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const { httpMethod, path, body } = event
  
  if (httpMethod === 'POST' && path === '/api/contact') {
    const data = JSON.parse(body || '{}')
    
    // Process form submission
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true })
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  }
}
```

### Analytics Integration

Enable Netlify Analytics:

```toml
# netlify.toml
[build]
  command = "npm run build"
  
[build.environment]
  NETLIFY_ANALYTICS = "true"
```

## Performance Optimization

### Asset Optimization

Netlify automatically provides:

- **Global CDN** with 100+ edge locations
- **Image optimization** with automatic WebP conversion
- **Asset minification** for CSS and JS
- **Brotli compression**

### Build Optimization

Optimize build performance:

```toml
[build]
  command = "npm ci && npm run build"
  
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
  NPM_CONFIG_PRODUCTION = "false"
```

### Caching Strategy

Configure intelligent caching:

```toml
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"
```

## Branch Deployments

### Deploy Previews

Netlify creates deploy previews for:

- **Pull requests** get unique URLs
- **Branch deploys** for feature testing
- **Split testing** capabilities

### Branch-specific Configuration

```toml
# Production
[context.production]
  command = "npm run build:production"
  
# Deploy previews
[context.deploy-preview]
  command = "npm run build:preview"
  
# Branch deploys
[context.branch-deploy]
  command = "npm run build:development"
```

## CI/CD Integration

### GitHub Actions with Netlify

```yaml
# .github/workflows/netlify.yml
name: Netlify Deployment

on:
  push:
    branches: [main, develop]
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
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './out'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Netlify Build Plugins

Use build plugins for enhanced functionality:

```toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  
  [plugins.inputs.thresholds]
    performance = 0.9
    accessibility = 0.9
    best-practices = 0.9
    seo = 0.9

[[plugins]]
  package = "netlify-plugin-submit-sitemap"
  
  [plugins.inputs]
    baseUrl = "https://docs.yoursite.com"
    sitemapPath = "/sitemap.xml"
    providers = [
      "google",
      "bing"
    ]
```

## Monitoring and Analytics

### Netlify Analytics

Built-in server-side analytics:

- **Page views** and unique visitors
- **Top pages** and referrers
- **Bandwidth** usage
- **Geographic** distribution

### Performance Monitoring

Track Core Web Vitals:

```typescript
// lib/netlify-analytics.ts
export function reportWebVitals(metric: any) {
  // Netlify Analytics (built-in)
  if (window.netlifyAnalytics) {
    window.netlifyAnalytics.track('web-vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id
    })
  }
  
  // Custom tracking
  fetch('/.netlify/functions/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric)
  })
}
```

### Error Tracking

```typescript
// netlify/functions/error-tracking.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  const error = JSON.parse(event.body || '{}')
  
  // Log error (could send to external service)
  console.error('Client error:', error)
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true })
  }
}
```

## Security Features

### Security Headers

Comprehensive security configuration:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### Access Control

Protect sensitive areas:

```toml
# Password protect staging
[[context.branch-deploy.headers]]
  for = "/*"
  [context.branch-deploy.headers.values]
    Basic-Auth = "staging:$STAGING_PASSWORD"
    
# IP restrictions (Netlify Pro)
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Forwarded-For = "192.168.1.0/24"
```

## Form Processing

### Contact Forms

Process form submissions:

```typescript
// netlify/functions/contact.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  const { name, email, message } = JSON.parse(event.body || '{}')
  
  // Validate input
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    }
  }
  
  // Process form (send email, save to database, etc.)
  try {
    await sendEmail({ name, email, message })
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' })
    }
  }
}
```

### Spam Protection

Implement spam protection:

```html
<!-- Honeypot field -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  
  <!-- Honeypot (hidden from users) -->
  <p style="display: none;">
    <input name="bot-field" />
  </p>
  
  <!-- reCAPTCHA -->
  <div data-netlify-recaptcha="true"></div>
  
  <button type="submit">Send</button>
</form>
```

## Database Integration

### Netlify Databases

Integration options:

1. **FaunaDB** - Serverless, globally distributed
2. **MongoDB Atlas** - Cloud MongoDB
3. **Supabase** - Open source Firebase alternative
4. **PlanetScale** - Serverless MySQL

### Example: FaunaDB Integration

```typescript
// lib/fauna.ts
import faunadb from 'faunadb'

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY!
})

export async function getDocuments() {
  const query = faunadb.query
  
  try {
    const result = await client.query(
      query.Map(
        query.Paginate(query.Documents(query.Collection('documents'))),
        query.Lambda('ref', query.Get(query.Var('ref')))
      )
    )
    
    return result
  } catch (error) {
    console.error('Fauna query error:', error)
    throw error
  }
}
```

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check build logs in Netlify dashboard
# Or use CLI
netlify build --debug
```

**Routing Issues:**
```toml
# Fix SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}
```

**Function Errors:**
```bash
# Test functions locally
netlify dev
```

### Debug Mode

Enable debug logging:

```toml
[build]
  command = "DEBUG=* npm run build"
  
[build.environment]
  DEBUG = "netlify*"
```

### Performance Issues

**Slow builds:**
```toml
[build]
  command = "npm ci --prefer-offline && npm run build"
  
[build.environment]
  NPM_CONFIG_PREFER_OFFLINE = "true"
  NPM_CONFIG_CACHE = ".npm"
```

## Cost Optimization

### Free Tier Limits

Netlify free plan includes:
- **100GB** bandwidth per month
- **300** build minutes per month
- **125k** serverless function invocations

### Pro Plan Benefits

For production sites:
- **1TB** bandwidth
- **Advanced build features**
- **Analytics and forms**
- **Identity and Git Gateway**

### Optimization Tips

1. **Build optimization** - Efficient dependency installation
2. **Function efficiency** - Optimize serverless functions
3. **Asset compression** - Use built-in optimization
4. **Caching** - Proper cache headers

## Migration Guide

### From Other Platforms

**From Vercel:**
1. Export build configuration
2. Convert `vercel.json` to `netlify.toml`
3. Migrate environment variables
4. Update DNS records

**From GitHub Pages:**
1. Import repository to Netlify
2. Configure build command
3. Set up custom domain
4. Update DNS

### Zero-downtime Migration

1. **Set up Netlify** deployment in parallel
2. **Test thoroughly** on deploy preview
3. **Configure domain** with DNS failover
4. **Monitor** performance and errors
5. **Rollback** if issues occur

## Best Practices

### Performance

- Use build plugins for optimization
- Implement proper caching headers
- Monitor Core Web Vitals
- Optimize images and fonts

### Security

- Configure security headers
- Use environment variables for secrets
- Implement rate limiting
- Regular security audits

### Monitoring

- Enable Netlify Analytics
- Set up error tracking
- Monitor build performance
- Track user engagement

## Next Steps

- **[Cloudflare Pages](./cloudflare)** - Alternative platform guide
- **[Production Setup](../production-setup)** - Advanced configuration
- **[Monitoring](../../user-guide/troubleshooting)** - Error tracking and analytics 