# Quick Start Guide

Get your documentation site up and running in just a few minutes! This guide will walk you through cloning the template, customizing it, and deploying it.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed on your system
- **npm** or **yarn** package manager
- A **Git** client for version control
- A **GitHub** account (for deployment automation)

## Step 1: Clone the Template

```bash
# Clone the repository
git clone https://github.com/your-username/documentation-template.git
cd documentation-template

# Install dependencies
npm install
```

## Step 2: Start Development Server

```bash
# Start the development server
npm run dev

# Your site will be available at:
# http://localhost:3000
```

The development server includes:

- **Hot reload** for instant updates
- **Error overlay** for debugging
- **TypeScript checking** in real-time

## Step 3: Customize Your Content

### Update Site Configuration

Edit the main configuration in `app/data/documentation.ts`:

```typescript
export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Your Section Name',
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

### Create Your Content

Add markdown files in `app/docs/content/`:

```markdown
# Your Page Title

Your content here! You can use:

- Standard markdown syntax
- Code blocks with syntax highlighting
- Tables, lists, and links
- Images and media
```

### Customize Styling

Modify the visual appearance:

- **Colors**: Edit CSS variables in `app/globals.css`
- **Fonts**: Update font imports and CSS
- **Layout**: Modify component styling
- **Animations**: Adjust motion components

## Step 4: Test Your Changes

Before deploying, test your site:

```bash
# Build for production
npm run build

# Start production server
npm start
```

Verify that:

- ✅ All pages load correctly
- ✅ Navigation works properly
- ✅ Mindmap displays your content
- ✅ Responsive design works on mobile
- ✅ Dark/light mode toggles correctly

## Step 5: Deploy to Cloudflare

### Option 1: Deploy via Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Connect your GitHub repository

2. **Configure Build**

   ```
   Build command: npm run build
   Build directory: out
   Node.js version: 18+
   ```

3. **Deploy**
   - Cloudflare will automatically build and deploy
   - Your site will be live at `your-project.pages.dev`

### Option 2: Deploy via CLI

1. **Update Project Name**
   - Edit `wrangler.toml` and set your project name:

   ```toml
   name = "your-project-name"
   ```

2. **First Deployment**

   ```bash
   # Create project and deploy
   npm run deploy:create
   ```

3. **Subsequent Deployments**
   ```bash
   # Deploy updates
   npm run deploy
   ```

**Note**: If you get a "Project not found" error, use `npm run deploy:create` for the first deployment.

## Alternative Deployment Options

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Static Export

For static hosting:

```bash
# Build static version
npm run build && npm run export
```

## What's Next?

Now that your documentation site is running:

1. 📖 Read the [Installation Guide](./installation) for detailed setup
2. 📚 Check the [User Guide](../user-guide/basic-usage) for content management
3. 🚀 Explore [Deployment Options](../../deployment/overview) for production setup
4. 🛠️ Browse [Developer Guides](../../developer-guides/code-examples) for advanced customization

Need help? Every section in this documentation includes detailed examples and troubleshooting tips!
