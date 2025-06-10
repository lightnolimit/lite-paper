# API Reference Overview

Complete reference for the documentation system API and components.

## Getting Started with the API

This documentation system provides several APIs and components that you can extend and customize:

### Component API

The main components available for customization:

- **DocumentationGraph** - Interactive mind map visualization
- **FileTree** - Navigation sidebar component  
- **ThemeProvider** - Theme and motion preference management
- **BackgroundSelector** - Background animation controls

### Configuration API

Key configuration files:

- `app/data/documentation.ts` - Site structure definition
- `app/globals.css` - Theme colors and styling
- `next.config.js` - Build and deployment settings
- `tailwind.config.js` - Utility classes and theme

## Core Concepts

### File Structure

```
app/
├── components/          # Reusable UI components
├── docs/               # Documentation system
│   ├── content/        # Markdown content files
│   └── components/     # Doc-specific components
├── data/               # Configuration and data
└── providers/          # React context providers
```

### Routing System

The documentation uses Next.js dynamic routing:

```typescript
// Route: /docs/[...slug]
// Maps to: app/docs/content/{slug}.md
```

### Theme System

Theme management through CSS custom properties:

```css
:root {
  --primary-color: #678D58;    /* Matcha green */
  --background-color: #F3F5F0;
}

.dark {
  --primary-color: #FF85A1;    /* Sakura pink */
  --background-color: #0F0F12;
}
```

## Component Props

### DocumentationGraph

Interactive mind map component for visualizing documentation structure.

```typescript
interface DocumentationGraphProps {
  currentPath?: string;        // Current active page
  onNodeClick?: (path: string) => void;  // Node click handler
  className?: string;          // Additional CSS classes
}
```

**Features:**
- Theme-aware colors
- Search functionality with relevance scoring
- Reduced motion support
- Responsive design

### FileTree

Navigation component for the documentation sidebar.

```typescript
interface FileTreeProps {
  items: FileItem[];          // Documentation structure
  onSelect: (item: FileItem) => void;  // Selection handler
  currentPath?: string;       // Current active page
}

interface FileItem {
  name: string;               // Display name
  path: string;               // URL path
  type: 'file' | 'directory'; // Item type
  children?: FileItem[];      // Nested items
}
```

### ThemeProvider

Context provider for theme and accessibility preferences.

```typescript
interface ThemeContextType {
  isDarkMode: boolean;              // Current theme state
  toggleTheme: () => void;          // Theme toggle function
  prefersReducedMotion: boolean;    // Motion preference
  toggleReducedMotion: () => void;  // Motion toggle function
}
```

## Customization Hooks

### useTheme()

Access theme and motion preferences:

```typescript
import { useTheme } from '../providers/ThemeProvider';

function MyComponent() {
  const { 
    isDarkMode, 
    toggleTheme,
    prefersReducedMotion,
    toggleReducedMotion 
  } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={isDarkMode ? 'dark-styles' : 'light-styles'}
    >
      Toggle Theme
    </button>
  );
}
```

## Styling API

### CSS Custom Properties

Theme-aware styling using CSS variables:

```css
.my-component {
  background-color: var(--card-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}
```

### Available Variables

| Variable | Light Mode | Dark Mode | Purpose |
|----------|------------|-----------|---------|
| `--primary-color` | #678D58 | #FF85A1 | Primary theme color |
| `--background-color` | #F3F5F0 | #0F0F12 | Page background |
| `--card-color` | #FFFFFF | #1A1A1F | Card backgrounds |
| `--text-color` | #2E3A23 | #F0F0F5 | Primary text |
| `--border-color` | #222 | #bbb | Borders and dividers |

### Font Variables

```css
:root {
  --title-font: 'Yeezy T-Star', sans-serif;
  --body-font: 'Urbanist', sans-serif;
  --mono-font: 'MapleMono', 'SF Mono', monospace;
}
```

## Advanced Usage

### Custom Background Components

Create your own animated background:

```typescript
import React from 'react';

const CustomBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Your custom background implementation */}
    </div>
  );
});

export default CustomBackground;
```

### Extending the Mind Map

Customize the documentation graph:

```typescript
// In your component
<DocumentationGraph 
  currentPath={currentPath}
  onNodeClick={(path) => {
    // Custom navigation logic
    router.push(`/docs/${path}`);
    analytics.track('mindmap_navigation', { path });
  }}
  className="custom-mindmap-styles"
/>
```

### Adding New Content Types

Extend the FileItem type for new content:

```typescript
interface ExtendedFileItem extends FileItem {
  icon?: string;          // Custom icon
  description?: string;   // Item description
  tags?: string[];        // Content tags
}
```

## Performance Considerations

### Reduced Motion

Always respect user motion preferences:

```typescript
const { prefersReducedMotion } = useTheme();

const animations = prefersReducedMotion ? {} : {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};
```

### Code Splitting

Use dynamic imports for heavy components:

```typescript
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false }
);
```

## Next Steps

- **[Authentication Guide](./authentication)** - Implement user authentication
- **[Endpoints Reference](./endpoints)** - Available API endpoints
- **[Code Examples](../developer-guides/code-examples)** - Practical implementation examples 