# Lite Paper - Modern Documentation Template

A beautiful, fast, and customizable documentation website template built with Next.js 15, TypeScript, and Tailwind CSS. Features an interactive mindmap visualization and optional AI-powered documentation assistant.

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lightnolimit/lite-paper)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Modern Design**: Clean, responsive interface with dark/light mode support
- 📱 **Mobile-First**: Optimized for all screen sizes
- 🔍 **Fast Search**: Instant search across all documentation
- 🧭 **Interactive Mindmap**: Visualize your documentation structure
- 📖 **File Tree Navigation**: Intuitive sidebar navigation
- 🤖 **AI Assistant** (Optional): Powered by your choice of LLM
- 🎯 **TypeScript**: Full type safety throughout
- 🚀 **Static Export**: Deploy anywhere with no server required
- 📝 **Markdown Support**: Write content in Markdown with syntax highlighting
- 🎨 **Customizable**: Easy to theme and customize
- ☁️ **Deploy Anywhere**: Works on Cloudflare Pages, Vercel, Netlify, and more

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
# or
pnpm install
# or
yarn install
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

Open [http://localhost:3000](http://localhost:3000) to see your documentation site.

## 🚀 Quick Deploy

Deploy this documentation site to Cloudflare Pages in one click:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-username/your-repo)

> **Note**: Replace `your-username/your-repo` with your actual GitHub repository URL.

## 📁 Project Structure

```
├── app/
│   ├── components/          # React components
│   │   ├── FileTree.tsx    # Navigation sidebar
│   │   ├── SearchBar.tsx   # Search functionality
│   │   └── ...
│   ├── data/
│   │   └── documentation.ts # Your documentation structure
│   ├── globals.css         # Global styles
│   └── layout.tsx          # App layout
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
└── ...
```

## 🎨 Customization

### Styling

- The site uses Tailwind CSS for styling
- Customize colors, fonts, and layout in `tailwind.config.js`
- Override styles in `app/globals.css`

### Navigation Structure

- Define your documentation structure in `app/data/documentation.ts`
- Supports nested directories and files
- Each entry maps to a route in your application

### Content

- Write your documentation in Markdown
- Files are loaded dynamically based on the structure you define
- Supports syntax highlighting and rich formatting

## 🤖 AI Assistant (Optional)

The template includes an optional AI-powered documentation assistant. To enable it:

1. **Set up environment variables** in `.env.local`:

   ```env
   NEXT_PUBLIC_ENABLE_AI="true"
   NEXT_PUBLIC_AI_WORKER_URL="https://your-ai-endpoint.workers.dev"
   ```

2. **Deploy an AI endpoint** (choose one):
   - **Cloudflare Workers AI**: Deploy your own Llama model
   - **OpenAI API**: Use any OpenAI-compatible endpoint
   - **Local LLM**: Connect to Ollama or similar

3. **Test the integration**:
   - Open Command Palette (Cmd/Ctrl + K)
   - Select "Ask AI Assistant"
   - Ask questions about your documentation

The AI assistant uses RAG (Retrieval Augmented Generation) to provide accurate answers based on your documentation content.

## 📦 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy!

### Vercel

1. Connect your GitHub repository to Vercel
2. Deploy with default settings

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Deploy!

## 🔄 Keeping Your Fork Updated

To receive updates from the template while keeping your content:

### Setup upstream remote (one-time setup)

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
```

### Update from upstream

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream changes (this will update code, not your content)
git merge upstream/main

# Resolve any conflicts and commit
git commit -m "Merge upstream changes"

# Push to your fork
git push origin main
```

## 🛠️ Configuration

### Environment Variables

See `.env.example` for all available options:

| Variable                    | Description           | Default                   |
| --------------------------- | --------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_NAME`     | Your site name        | "Your Documentation Site" |
| `NEXT_PUBLIC_SITE_URL`      | Production URL        | "https://your-domain.com" |
| `NEXT_PUBLIC_GITHUB_URL`    | GitHub repository URL | -                         |
| `NEXT_PUBLIC_ENABLE_AI`     | Enable AI assistant   | "false"                   |
| `NEXT_PUBLIC_AI_WORKER_URL` | AI endpoint URL       | -                         |

### Theming

Customize colors in `app/globals.css`:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #10b981;
  /* ... more variables */
}
```

### Typography

The template uses custom fonts:

- **Headings**: Urbanist
- **Body**: Urbanist
- **Code**: MapleMono

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔒 Security

For security issues, please see [SECURITY.md](SECURITY.md).

## 🆘 Support

If you have questions or need help:

1. Check the [documentation](https://lite-paper.pages.dev)
2. Join our [GitHub Discussions](https://github.com/lightnolimit/lite-paper/discussions)
3. Open an [issue](https://github.com/lightnolimit/lite-paper/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Icons from various pixel art collections

---

**Happy documenting!** 📚✨

Made with ❤️ by the Lite Paper community
