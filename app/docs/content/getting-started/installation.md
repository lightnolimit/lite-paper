# Installation Guide

This comprehensive guide covers everything you need to know to install and set up your documentation site template.

## System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 1GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

### Recommended Development Environment
- **Node.js**: Latest LTS version (20.x)
- **Package Manager**: npm 9+ or yarn 3+
- **Editor**: VS Code with TypeScript and React extensions
- **Terminal**: Modern shell (zsh, fish, or PowerShell)

## Prerequisites

### 1. Install Node.js
Choose your installation method:

**Option A: Official Installer**
```bash
# Download from https://nodejs.org
# Verify installation
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Option B: Node Version Manager (Recommended)**
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js LTS
nvm install --lts
nvm use --lts
```

**Option C: Package Managers**
```bash
# macOS with Homebrew
brew install node

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# Windows with Chocolatey
choco install nodejs
```

### 2. Install Git
```bash
# macOS with Homebrew
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win
```

### 3. Set Up Your Environment
```bash
# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify Git installation
git --version
```

## Installation Methods

### Method 1: Clone from GitHub (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/documentation-template.git
cd documentation-template

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Method 2: Fork and Clone

```bash
# 1. Fork the repository on GitHub (click "Fork" button)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/documentation-template.git
cd documentation-template

# 3. Add upstream remote (for updates)
git remote add upstream https://github.com/original-owner/documentation-template.git

# 4. Install dependencies
npm install
```

### Method 3: Download ZIP

```bash
# 1. Download ZIP from GitHub
# 2. Extract to your desired location
# 3. Open terminal in extracted folder
cd documentation-template-main

# 4. Install dependencies
npm install
```

## Project Structure

After installation, your project structure will look like this:

```
documentation-template/
├── app/                          # Next.js app directory
│   ├── components/              # React components
│   │   ├── DocumentationGraph.tsx  # Interactive mindmap
│   │   ├── FileTree.tsx         # Navigation sidebar
│   │   └── ...                  # Other components
│   ├── docs/                    # Documentation system
│   │   ├── content/             # Markdown content files
│   │   └── components/          # Doc-specific components
│   ├── data/                    # Configuration data
│   │   └── documentation.ts     # Site structure
│   └── globals.css              # Global styles
├── public/                      # Static assets
│   └── assets/                  # Images, icons, etc.
├── .next/                       # Build output (auto-generated)
├── package.json                 # Dependencies and scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
└── tsconfig.json                # TypeScript configuration
```

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_SITE_NAME="Your Documentation Site"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_GITHUB_URL="https://github.com/your-username/your-repo"
```

### 2. Site Configuration

Edit `app/data/documentation.ts` to customize your site structure:

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
        path: 'getting-started/introduction'
      }
      // Add more files...
    ]
  }
  // Add more sections...
];
```

### 3. Styling Configuration

Customize colors and theme in `app/globals.css`:

```css
:root {
  --primary-color: #3b82f6;      /* Blue */
  --secondary-color: #64748b;    /* Gray */
  --accent-color: #10b981;       /* Green */
  --background-color: #ffffff;   /* White */
  --text-color: #1f2937;         /* Dark Gray */
}

[data-theme="dark"] {
  --background-color: #111827;   /* Dark */
  --text-color: #f9fafb;         /* Light Gray */
}
```

## Available Scripts

Once installed, you can use these npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Deployment
npm run export       # Export static files
npm run analyze      # Analyze bundle size
```

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module` errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript errors during build
```bash
# Solution: Check TypeScript configuration
npm run type-check
```

**Issue**: Port already in use
```bash
# Solution: Use different port
npm run dev -- --port 3001
```

**Issue**: Permission errors (macOS/Linux)
```bash
# Solution: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Development Tips

1. **Use TypeScript**: The template is fully typed for better development experience
2. **Hot Reload**: Changes to components and content update automatically
3. **Error Overlay**: Development server shows helpful error messages
4. **Browser Dev Tools**: Use React Developer Tools for debugging

### Performance Optimization

```bash
# Enable SWC compiler (faster builds)
# Already configured in next.config.js

# Analyze bundle size
npm run analyze

# Optimize images
# Use next/image component for automatic optimization
```

## Verification

Verify your installation is working correctly:

```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Check that all features work:
#    - Navigation sidebar
#    - Mindmap visualization
#    - Dark/light mode toggle
#    - Responsive design
```

## Next Steps

Your installation is complete! Here's what to do next:

1. 📝 **Customize Content**: Add your own markdown files
2. 🎨 **Style Your Site**: Modify colors and layout
3. 🚀 **Deploy**: Choose your hosting platform
4. 📊 **Analytics**: Add tracking if needed

Continue to the [Quick Start Guide](./quick-start) to begin customizing your site! 