# Code Examples

Welcome to the comprehensive code examples section! Here you'll find practical examples of how to build and customize features in your documentation site using Next.js, React, and modern web technologies.

## Getting Started

Let's start with a simple example of adding a new documentation page:

```typescript
// types/documentation.ts
export interface DocumentationPage {
  title: string;
  path: string;
  content: string;
  lastModified: Date;
  category: string;
}

// Adding a new page to the documentation structure
const newPage: DocumentationPage = {
  title: "My New Feature",
  path: "developer-guides/my-new-feature",
  content: "# My New Feature\n\nDetailed documentation content...",
  lastModified: new Date(),
  category: "developer-guides"
};
```

## Theme System Examples

Here's how to implement and customize the theme system:

```typescript|css|javascript
// TypeScript - Theme Provider Implementation
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  prefersReducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check system preferences
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsDarkMode(darkModeQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    // Load saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDarkMode(saved === 'dark');
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, prefersReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
---
/* CSS - Theme Variables and Transitions */
:root {
  /* Light theme colors */
  --background-color: #FAFBF9;
  --text-color: #1F2937;
  --text-secondary: #374151;
  --muted-color: #6B7280;
  --card-background: #FFFFFF;
  --border-color: #E5E7EB;

  /* Typography */
  --title-font: 'Urbanist', sans-serif;
  --body-font: 'Urbanist', sans-serif;
  --mono-font: 'MapleMono', 'SF Mono', monospace;

  /* Transitions */
  --theme-transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.dark {
  /* Dark theme colors */
  --background-color: #0B0D0F;
  --text-color: #F8FAFC;
  --text-secondary: #E2E8F0;
  --muted-color: #94A3B8;
  --card-background: #111317;
  --border-color: #1F2937;
}

/* Smooth transitions for all theme changes */
* {
  transition: var(--theme-transition);
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
    animation: none;
  }
}
---
// JavaScript - Dynamic Background System
class BackgroundManager {
  constructor() {
    this.currentBackground = 'wave';
    this.canvas = null;
    this.animationId = null;
  }

  init(canvasElement) {
    this.canvas = canvasElement;
    this.setupCanvas();
    this.startAnimation();
  }

  setupCanvas() {
    const ctx = this.canvas.getContext('2d');
    const resizeCanvas = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  startAnimation() {
    const animate = (timestamp) => {
      this.render(timestamp);
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
  }

  render(timestamp) {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    switch (this.currentBackground) {
      case 'wave':
        this.renderWave(ctx, timestamp);
        break;
      case 'stars':
        this.renderStars(ctx, timestamp);
        break;
      case 'dither':
        this.renderDither(ctx, timestamp);
        break;
    }
  }

  switchBackground(type) {
    this.currentBackground = type;
    localStorage.setItem('backgroundType', type);
  }
}

// Usage
const backgroundManager = new BackgroundManager();
backgroundManager.init(document.getElementById('background-canvas'));
```

## Navigation Component

Building a responsive navigation with search functionality:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { documentationTree } from '../data/documentation';

interface SearchResult {
  title: string;
  path: string;
  category: string;
  snippet?: string;
}

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchDocumentation(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchDocumentation = (query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    const searchInTree = (items: any[]) => {
      items.forEach(item => {
        if (item.type === 'file') {
          const title = item.name.replace('.md', '');
          if (title.toLowerCase().includes(searchTerm)) {
            results.push({
              title,
              path: item.path,
              category: item.path.split('/')[0]
            });
          }
        } else if (item.children) {
          searchInTree(item.children);
        }
      });
    };

    searchInTree(documentationTree);
    return results.slice(0, 10); // Limit results
  };

  const handleSearchSelect = (result: SearchResult) => {
    router.push(`/docs/${result.path}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-color border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-text-color">
              Documentation
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-color border border-border-color rounded-lg hover:border-text-color transition-colors"
            >
              <SearchIcon className="w-4 h-4" />
              Search docs...
              <kbd className="hidden sm:inline-block text-xs border border-border-color rounded px-1">
                ⌘K
              </kbd>
            </button>

            {/* Search Modal */}
            {isSearchOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]">
                <div className="bg-card-background border border-border-color rounded-lg w-full max-w-lg mx-4">
                  <div className="p-4 border-b border-border-color">
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-text-color placeholder-muted-color border-none outline-none"
                      autoFocus
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSelect(result)}
                          className="w-full text-left p-4 hover:bg-background-color transition-colors border-b border-border-color last:border-b-0"
                        >
                          <div className="font-medium text-text-color">
                            {result.title}
                          </div>
                          <div className="text-sm text-muted-color">
                            {result.category}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
```

## Documentation Graph Component

Creating an interactive visualization of documentation structure:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { documentationTree } from '../data/documentation';

interface GraphNode {
  id: string;
  label: string;
  path: string;
  x: number;
  y: number;
  connections: string[];
  category: string;
}

export function DocumentationGraph({ 
  currentPath, 
  onNodeClick,
  className 
}: {
  currentPath?: string;
  onNodeClick?: (path: string) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const graphNodes = buildGraphFromTree();
    setNodes(graphNodes);
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      drawGraph();
    }
  }, [nodes, hoveredNode, currentPath]);

  const buildGraphFromTree = (): GraphNode[] => {
    const nodes: GraphNode[] = [];
    const centerX = 400;
    const centerY = 300;
    let nodeIndex = 0;

    const processItem = (item: any, angle: number, radius: number, parentId?: string) => {
      if (item.type === 'file') {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const node: GraphNode = {
          id: item.path,
          label: item.name.replace('.md', ''),
          path: item.path,
          x,
          y,
          connections: parentId ? [parentId] : [],
          category: item.path.split('/')[0]
        };
        
        nodes.push(node);
      } else if (item.children) {
        // Add directory node
        const x = centerX + Math.cos(angle) * (radius * 0.6);
        const y = centerY + Math.sin(angle) * (radius * 0.6);
        
        const dirNode: GraphNode = {
          id: item.path,
          label: item.name,
          path: item.path,
          x,
          y,
          connections: [],
          category: 'directory'
        };
        
        nodes.push(dirNode);
        
        // Process children
        item.children.forEach((child: any, index: number) => {
          const childAngle = angle + (index - item.children.length / 2) * 0.3;
          processItem(child, childAngle, radius + 100, item.path);
        });
      }
    };

    documentationTree.forEach((section, index) => {
      const angle = (index / documentationTree.length) * Math.PI * 2;
      processItem(section, angle, 150);
    });

    return nodes;
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodes.find(n => n.id === connectionId);
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const isCurrent = currentPath === node.path;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 8 : 6, 0, Math.PI * 2);
      
      if (isCurrent) {
        ctx.fillStyle = '#3B82F6';
      } else if (node.category === 'directory') {
        ctx.fillStyle = '#8B5CF6';
      } else {
        ctx.fillStyle = '#6B7280';
      }
      
      ctx.fill();

      // Label
      ctx.fillStyle = '#374151';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 20);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance <= 8;
    });

    if (clickedNode && onNodeClick) {
      onNodeClick(clickedNode.path);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find hovered node
    const hoveredNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance <= 8;
    });

    setHoveredNode(hoveredNode?.id || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        className="w-full h-full border border-border-color rounded-lg"
      />
    </div>
  );
}
```

## Code Block Component

Advanced syntax highlighting with copy functionality:

```tsx
'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../providers/ThemeProvider';

interface CodeSnippet {
  language: string;
  code: string;
  label: string;
}

interface CodeBlockProps {
  snippets: CodeSnippet[];
  title?: string;
  defaultLanguage?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  snippets,
  title,
  defaultLanguage,
  showLineNumbers = false,
  className = ''
}: CodeBlockProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(defaultLanguage || snippets[0]?.language || '');
  const [copied, setCopied] = useState(false);

  const activeSnippet = snippets.find(s => s.language === activeTab) || snippets[0];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`bg-card-background border border-border-color rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b border-border-color">
          <h4 className="text-sm font-medium text-text-color">{title}</h4>
        </div>
      )}
      
      {snippets.length > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-color bg-background-color">
          <div className="flex gap-1">
            {snippets.map((snippet) => (
              <button
                key={snippet.language}
                onClick={() => setActiveTab(snippet.language)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeTab === snippet.language
                    ? 'bg-text-color text-background-color'
                    : 'text-muted-color hover:text-text-color'
                }`}
              >
                {snippet.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={copyToClipboard}
            className="text-xs text-muted-color hover:text-text-color transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      
      <div className="relative">
        <SyntaxHighlighter
          language={activeSnippet.language}
          style={isDarkMode ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem'
          }}
        >
          {activeSnippet.code}
        </SyntaxHighlighter>
        
        {snippets.length === 1 && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 text-xs text-muted-color hover:text-text-color transition-colors bg-background-color rounded border border-border-color"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
```

## Testing Examples

Unit and integration tests for documentation components:

```typescript
// __tests__/components/Navigation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '../components/Navigation';
import { ThemeProvider } from '../providers/ThemeProvider';

const MockedNavigation = () => (
  <ThemeProvider>
    <Navigation />
  </ThemeProvider>
);

describe('Navigation Component', () => {
  it('renders navigation with search functionality', () => {
    render(<MockedNavigation />);
    
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search docs/i)).toBeInTheDocument();
  });

  it('opens search modal when search button is clicked', async () => {
    render(<MockedNavigation />);
    
    const searchButton = screen.getByText('Search docs...');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search documentation...')).toBeInTheDocument();
    });
  });

  it('filters search results based on query', async () => {
    render(<MockedNavigation />);
    
    // Open search
    fireEvent.click(screen.getByText('Search docs...'));
    
    // Type search query
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'installation' } });
    
    await waitFor(() => {
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization Examples

```typescript
// utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measureRender(componentName: string, renderTime: number) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    const times = this.metrics.get(componentName)!;
    times.push(renderTime);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }

  getAverageRenderTime(componentName: string): number {
    const times = this.metrics.get(componentName);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  logPerformanceReport() {
    console.group('Performance Report');
    this.metrics.forEach((times, componentName) => {
      const avg = this.getAverageRenderTime(componentName);
      console.log(`${componentName}: ${avg.toFixed(2)}ms average`);
    });
    console.groupEnd();
  }
}

// Custom hook for measuring component render time
import { useEffect } from 'react';

export function useRenderTime(componentName: string) {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const renderTime = end - start;
      PerformanceMonitor.getInstance().measureRender(componentName, renderTime);
    };
  });
}
```

## Build and Deployment

Real deployment configuration for Next.js:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Enable static export
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }
};

module.exports = nextConfig;
```

## Error Handling

Robust error handling for documentation features:

```typescript
// utils/errorHandler.ts
export class DocumentationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'DocumentationError';
  }
}

export function handleDocumentationError(error: unknown): DocumentationError {
  if (error instanceof DocumentationError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new DocumentationError(error.message, 'UNKNOWN_ERROR');
  }
  
  return new DocumentationError('An unknown error occurred', 'UNKNOWN_ERROR');
}

// Error boundary for React components
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DocumentationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Documentation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">
        {error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Page
      </button>
    </div>
  );
}
```

---

**Related Documentation:**
- [Advanced Features](../user-guide/advanced-features) - Advanced platform capabilities
- [Best Practices](./best-practices) - Development guidelines
- [Icon Customization](./icon-customization) - Adding custom icons
- [UI Configuration](./ui-configuration) - Theme and layout customization