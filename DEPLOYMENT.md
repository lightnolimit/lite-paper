# Deployment Guide

Deploy to Cloudflare Pages with GitHub Actions.

## Prerequisites

- Cloudflare account
- GitHub repository
- Node.js 16+

## Cloudflare Pages Setup

### 1. Create Cloudflare Pages Project

1. [Cloudflare dashboard](https://dash.cloudflare.com/) → Pages
2. Create project → Connect to Git
3. Select repository
4. Build settings:
   - Command: `npm run build`
   - Output: `out`
   - Node: `20`

### 2. Get API Credentials

1. My Profile → API Tokens → Create Token
2. Custom token permissions:
   - Account: Cloudflare Pages:Edit
   - Zone: Zone:Read (optional)
3. Copy API token and Account ID

## GitHub Repository Setup

### 1. Add GitHub Secrets

Settings → Secrets and variables → Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PROJECT_NAME`

### 2. Enable Actions

Go to Actions tab and enable workflows.

## Deployment Process

### Automatic Deployment

- **Production**: Push to `main`
- **Preview**: Open PR

### Manual Deployment

```bash
npm run build
npm run deploy
```

First time: `npx wrangler login`

## Environment Variables

In Cloudflare Pages settings:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BACKGROUND_TYPE`
- Other config as needed

## Custom Domain

1. Pages project → Custom domains
2. Add domain
3. Configure DNS

## Build Configuration

`wrangler.toml`:

```toml
name = "docs"
compatibility_date = "2025-05-15"
[assets]
directory = "./out"
```

## Troubleshooting

**Build failures**: Check Node version, dependencies, TypeScript errors
**Deployment issues**: Verify API permissions, project name, output directory
**Preview issues**: PR must be from same repo with correct permissions

## Performance

Cloudflare Pages provides: CDN, HTTPS, HTTP/3, compression, caching.

Optimizations in `_headers`:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## Monitoring

- Build status: GitHub Actions
- Deployment: Cloudflare dashboard
- Analytics: Cloudflare Web Analytics

## Rollback

Cloudflare Pages → Deployments → Rollback

Or:

```bash
git revert <commit>
git push origin main
```
