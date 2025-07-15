# Lite Paper - Modern Documentation Template

Modern documentation template built with Next.js 15, TypeScript, and Tailwind CSS. Features interactive visualization and optional AI assistance.

[![Fork on GitHub](https://img.shields.io/badge/Fork%20on-GitHub-black?logo=github)](https://github.com/lightnolimit/lite-paper/fork)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## Features

- Clean, responsive design with dark/light themes
- Fast search across documentation
- Interactive documentation visualization
- File tree navigation
- Optional AI assistant (Cloudflare Workers AI)
- Full TypeScript support
- Static export for any hosting platform
- Markdown with syntax highlighting
- Customizable themes

## 🚀 Quick Start

### 1. Fork this repository

Click the "Fork" button on GitHub to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure:

- Site name and URL
- AI features (optional)
- Analytics (optional)

### 5. Customize your documentation structure

Edit `app/data/documentation.ts` to define your documentation structure:

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

### 6. Add your content

Create Markdown files in the structure you defined. The file paths in `documentation.ts` correspond to your content structure.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to see your documentation site.

## 🚀 Deployment

### Cloudflare Pages

1. Fork this repository
2. Connect to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `out`
5. Deploy

### Other Platforms

- **Vercel**: `npx vercel`
- **Netlify**: `npx netlify deploy`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
app/
├── components/          # React components
├── data/               # Documentation structure
├── docs/               # Documentation pages
├── lib/                # Utilities (clientRAG)
├── providers/          # React contexts
└── utils/              # Helper functions
public/                 # Static assets
scripts/                # Build scripts
```

## 🎨 Customization

### Styling

- The site uses Tailwind CSS for styling
- Customize colors, fonts, and layout in `tailwind.config.js`
- Override styles in `app/globals.css`

Edit `app/data/documentation.ts` to define your structure. Write content in Markdown files under `app/docs/content/`.

## AI Assistant (Optional)

Enable AI-powered documentation assistance:

1. Set environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_ENABLE_AI="true"
   NEXT_PUBLIC_AI_WORKER_URL="https://your-worker.workers.dev"
   ```

2. Use Cmd/Ctrl + K → "Ask AI Assistant"

Uses RAG with Cloudflare Workers AI. See [AI_SETUP.md](AI_SETUP.md) for details.

## Updating Your Fork

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
git fetch upstream
git merge upstream/main
```

## Configuration

Copy `.env.example` to `.env.local` and customize.

Theme colors are in `tailwind.config.js`. The template uses:

- Hubot Sans (headings)
- Mona Sans (body)
- MapleMono (code)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License - see [LICENSE](LICENSE)

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
