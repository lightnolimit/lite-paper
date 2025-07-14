# Contributing

Thank you for your interest in contributing to the documentation system! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Setup

1. **Fork the repository**
2. **Clone your fork**:

   ```bash
   git clone https://github.com/your-username/docs-template.git
   cd docs-template
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Open** http://localhost:3000

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-search-functionality`
- `fix/mobile-navigation-bug`
- `docs/update-api-reference`
- `refactor/simplify-theme-provider`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(mindmap): add search functionality to documentation graph

fix(mobile): resolve sidebar close button positioning issue

docs(api): update endpoints documentation with new parameters
```

## Code Standards

### TypeScript

- Use strict type checking
- Prefer interfaces over types for object shapes
- Include JSDoc comments for public APIs

```typescript
/**
 * Configuration for the documentation graph component
 */
interface GraphConfig {
  /** Maximum number of nodes to display */
  maxNodes: number;
  /** Enable search functionality */
  enableSearch: boolean;
}
```

### React Components

- Use functional components with hooks
- Memoize expensive operations
- Follow the single responsibility principle

```typescript
import React, { memo, useMemo } from 'react'

interface Props {
  data: GraphData
  onNodeClick: (id: string) => void
}

export const DocumentationGraph = memo<Props>(({ data, onNodeClick }) => {
  const processedNodes = useMemo(() => {
    return data.nodes.map(processNode)
  }, [data.nodes])

  return (
    <svg>
      {processedNodes.map(node => (
        <Node key={node.id} data={node} onClick={onNodeClick} />
      ))}
    </svg>
  )
})
```

### CSS/Styling

- Use CSS custom properties for theming
- Follow BEM methodology for class names
- Ensure responsive design

```css
.documentation-graph {
  --graph-primary: var(--primary-color);
  --graph-background: var(--background-color);
}

.documentation-graph__node {
  fill: var(--graph-primary);
  transition: fill 0.2s ease;
}

.documentation-graph__node--active {
  fill: var(--accent-color);
}
```

## Testing

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Writing Tests

Write tests for:

- Component behavior
- User interactions
- Edge cases
- Accessibility features

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { DocumentationGraph } from '../DocumentationGraph'

describe('DocumentationGraph', () => {
  const mockData = {
    nodes: [
      { id: '1', title: 'Introduction', x: 0, y: 0 }
    ]
  }

  test('renders nodes correctly', () => {
    render(
      <DocumentationGraph
        data={mockData}
        onNodeClick={jest.fn()}
      />
    )

    expect(screen.getByText('Introduction')).toBeInTheDocument()
  })

  test('calls onNodeClick when node is clicked', () => {
    const handleClick = jest.fn()

    render(
      <DocumentationGraph
        data={mockData}
        onNodeClick={handleClick}
      />
    )

    fireEvent.click(screen.getByText('Introduction'))
    expect(handleClick).toHaveBeenCalledWith('1')
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for all public functions and components
- Include usage examples
- Document complex algorithms

### Content Documentation

- Use clear, concise language
- Include code examples
- Add screenshots when helpful
- Keep content up to date

### API Documentation

Document all public APIs:

````typescript
/**
 * Theme provider for the documentation system
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Implementation
}
````

## Accessibility

### Requirements

All contributions must:

- Support keyboard navigation
- Include proper ARIA labels
- Respect motion preferences
- Meet WCAG 2.1 AA standards

### Testing Accessibility

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Run accessibility tests
npm run test:a11y
```

### Common Patterns

```typescript
// Keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Action
</button>

// Screen reader support
<div
  role="region"
  aria-labelledby="section-title"
  aria-describedby="section-description"
>
  <h2 id="section-title">Section Title</h2>
  <p id="section-description">Description for screen readers</p>
</div>
```

## Performance

### Guidelines

- Use React.memo for expensive components
- Implement proper code splitting
- Optimize images and assets
- Monitor Core Web Vitals

### Profiling

```bash
# Build analysis
npm run analyze

# Performance testing
npm run lighthouse
```

## Pull Request Process

### Before Submitting

1. **Run all tests**: `npm run test:all`
2. **Check linting**: `npm run lint`
3. **Type check**: `npm run type-check`
4. **Build successfully**: `npm run build`
5. **Test accessibility**: `npm run test:a11y`

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing

- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots/GIFs

If applicable, add screenshots or GIFs

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings/errors
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Accessibility review** if UI changes
4. **Performance review** for significant changes

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should have happened

## Actual Behavior

What actually happened

## Environment

- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 110]
- Node.js: [e.g., 18.12.0]
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description

Clear description of the feature

## Use Case

Why is this feature needed?

## Proposed Solution

How would you implement this?

## Alternatives Considered

Any alternative solutions?

## Additional Context

Screenshots, mockups, etc.
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Update documentation
5. Deploy to production

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and general discussion
- **PR Reviews**: Code-specific feedback

## Getting Help

### Resources

- **Documentation**: `/docs`
- **Examples**: `/examples`
- **API Reference**: `/docs/api-reference`

### Contact

- **Issues**: GitHub Issues
- **Questions**: GitHub Discussions
- **Security**: security@your-domain.com

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:turbo        # Start with turbo mode

# Testing
npm run test             # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:e2e         # E2E tests

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript check
npm run format           # Format code

# Build
npm run build            # Production build
npm run analyze          # Bundle analysis
npm run lighthouse       # Performance audit
```

### Debug Mode

Enable debug features:

```bash
# Environment variable
DEBUG=true npm run dev

# Or in browser console
localStorage.setItem('debugMode', 'true')
```

### Hot Reloading

For instant feedback during development:

- Component changes reload automatically
- CSS changes apply without refresh
- Content changes update in real-time

## Architecture Decisions

### Technology Choices

- **Next.js 13+**: App Router for better developer experience
- **TypeScript**: Type safety and better tooling
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling
- **React Testing Library**: Component testing

### Folder Structure

```
project/
├── app/                 # Next.js app directory
│   ├── components/      # Reusable components
│   ├── docs/           # Documentation pages
│   ├── providers/      # Context providers
│   └── globals.css     # Global styles
├── public/             # Static assets
├── tests/              # Test files
└── docs/               # Project documentation
```

## Future Roadmap

### Planned Features

- [ ] Full-text search with fuzzy matching
- [ ] Dark/light theme auto-switching
- [ ] PDF export functionality
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Comment system
- [ ] Version history

### Long-term Goals

- Improved performance
- Better accessibility
- Enhanced mobile experience
- Plugin system
- Advanced theming

Thank you for contributing to make documentation better for everyone! 🚀
