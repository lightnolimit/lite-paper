# Lite Paper (Documentation) Site Template

A modern, responsive documentation-style lite paper website built with Next.js 15, TypeScript, and Tailwind CSS. Perfect for creating beautiful papers for your projects.

## ✨ Features

- 🎨 **Modern Design**: Clean, responsive interface with dark/light mode support
- 📱 **Mobile-First**: Optimized for all screen sizes
- 🔍 **Fast Search**: Instant search across all documentation
- 📖 **File Tree Navigation**: Intuitive sidebar navigation
- 🎯 **TypeScript**: Full type safety throughout
- 🚀 **Fast Performance**: Built on Next.js 15 with optimizations
- 📝 **Markdown Support**: Write content in Markdown with syntax highlighting
- 🎨 **Customizable**: Easy to theme and customize
- ☁️ **Deploy Anywhere**: Works on Vercel, Netlify, Cloudflare Pages, and more

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

### 4. Customize your documentation structure

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

### 5. Add your content

Create Markdown files in the structure you defined. The file paths in `documentation.ts` correspond to your content structure.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your documentation site.

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

## 🤝 Contributing

Contributions to improve the template are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you have questions or need help:

1. Check the documentation structure in `app/data/documentation.ts`
2. Look at the example components in `app/components/`
3. Open an issue on GitHub

---

**Happy documenting!** 📚✨
