# Deployment Overview

Guide to deploying your documentation site to various hosting platforms.

## Supported Platforms

This documentation template supports deployment to several platforms:

- **[Cloudflare Pages](./platforms/cloudflare)** - Fast global CDN with edge functions
- **[Vercel](./platforms/vercel)** - Optimized for Next.js applications  
- **[Netlify](./platforms/netlify)** - JAMstack platform with form handling
- **Static Hosting** - Any CDN or web server

## Build Process

The documentation site uses Next.js static export for optimal performance:

```bash
# Build for production
npm run build

# Output directory
out/
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  output: 'export',  // Static export
  trailingSlash: false,
  images: {
    unoptimized: true  // Required for static export
  }
}
```

## Pre-deployment Checklist

Before deploying, ensure:

- [ ] **All tests pass**: `npm run test`
- [ ] **Build succeeds**: `npm run build`
- [ ] **No TypeScript errors**: `npm run type-check`
- [ ] **Linting passes**: `npm run lint`
- [ ] **Content is up to date**
- [ ] **Environment variables configured**

## Environment Variables

### Public Variables

These are included in the client bundle:

```bash
# Site configuration
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
NEXT_PUBLIC_BACKGROUND_TYPE=dither

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Build Variables

For build-time configuration:

```bash
# Node.js version
NODE_VERSION=18

# Build settings
NODE_ENV=production
```

## Performance Optimization

### Asset Optimization

The build process automatically:

- Minifies JavaScript and CSS
- Optimizes fonts with `font-display: swap`
- Generates static HTML for all pages
- Creates service worker for caching

### CDN Configuration

Recommended cache headers:

```
# Static assets (JS, CSS, fonts)
Cache-Control: public, max-age=31536000, immutable

# HTML pages
Cache-Control: public, max-age=3600, must-revalidate

# API responses
Cache-Control: public, max-age=300
```

## SSL/HTTPS

All platforms provide automatic HTTPS:

- **Cloudflare**: Universal SSL with flexible/full encryption
- **Vercel**: Automatic SSL certificates via Let's Encrypt
- **Netlify**: Automatic HTTPS with custom domains

### Security Headers

Configure security headers for production:

```
# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'

# Strict Transport Security
Strict-Transport-Security: max-age=31536000; includeSubDomains

# X-Frame-Options
X-Frame-Options: DENY

# X-Content-Type-Options
X-Content-Type-Options: nosniff
```

## Custom Domains

### DNS Configuration

For custom domains, configure DNS:

```
# Root domain
yourdomain.com    A    192.0.2.1

# Subdomain
docs.yourdomain.com    CNAME    your-platform.com
```

### SSL Certificates

Most platforms handle SSL automatically, but you can:

- Use platform-provided certificates
- Upload custom certificates
- Use Cloudflare for additional SSL options

## Monitoring and Analytics

### Performance Monitoring

Track Core Web Vitals:

```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  // Send to analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals'
  })
}
```

### Error Tracking

Configure error reporting:

```javascript
// lib/error-tracking.js
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Send error to tracking service
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      })
    })
  })
}
```

## Deployment Automation

### GitHub Actions

Automate deployment with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy Documentation

on:
  push:
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
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: docs
          directory: out
```

### Continuous Deployment

Set up automatic deployments:

1. **Connect repository** to hosting platform
2. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `out`
   - Node.js version: `18`
3. **Set environment variables**
4. **Enable automatic deployments** on push

## Rollback Strategy

### Version Control

Maintain deployment history:

- Tag releases: `git tag v1.2.3`
- Keep deployment logs
- Use platform rollback features

### Quick Rollback

Most platforms support instant rollback:

```bash
# Cloudflare Pages
wrangler pages deployment list
wrangler pages deployment rollback <deployment-id>

# Vercel
vercel --prod rollback
```

## Testing in Production

### Staging Environment

Deploy to staging before production:

```bash
# Staging deployment
npm run build:staging
npm run deploy:staging

# Production deployment
npm run build:production
npm run deploy:production
```

### Health Checks

Implement health check endpoints:

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

## Troubleshooting

### Common Issues

**Build failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Routing issues:**
- Ensure `trailingSlash: false` in Next.js config
- Check `_redirects` or platform-specific routing

**Asset loading:**
- Verify `basePath` configuration
- Check CORS headers for external assets
- Ensure proper CDN configuration

### Debug Mode

Enable deployment debugging:

```bash
# Verbose build output
npm run build -- --debug

# Platform-specific debugging
DEBUG=true npm run deploy
```

## Security Considerations

### Build Security

- Use `npm ci` instead of `npm install`
- Audit dependencies: `npm audit`
- Keep build environment updated
- Use secrets for sensitive variables

### Runtime Security

- Configure CSP headers
- Enable HSTS
- Use secure cookie settings
- Validate all inputs

## Performance Targets

### Core Web Vitals Goals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms  
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Techniques

- Static generation for all pages
- Image optimization
- Font loading optimization
- Critical CSS inlining
- Service worker caching

## Cost Optimization

### Free Tier Limits

Most platforms offer generous free tiers:

- **Cloudflare Pages**: 500 builds/month, unlimited bandwidth
- **Vercel**: 100GB bandwidth, 100 builds/month
- **Netlify**: 300 build minutes, 100GB bandwidth

### Scaling Considerations

For high-traffic sites:

- Consider paid plans for better performance
- Implement advanced caching strategies
- Use analytics to optimize popular pages
- Consider edge functions for dynamic content

## Migration Guide

### From Other Platforms

Migrating from:

- **GitBook**: Export content to Markdown
- **Notion**: Use Notion API to export pages
- **Jekyll**: Convert front matter and layouts
- **Docusaurus**: Migrate content structure

### Platform Migration

Moving between hosting platforms:

1. **Export current deployment**
2. **Update DNS gradually**
3. **Test thoroughly**
4. **Monitor for issues**
5. **Update CI/CD pipelines**

## Next Steps

- **[Production Setup](./production-setup)** - Advanced configuration
- **[Platform Guides](./platforms/cloudflare)** - Platform-specific instructions
- **[Troubleshooting](../user-guide/troubleshooting)** - Common deployment issues 