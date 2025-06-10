# Production Setup

Advanced configuration for production deployment of your documentation site.

## Production Build Configuration

### Next.js Optimization

```javascript
// next.config.js
module.exports = {
  // Static export for optimal performance
  output: 'export',
  
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
  
  // Image optimization (disabled for static export)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp']
  },
  
  // Optimize compilation
  swcMinify: true,
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  },
  
  // Remove source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable compression
  compress: true,
  
  // Optimize fonts
  optimizeFonts: true
}
```

### Environment Variables

Create production environment configuration:

```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
NEXT_PUBLIC_BACKGROUND_TYPE=dither
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### Build Scripts

Optimize package.json scripts:

```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:production": "NODE_ENV=production next build",
    "precommit": "npm run lint && npm run type-check",
    "prebuild": "npm run precommit"
  }
}
```

## Security Hardening

### Content Security Policy

Implement strict CSP headers:

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: https:;
      connect-src 'self' https://www.google-analytics.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim()
  )
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
```

### Input Sanitization

Sanitize user inputs and markdown content:

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
}

export function sanitizeHTML(
  dirty: string, 
  options: SanitizeOptions = {}
): string {
  const config = {
    ALLOWED_TAGS: options.allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'code', 'pre', 'blockquote',
      'a', 'img'
    ],
    ALLOWED_ATTR: options.allowedAttributes || {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'width', 'height'],
      'code': ['class'],
      'pre': ['class']
    },
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
  }
  
  return DOMPurify.sanitize(dirty, config)
}

// Usage in components
function SafeContent({ content }: { content: string }) {
  const sanitizedContent = sanitizeHTML(content)
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className="prose dark:prose-invert"
    />
  )
}
```

## Performance Optimization

### Bundle Analysis

Analyze and optimize bundle size:

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Configure in next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... other config
})

# Run analysis
ANALYZE=true npm run build
```

### Code Splitting

Implement strategic code splitting:

```typescript
// Dynamic imports for heavy components
const DocumentationGraph = dynamic(
  () => import('@/components/DocumentationGraph'),
  { 
    ssr: false,
    loading: () => <GraphSkeleton />
  }
)

// Route-level splitting for admin features
const AdminPanel = dynamic(
  () => import('@/components/admin/AdminPanel'),
  { ssr: false }
)

// Library splitting for large dependencies
const HeavyLibrary = dynamic(
  () => import('heavy-library').then(mod => mod.Component),
  { ssr: false }
)
```

### Image Optimization

Optimize images for production:

```typescript
// lib/image-optimization.ts
export function generateImageSrcSet(
  src: string,
  sizes: number[] = [640, 768, 1024, 1280, 1536]
): string {
  return sizes
    .map(size => `${src}?w=${size}&q=75 ${size}w`)
    .join(', ')
}

// Component usage
function OptimizedImage({ src, alt, ...props }) {
  const srcSet = generateImageSrcSet(src)
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
```

### Font Optimization

Optimize font loading:

```css
/* globals.css */
@font-face {
  font-family: 'MapleMono';
  src: url('/fonts/MapleMono-NF-CN-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* Critical for performance */
}

/* Preload critical fonts */
```

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/MapleMono-NF-CN-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## Monitoring and Analytics

### Performance Monitoring

Implement comprehensive performance tracking:

```typescript
// lib/performance.ts
interface PerformanceMetric {
  name: string
  value: number
  id: string
  navigationType?: string
}

export function trackWebVitals(metric: PerformanceMetric) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      custom_parameter_name: 'web_vitals',
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
  
  // Send to custom analytics endpoint
  fetch('/api/analytics/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: metric.name,
      value: metric.value,
      id: metric.id,
      url: window.location.pathname,
      timestamp: Date.now()
    })
  }).catch(() => {
    // Fail silently
  })
}

// Real User Monitoring
export function initRUM() {
  // Track navigation timing
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    trackWebVitals({
      name: 'TTFB',
      value: navigation.responseStart - navigation.requestStart,
      id: 'ttfb'
    })
    
    trackWebVitals({
      name: 'FCP',
      value: navigation.domContentLoadedEventStart - navigation.navigationStart,
      id: 'fcp'
    })
  })
}
```

### Error Tracking

Comprehensive error monitoring:

```typescript
// lib/error-tracking.ts
interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: string
  userId?: string
  sessionId: string
}

class ErrorTracker {
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupErrorHandlers()
  }
  
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  private setupErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      })
    })
    
    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      })
    })
    
    // React error boundary integration
    this.monitorReactErrors()
  }
  
  private async reportError(error: ErrorReport): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }
  
  private monitorReactErrors(): void {
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('React')) {
        this.reportError({
          message: `React Error: ${message}`,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId
        })
      }
      originalConsoleError.apply(console, args)
    }
  }
}

// Initialize in production only
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  new ErrorTracker()
}
```

## Caching Strategy

### CDN Configuration

Configure caching headers for optimal performance:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/(.*).html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      }
    ]
  }
}
```

### Service Worker

Implement service worker for offline support:

```typescript
// public/sw.js
const CACHE_NAME = 'docs-v1'
const STATIC_CACHE = [
  '/',
  '/docs',
  '/_next/static/css/app.css',
  '/_next/static/js/app.js',
  '/fonts/MapleMono-NF-CN-Regular.woff2'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE))
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response
        
        return fetch(event.request)
          .then(response => {
            const responseClone = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone))
            return response
          })
      })
  )
})
```

## Database and API Setup

### API Rate Limiting

Implement rate limiting for API endpoints:

```typescript
// lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

const rateLimitMap = new Map()

export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest) => {
    const token = req.ip || 'anonymous'
    const tokenCount = rateLimitMap.get(token) || [0, Date.now()]
    
    if (Date.now() - tokenCount[1] > config.interval) {
      rateLimitMap.set(token, [1, Date.now()])
    } else {
      tokenCount[0]++
      if (tokenCount[0] > config.uniqueTokenPerInterval) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
      rateLimitMap.set(token, tokenCount)
    }
    
    return null // Continue to handler
  }
}

// Usage in API routes
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10 // 10 requests per minute
})

export async function POST(req: NextRequest) {
  const limitResult = await limiter(req)
  if (limitResult) return limitResult
  
  // Handle request
}
```

### Database Connection

Optimize database connections:

```typescript
// lib/database.ts
import { Pool } from 'pg'

// Connection pooling for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected: ${duration}ms`, { text, params })
    }
    
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool closed')
    process.exit(0)
  })
})
```

## Backup and Recovery

### Content Backup

Implement automated content backup:

```typescript
// scripts/backup-content.ts
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

async function backupContent() {
  const contentDir = path.join(process.cwd(), 'app/docs/content')
  const backupDir = path.join(process.cwd(), 'backups')
  const timestamp = new Date().toISOString().replace(/:/g, '-')
  const backupFile = path.join(backupDir, `content-backup-${timestamp}.zip`)
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  const output = fs.createWriteStream(backupFile)
  const archive = archiver('zip', { zlib: { level: 9 } })
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Backup created: ${backupFile} (${archive.pointer()} bytes)`)
      resolve(backupFile)
    })
    
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(contentDir, false)
    archive.finalize()
  })
}

// Run backup
if (require.main === module) {
  backupContent().catch(console.error)
}
```

### Database Backup

Automate database backups:

```bash
#!/bin/bash
# scripts/backup-db.sh

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/db"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 30 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +30 -delete

echo "Database backup completed: $BACKUP_FILE.gz"
```

## Deployment Checklist

### Pre-deployment

- [ ] **Environment variables** configured
- [ ] **Build succeeds** without warnings
- [ ] **All tests pass** (unit, integration, e2e)
- [ ] **Security scan** completed
- [ ] **Performance audit** with Lighthouse
- [ ] **Accessibility audit** completed
- [ ] **Content review** completed
- [ ] **Backup** created

### Post-deployment

- [ ] **Smoke tests** pass
- [ ] **Performance metrics** within targets
- [ ] **Error rates** normal
- [ ] **CDN** cache populated
- [ ] **Analytics** tracking
- [ ] **Search engines** notified
- [ ] **Team** notified

### Rollback Preparation

- [ ] **Previous version** tagged
- [ ] **Rollback procedure** documented
- [ ] **Database migration** reversible
- [ ] **Feature flags** configured
- [ ] **Monitoring** alerts configured

## Advanced Configuration

### Multi-environment Setup

Configure different environments:

```typescript
// lib/config.ts
interface Config {
  apiUrl: string
  databaseUrl: string
  cacheEnabled: boolean
  analyticsEnabled: boolean
}

const configs: Record<string, Config> = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    databaseUrl: process.env.DEV_DATABASE_URL!,
    cacheEnabled: false,
    analyticsEnabled: false
  },
  staging: {
    apiUrl: 'https://staging-docs.yoursite.com/api',
    databaseUrl: process.env.STAGING_DATABASE_URL!,
    cacheEnabled: true,
    analyticsEnabled: false
  },
  production: {
    apiUrl: 'https://docs.yoursite.com/api',
    databaseUrl: process.env.DATABASE_URL!,
    cacheEnabled: true,
    analyticsEnabled: true
  }
}

export const config = configs[process.env.NODE_ENV] || configs.development
```

### Feature Flags

Implement feature flag system:

```typescript
// lib/feature-flags.ts
interface FeatureFlags {
  newMindMap: boolean
  darkModeToggle: boolean
  searchFilters: boolean
  commentSystem: boolean
}

export class FeatureFlagManager {
  private flags: FeatureFlags
  
  constructor() {
    this.flags = {
      newMindMap: process.env.FEATURE_NEW_MINDMAP === 'true',
      darkModeToggle: process.env.FEATURE_DARK_MODE === 'true',
      searchFilters: process.env.FEATURE_SEARCH_FILTERS === 'true',
      commentSystem: process.env.FEATURE_COMMENTS === 'true'
    }
  }
  
  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] || false
  }
}

export const featureFlags = new FeatureFlagManager()

// Usage in components
function DocumentationGraph() {
  const useNewMindMap = featureFlags.isEnabled('newMindMap')
  
  return useNewMindMap ? <NewMindMap /> : <LegacyMindMap />
}
```

## Next Steps

- **[Platform-specific guides](./platforms/cloudflare)** - Detailed deployment instructions
- **[Monitoring setup](../user-guide/troubleshooting)** - Error tracking and analytics
- **[Security best practices](../developer-guides/best-practices)** - Advanced security configuration 