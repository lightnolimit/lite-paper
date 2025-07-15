# Configuration

Customize your documentation site settings.

## Environment Variables

Create `.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Your Documentation"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_GITHUB_URL="https://github.com/user/repo"

# AI Features (Optional)
NEXT_PUBLIC_ENABLE_AI="false"
NEXT_PUBLIC_AI_WORKER_URL=""
```

## Theme Configuration

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#FF85A1', // Sakura pink
          secondary: '#FFC4DD', // Light pink
          background: '#0F0F12', // Dark background
        },
        light: {
          primary: '#678D58', // Matcha green
          secondary: '#A3C9A8', // Light green
          background: '#F3F5F0', // Light background
        },
      },
    },
  },
};
```

## Documentation Structure

Edit `app/data/documentation.ts`:

```typescript
export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Getting Started',
    path: 'getting-started',
    children: [
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'getting-started/introduction',
      },
    ],
  },
];
```

## Next.js Configuration

Edit `next.config.js`:

```javascript
const nextConfig = {
  output: 'export', // Static export
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};
```

## Build Scripts

Custom npm scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "npm run generate:docs && next dev -p 3333",
    "build": "npm run generate:llms && npm run generate:docs && next build",
    "generate:docs": "node scripts/generate-docs.mjs",
    "deploy": "npx wrangler pages deploy out"
  }
}
```

_Issues? See [troubleshooting guide](./troubleshooting)._
