# Deploying to Cloudflare Pages

Cloudflare Pages is the **recommended hosting platform** for this documentation template. It offers excellent performance, global CDN, automatic SSL, and seamless integration with GitHub.

## Why Cloudflare Pages?

✅ **Free Tier**: Generous limits for documentation sites  
✅ **Global CDN**: Ultra-fast loading worldwide  
✅ **Automatic SSL**: HTTPS enabled by default  
✅ **Git Integration**: Deploy automatically from GitHub  
✅ **Preview Deployments**: Test changes before going live  
✅ **Custom Domains**: Use your own domain for free  
✅ **Edge Functions**: Add server-side functionality  

## Prerequisites

Before deploying, ensure you have:
- A **GitHub repository** with your documentation site
- A **Cloudflare account** (free at [cloudflare.com](https://cloudflare.com))
- Your site **builds successfully** locally with `npm run build`

## Deployment Steps

### Step 1: Connect Your Repository

1. **Sign in to Cloudflare**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** in the sidebar

2. **Create a New Project**
   - Click **"Create a project"**
   - Select **"Connect to Git"**
   - Choose **GitHub** as your Git provider

3. **Authorize Cloudflare**
   - Click **"Connect GitHub"**
   - Authorize Cloudflare to access your repositories
   - Select the repository containing your documentation site

### Step 2: Configure Build Settings

Configure your project with these **exact settings**:

```yaml
# Build Configuration
Build command: npm run build
Build output directory: .next
Root directory: / (leave empty)

# Environment Variables
NODE_VERSION: 18
NPM_VERSION: 9
```

**Important Build Settings:**
- **Framework preset**: Next.js (Static HTML Export)
- **Node.js version**: 18 or higher
- **Build command**: `npm run build`
- **Build directory**: `.next`

### Step 3: Set Environment Variables

Add these environment variables in the Cloudflare Pages dashboard:

```bash
# Required for Next.js build
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Optional: Custom configuration
NEXT_PUBLIC_SITE_NAME=Your Documentation Site
NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
```

To add environment variables:
1. Go to your project in Cloudflare Pages
2. Click **Settings** → **Environment variables**
3. Add each variable with **Production** scope

### Step 4: Advanced Configuration

Create a `next.config.js` file optimized for Cloudflare:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Optional: Add base path if deploying to subdirectory
  // basePath: '/docs',
  
  // Trailing slash for better static hosting
  trailingSlash: true,
  
  // Optimize for static hosting
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/docs': { page: '/docs' },
      // Add other routes as needed
    }
  }
}

module.exports = nextConfig
```

### Step 5: Deploy

1. **Trigger Deployment**
   - Cloudflare automatically builds when you push to your main branch
   - Or click **"Deploy site"** in the dashboard

2. **Monitor Build**
   - Watch the build log in real-time
   - Typical build time: 2-5 minutes

3. **Access Your Site**
   - Your site will be available at: `https://your-project.pages.dev`
   - Cloudflare provides a random subdomain

## Custom Domain Setup

### Step 1: Add Custom Domain

1. **In Cloudflare Pages**
   - Go to your project
   - Click **Custom domains** tab
   - Click **"Set up a custom domain"**

2. **Enter Your Domain**
   - Type your domain (e.g., `docs.yourdomain.com`)
   - Click **"Continue"**

### Step 2: DNS Configuration

**Option A: Domain managed by Cloudflare**
```bash
# DNS records are added automatically
# Just verify the CNAME record exists
```

**Option B: External DNS provider**
```bash
# Add this CNAME record to your DNS provider:
Type: CNAME
Name: docs (or your subdomain)
Value: your-project.pages.dev
TTL: Auto (or 300)
```

### Step 3: SSL Certificate

- SSL certificates are **automatically provisioned**
- Usually takes 10-15 minutes to activate
- Supports wildcard certificates for subdomains

## Automatic Deployments

### Branch-based Deployments

Configure automatic deployments:

```yaml
# Production Branch: main
# Preview Branches: develop, staging, feature/*

# Every push to 'main' → Production deployment
# Every push to other branches → Preview deployment
```

### Preview Deployments

Each pull request gets a unique preview URL:
- `https://pr-123.your-project.pages.dev`
- Perfect for testing changes before merging
- Automatically deleted when PR is closed

## Performance Optimization

### Build Optimization

Optimize your build for faster deployments:

```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:static": "next build && next export"
  }
}
```

### Cloudflare Features

Enable these Cloudflare features for better performance:

1. **Auto Minify**
   - Dashboard → Speed → Optimization
   - Enable JavaScript, CSS, and HTML minification

2. **Brotli Compression**
   - Automatically enabled for Pages
   - Better compression than gzip

3. **HTTP/3**
   - Enabled by default
   - Faster connection establishment

## Monitoring and Analytics

### Built-in Analytics

Cloudflare provides free analytics:
- **Page views** and **unique visitors**
- **Geographic distribution**
- **Performance metrics**
- **Error tracking**

Access analytics:
1. Go to your Pages project
2. Click **Analytics** tab
3. View real-time and historical data

### Web Analytics (Enhanced)

For more detailed analytics:
1. Enable **Cloudflare Web Analytics**
2. Add the tracking script to your site
3. Get detailed user behavior insights

## Troubleshooting

### Common Build Issues

**Build fails with "Command not found"**
```bash
# Solution: Ensure package.json has correct scripts
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
```

**Static export fails**
```bash
# Solution: Check next.config.js settings
module.exports = {
  output: 'export',
  images: { unoptimized: true }
}
```

**404 errors on page refresh**
```bash
# Solution: Add _redirects file to public folder
/* /index.html 200
```

### Performance Issues

**Slow build times**
```bash
# Solutions:
1. Enable Cloudflare build cache
2. Optimize dependencies
3. Use lighter base Docker image
```

**Large bundle size**
```bash
# Solutions:
1. Run: npm run build:analyze
2. Remove unused dependencies
3. Enable tree shaking
```

## Advanced Features

### Edge Functions

Add server-side functionality with Cloudflare Workers:

```javascript
// functions/api/hello.js
export function onRequest(context) {
  return new Response('Hello from the edge!')
}
```

### Headers and Redirects

Create `public/_headers` and `public/_redirects`:

```bash
# _headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# _redirects
/old-path/* /new-path/:splat 301
/docs/* /documentation/:splat 301
```

## Cost Considerations

### Free Plan Limits

Cloudflare Pages Free Plan includes:
- **Unlimited requests**
- **Unlimited bandwidth**
- **500 builds per month**
- **20,000 files per deployment**
- **25MB file size limit**

### Pro Plan Benefits ($20/month)

If you need more:
- **5,000 builds per month**
- **Additional collaborators**
- **Enhanced security features**
- **Priority support**

## Best Practices

### Repository Structure
```
your-docs-repo/
├── .github/workflows/    # GitHub Actions (optional)
├── app/                  # Next.js app
├── public/              # Static assets
├── package.json         # Dependencies
├── next.config.js       # Next.js config
└── README.md           # Documentation
```

### Environment Management
- Use **production** environment variables for live site
- Use **preview** environment variables for testing
- Never commit sensitive data to repository

### Security
- Enable **bot fight mode** in Cloudflare
- Use **security headers** for protection
- Regularly update dependencies

Your documentation site is now live on Cloudflare Pages! 🚀

**Next Steps:**
- [Set up custom domain](../overview#custom-domains)
- [Configure analytics](../production-setup#analytics)
- [Optimize performance](../production-setup#performance) 