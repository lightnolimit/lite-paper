# Installation Guide

Detailed setup for the documentation template.

## Requirements

- Node.js 16+
- Git
- 1GB free space

## Prerequisites

### Install Node.js

```bash
# Download from https://nodejs.org
node --version  # Should be v16.0.0+
```

### Install Git

```bash
# Verify installation
git --version
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/lite-paper.git
cd lite-paper
npm install
npm run dev
```

### Fork Method

```bash
# 1. Fork on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/lite-paper.git
cd lite-paper
npm install
```

## Project Structure

```
app/
├── components/          # React components
├── docs/               # Documentation pages
├── data/               # Site structure
└── lib/                # Utilities
public/                 # Static assets
scripts/                # Build scripts
```

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_NAME="Your Site"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

### Site Structure

Edit `app/data/documentation.ts` for navigation structure.

### Styling

Customize colors in `tailwind.config.js`.

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript checks
npm run deploy       # Deploy to Cloudflare
```

## Troubleshooting

**Module errors**: `rm -rf node_modules && npm install`
**TypeScript errors**: `npm run type-check`
**Port in use**: Change port in next.config.js

### Development Tips

- Hot reload updates automatically
- Use TypeScript for better DX
- React Developer Tools for debugging

## Verification

```bash
npm run dev
# Open http://localhost:3333
```

Verify navigation, graph visualization, and theme toggle work.

## Next Steps

1. Customize content
2. Style your site
3. Deploy to platform

See [Quick Start Guide](./quick-start) for next steps.
