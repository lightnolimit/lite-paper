# Deploying to Cloudflare Pages

Cloudflare Pages is the **recommended hosting platform** for this documentation template. It offers excellent performance, global CDN, automatic SSL, and seamless integration with GitHub.

## Deployment Overview

Cloudflare Pages provides two main deployment methods:

1. **Dashboard Deployment** - Connect your GitHub repository through the web interface
2. **CLI Deployment** - Deploy directly using Wrangler CLI

Both methods offer automatic deployments on every push to your repository.

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
- A **Cloudflare API Token** with proper permissions (see below)

## API Token Configuration

### Creating an API Token for Deployment

To deploy using the CLI or GitHub Actions, you need a Cloudflare API token with specific permissions:

1. **Go to API Tokens**
   - Navigate to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click **"Create Token"**

2. **Use Custom Template**
   - Select **"Create Custom Token"**
   - Give it a descriptive name: `Pages Deployment Token`

3. **Required Permissions**

   Configure these **exact permissions**:

   ```yaml
   Account Permissions:
     - Cloudflare Pages:Edit
     - Account Settings:Read (for account ID verification)

   Zone Permissions (if using custom domain):
     - Zone:Read
     - Page Rules:Edit
     - DNS:Edit (for custom domain setup)
   ```

4. **Account Resources**
   - Include: Select your specific account
   - Zone Resources: Include all zones (or specific zone for custom domain)

5. **Token Summary**

   Your token configuration should look like:

   ```
   Token name: Pages Deployment Token

   Permissions:
   ├── Account
   │   ├── Cloudflare Pages:Edit
   │   └── Account Settings:Read
   └── Zone (optional for custom domains)
       ├── Zone:Read
       ├── Page Rules:Edit
       └── DNS:Edit

   Account Resources:
   └── Include: Your Account Name

   Zone Resources:
   └── Include: All zones (or specific zone)
   ```

6. **Create and Save Token**
   - Click **"Continue to summary"**
   - Review permissions
   - Click **"Create Token"**
   - **Copy the token immediately** (it won't be shown again!)

### Using the API Token

**For Manual Deployment (Wrangler CLI):**

```bash
# Set as environment variable
export CLOUDFLARE_API_TOKEN="your-token-here"

# Or use in command
CLOUDFLARE_API_TOKEN="your-token-here" npm run deploy
```

**For GitHub Actions:**

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret: `CLOUDFLARE_API_TOKEN`
4. Paste your token value

**For Cloudflare Dashboard:**

- No API token needed when using the web interface
- Cloudflare handles authentication automatically

### Troubleshooting Token Issues

**"Authentication error [code: 10000]"**

- Token lacks required permissions
- Regenerate token with all permissions listed above

**"Project not found [code: 8000007]"**

- Project doesn't exist yet
- Create project first via dashboard or use `--create` flag

**"Insufficient permissions"**

- Token missing specific permission
- Check token summary at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

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
Build output directory: out
Root directory: / (leave empty)

# Environment Variables
NODE_VERSION: 18
NPM_VERSION: 9
```

**Important Build Settings:**

- **Framework preset**: Next.js (Static HTML Export)
- **Node.js version**: 18 or higher
- **Build command**: `npm run build`
- **Build directory**: `out`

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

### Step 4: Configure Wrangler (For CLI Deployment)

If you're deploying via CLI using Wrangler, create or update `wrangler.toml`:

```toml
# wrangler.toml
name = "your-project-name"  # Must match your Cloudflare Pages project
compatibility_date = "2025-01-14"
pages_build_output_dir = "out"

[env.production]
compatibility_date = "2025-01-14"
```

**Important**: The `name` field must match one of these:

- An existing Cloudflare Pages project name
- A new project name (will be created on first deploy)
- Your desired project URL: `your-project-name.pages.dev`

To create a new project automatically:

```bash
# Use the --create flag on first deployment
npx wrangler pages deploy out --create
```

### Step 5: Advanced Configuration

Create a `next.config.js` file optimized for Cloudflare:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
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
    };
  },
};

module.exports = nextConfig;
```

### Step 5: Deploy Your Site

#### Dashboard Deployment

After configuring your project:

1. **Initial Deployment**
   - Click **"Save and Deploy"**
   - Cloudflare will clone your repository
   - Build process starts automatically
   - Monitor progress in the build log

2. **Automatic Deployments**
   - Every push to your main branch triggers a new deployment
   - Pull requests create preview deployments
   - No manual intervention required

3. **Access Your Site**
   - Production: `https://your-project.pages.dev`
   - Preview: `https://[branch].[project].pages.dev`

#### CLI Deployment

Using Wrangler for direct deployment:

```bash
# First time setup
npm install -g wrangler
wrangler login

# Build your site
npm run build

# Deploy (first time - creates project)
npm run deploy:create

# Deploy (subsequent updates)
npm run deploy
```

**CLI Deployment Benefits:**

- Deploy without pushing to Git
- Test production builds locally
- Automate with scripts
- Use in CI/CD pipelines

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

**"Project not found [code: 8000007]" during deployment**

```bash
# Solution 1: Create project first via dashboard
# Go to Cloudflare Pages → Create a project

# Solution 2: Use deploy:create command for first deployment
npm run deploy:create

# Solution 3: Update wrangler.toml with correct project name
name = "your-existing-project-name"
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
  return new Response('Hello from the edge!');
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
