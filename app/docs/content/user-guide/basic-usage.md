# Basic Usage

Learn the fundamentals of using our project.

## Core Concepts

Understanding these concepts will help you get the most out of our tool:

- **Projects**: Your main workspace
- **Components**: Reusable building blocks  
- **Templates**: Pre-built configurations
- **Plugins**: Extended functionality

## Getting Started

1. **Create your first project**
   ```bash
   npm run create-project my-project
   ```

2. **Navigate to your project**
   ```bash
   cd my-project
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## Basic Operations

### Creating Components

```javascript
// Example component
import { Component } from 'our-framework';

export default function MyComponent() {
  return <div>Hello World!</div>;
}
```

### Configuration

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "config": {
    "theme": "default",
    "plugins": ["essential", "advanced"]
  }
}
```

## Common Workflows

- **Development**: Edit → Save → Preview
- **Testing**: Write → Run → Debug
- **Deployment**: Build → Test → Deploy

---

*Next: [Advanced Features](./advanced-features)* 