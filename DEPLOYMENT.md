# Deployment Guide

This guide covers deploying the Lite Paper Documentation Template to Cloudflare Pages using GitHub Actions.

## Prerequisites

- A Cloudflare account
- A GitHub repository
- Node.js 16+ installed locally

## Cloudflare Pages Setup

### 1. Create a Cloudflare Pages Project

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** in the sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select your GitHub repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node version**: `20`

### 2. Get Your API Credentials

1. Go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use the **Custom token** template with these permissions:
   - **Account** - Cloudflare Pages:Edit
   - **Zone** - Zone:Read (optional, for custom domains)
4. Copy the generated API token

### 3. Get Your Account ID

1. Go to any domain in your Cloudflare account
2. In the right sidebar, find your **Account ID**
3. Copy this value

## GitHub Repository Setup

### 1. Add Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**, and add:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_PROJECT_NAME`: Your Cloudflare Pages project name

### 2. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable workflows if not already enabled

## Deployment Process

### Automatic Deployment

Once configured, deployments happen automatically:

1. **Production**: Push to `main` branch triggers deployment to production
2. **Preview**: Opening a PR creates a preview deployment with a unique URL

### Manual Deployment

To deploy manually from your local machine:

```bash
# Build the project
npm run build

# Deploy using Wrangler
npm run deploy
```

Note: You'll need to configure Wrangler with your Cloudflare credentials first:

```bash
npx wrangler login
```

## Environment Variables

Set these in your Cloudflare Pages project settings:

- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `NEXT_PUBLIC_BACKGROUND_TYPE`: Default background (dither, wave, stars, solid)
- Any other API keys or configuration

## Custom Domain

To add a custom domain:

1. Go to your Cloudflare Pages project
2. Click **Custom domains** tab
3. Click **Add a custom domain**
4. Follow the instructions to configure DNS

## Build Configuration

The project uses these build settings:

```toml
# wrangler.toml
name = "docs"
compatibility_date = "2025-05-15"
[assets]
directory = "./out"
```

## Troubleshooting

### Build Failures

1. Check Node version matches (20.x recommended)
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run type-check`
4. Verify environment variables are set

### Deployment Issues

1. Verify API token has correct permissions
2. Check project name matches in secrets
3. Ensure `out` directory is generated after build
4. Check GitHub Actions logs for detailed errors

### Preview Deployments Not Working

1. Ensure PR is from a branch in the same repository
2. Check Cloudflare Pages project settings allow preview deployments
3. Verify GitHub token permissions

## Performance Optimization

Cloudflare Pages automatically provides:

- Global CDN distribution
- Automatic HTTPS
- HTTP/3 support
- Brotli compression
- Cache headers optimization

Additional optimizations in `_headers` file:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

## Monitoring

1. **Build Status**: Check GitHub Actions tab
2. **Deployment Status**: Cloudflare Pages dashboard
3. **Analytics**: Enable Web Analytics in Cloudflare
4. **Performance**: Use Lighthouse CI in PRs

## Security

The deployment process includes:

- Automatic security headers via `_headers`
- Environment variable protection
- Secure API token handling
- CSP (Content Security Policy) configuration

## Rollback

To rollback a deployment:

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click **Rollback** on a previous deployment

Or use Git:

```bash
git revert <commit-hash>
git push origin main
```

This will trigger a new deployment with the reverted code.
