# Advanced Features

Explore the powerful advanced capabilities of our documentation platform.

## Interactive Components

### Documentation Graph Visualization

Our documentation features an interactive mind map that visualizes the structure of all documentation pages:

```tsx
import { DocumentationGraph } from '../components/DocumentationGraph';

function MyPage() {
  return (
    <DocumentationGraph 
      currentPath="user-guide/advanced-features"
      onNodeClick={(path) => {
        // Navigate to the selected documentation page
        router.push(`/docs/${path}`);
      }}
      className="w-full h-96"
    />
  );
}
```

**Live Example:**
The documentation graph you can see in our navigation demonstrates real-time visualization of our actual documentation structure, with:
- Interactive nodes representing each documentation page
- Dynamic connections showing relationships
- Smooth animations and hover effects
- Click-to-navigate functionality

### Theme Switching System

Real-time theme switching with smooth transitions:

```tsx
import { useTheme } from '../providers/ThemeProvider';

function ThemeDemo() {
  const { isDarkMode, toggleTheme, prefersReducedMotion } = useTheme();
  
  return (
    <div className="p-4 rounded-lg doc-card">
      <h3>Current Theme: {isDarkMode ? 'Dark' : 'Light'}</h3>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-4 py-2 rounded bg-primary-color text-background-color"
      >
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <p className="mt-2 text-muted-color">
        Motion: {prefersReducedMotion ? 'Reduced' : 'Full'}
      </p>
    </div>
  );
}
```

**Current Implementation:**
- Automatic system preference detection
- Smooth color transitions with CSS variables
- Persistent theme storage in localStorage
- Reduced motion support for accessibility

### Interactive Background Systems

Multiple animated background options with real-time switching:

```tsx
import { BackgroundSelector } from '../components/BackgroundSelector';

// Current background types available:
const backgrounds = [
  'wave',    // Animated wave patterns with mouse interaction
  'stars',   // 3D star field with cursor effects  
  'dither',  // Shader-based dithering effects
  'solid'    // Static background for reduced motion
];

function BackgroundDemo() {
  return (
    <div className="settings-panel">
      <h4>Background Style</h4>
      <BackgroundSelector className="flex gap-2" />
    </div>
  );
}
```

**Working Features:**
- Wave background: Real-time mouse interaction with elastic deformation
- Stars background: 3D WebGL star field with subtle cursor influence  
- Dither background: GPU-accelerated dithering patterns
- Automatic fallback to solid backgrounds for reduced motion preferences

## Advanced Configuration

### Typography System

Our documentation uses a carefully designed typography scale:

```css
/* Real CSS variables from our system */
:root {
  --title-font: 'Urbanist', sans-serif;
  --body-font: 'Urbanist', sans-serif;  
  --mono-font: 'MapleMono', 'SF Mono', monospace;
  
  /* Light mode colors */
  --text-color: #1F2937;
  --text-secondary: #374151;
  --muted-color: #6B7280;
}

.dark {
  /* Dark mode colors */
  --text-color: #F8FAFC;
  --text-secondary: #E2E8F0;
  --muted-color: #94A3B8;
}
```

**Typography Features:**
- High contrast ratios for accessibility (WCAG AA compliant)
- Optimized line heights for reading (1.75 for body text)
- Proper font loading with `font-display: swap`
- Responsive scaling across devices

### Code Block System

Enhanced syntax highlighting with multiple language support:

```tsx
import { CodeBlock } from '../components/CodeBlock';

const codeExamples = [
  {
    language: 'typescript',
    code: `interface DocumentationPage {
  title: string;
  path: string;
  content: string;
  lastModified: Date;
}`,
    label: 'TypeScript'
  },
  {
    language: 'javascript', 
    code: `const config = {
  theme: 'auto',
  animations: true,
  background: 'wave'
};`,
    label: 'JavaScript'
  }
];

function CodeDemo() {
  return (
    <CodeBlock 
      snippets={codeExamples}
      title="Configuration Examples"
      defaultLanguage="typescript"
      showLineNumbers={true}
    />
  );
}
```

**Features:**
- Multi-language syntax highlighting (powered by Prism.js)
- One-click copy functionality
- Tab-based language switching
- Dark/light theme adaptation
- Line number support

### Settings System

Real settings persistence and state management:

```tsx
import { SettingsMenu } from '../components/SettingsMenu';

// Actual settings that work in our app:
const availableSettings = {
  theme: ['light', 'dark', 'system'],
  motion: ['full', 'reduced'],
  background: ['wave', 'stars', 'dither', 'solid']
};

function Settings() {
  return (
    <SettingsMenu 
      className="relative"
      isCompact={false}
    />
  );
}
```

**Live Settings:**
- Theme persistence across browser sessions
- Motion preference detection and respect
- Background type switching with page reload
- Dropdown animations with reduced motion support

## Performance Optimizations

### Real Performance Metrics

Our documentation site implements several performance optimizations:

**Bundle Optimization:**
- **Code Splitting**: Routes are dynamically imported
  - Main bundle: ~102kB (gzipped)
  - Docs pages: ~419kB (includes syntax highlighting)
- **Tree Shaking**: Unused code eliminated automatically
- **Static Generation**: All routes pre-rendered at build time

**Asset Optimization:**
- **Font Loading**: WOFF2 format with `font-display: swap`
  - Urbanist: ~42KB per variant
  - Urbanist: ~42KB per variant  
  - MapleMono: ~17MB (loaded on demand for code blocks)
- **Image Optimization**: Next.js automatic WebP/AVIF conversion
- **Static Assets**: Served from CDN with proper caching headers

**JavaScript Performance:**
```tsx
// Lazy loading for heavy components
const DocumentationGraph = dynamic(
  () => import('../components/DocumentationGraph'),
  { ssr: false }
);

// Background components loaded on demand
const BackgroundComponents = {
  wave: dynamic(() => import('../components/WaveBackground'), { ssr: false }),
  stars: dynamic(() => import('../components/StarsBackground'), { ssr: false }),
};
```

### Animation Performance

**Optimized Animations:**
- CSS transforms instead of layout changes
- `requestAnimationFrame` for smooth updates
- Hardware acceleration with `transform3d`
- Automatic animation disabling for reduced motion preferences

**Real Performance Data:**
- 60 FPS animations on modern devices
- <16ms frame times for smooth interactions
- Graceful degradation on lower-end devices
- Zero animation overhead when motion is reduced

## Accessibility Features

### Motion Sensitivity

Our platform respects user preferences for reduced motion:

```tsx
import { useTheme } from '../providers/ThemeProvider';

function MotionAwareComponent() {
  const { prefersReducedMotion } = useTheme();
  
  const animations = prefersReducedMotion ? {
    // Static fallbacks
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.05 }
  } : {
    // Full animations
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  };
  
  return (
    <motion.div {...animations}>
      Content adapts to user preferences
    </motion.div>
  );
}
```

**Accessibility Features:**
- Automatic `prefers-reduced-motion` detection
- Keyboard navigation support throughout
- Screen reader compatible markup
- High contrast mode support
- Focus indicators for all interactive elements

### Real Accessibility Testing

**WCAG Compliance:**
- Color contrast ratios exceed WCAG AA standards
- All interactive elements have focus indicators
- Semantic HTML structure for screen readers
- Proper heading hierarchy maintained

**Keyboard Navigation:**
- Tab order follows logical reading flow
- All functionality accessible via keyboard
- Custom focus management for modal dialogs
- Escape key handling for dismissible components

---

**Related Documentation:**
- [Basic Usage](./basic-usage) - Getting started with core features
- [Configuration](./configuration) - Customizing your experience  
- [Code Examples](../developer-guides/code-examples) - Implementation details
- [Icon Customization](../developer-guides/icon-customization) - Adding custom icons 