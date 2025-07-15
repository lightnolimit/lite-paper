# Quick Start Guide

Get your documentation site running in minutes.

## Prerequisites

- Node.js 16+
- npm package manager
- Git
- GitHub account (for deployment)

## Step 1: Clone the Template

```bash
git clone https://github.com/your-username/lite-paper.git
cd lite-paper
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
# http://localhost:3333
```

Includes hot reload, error overlay, and TypeScript checking.

## Step 3: Customize Your Content

### Update Configuration

Edit `app/data/documentation.ts`:

```typescript
export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Your Section',
    path: 'your-section',
    children: [
      {
        type: 'file',
        name: 'Your Page.md',
        path: 'your-section/your-page',
      },
    ],
  },
];
```

### Create Content

Add markdown files in `app/docs/content/`:

```markdown
# Your Page

Content with:

- Markdown syntax
- Code blocks
- Tables and links
```

### Customize Styling

- Colors: Edit `tailwind.config.js`
- Fonts: Update `app/globals.css`
- Layout: Modify components

## Step 4: Test Your Changes

Before deploying, test your site:

```bash
npm run build
npm start
```

Verify:

- Pages load correctly
- Navigation works
- Graph displays content
- Responsive design
- Theme toggle

## Step 5: Deploy to Cloudflare

### Option 1: Dashboard (Recommended)

1. [Cloudflare Pages](https://pages.cloudflare.com) → Connect repository
2. Build settings:
   ```
   Build command: npm run build
   Build directory: out
   Node.js version: 20
   ```
3. Deploy → Live at `your-project.pages.dev`

### Option 2: CLI

1. Edit `wrangler.toml`:

   ```toml
   name = "your-project-name"
   ```

2. Deploy:
   ```bash
   npm run deploy:create  # First time
   npm run deploy         # Updates
   ```

## Other Platforms

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

## What's Next?

1. [Installation Guide](./installation) for detailed setup
2. [User Guide](../user-guide/basic-usage) for content management
3. [Deployment](../../deployment/overview) for production
4. [Developer Guides](../../developer-guides/code-examples) for customization
