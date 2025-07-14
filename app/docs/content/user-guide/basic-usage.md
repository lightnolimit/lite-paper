# Basic Usage

Learn how to create and manage content in your documentation site template. This guide covers the essential tasks you'll need to get your documentation up and running.

## Content Management

### Understanding the Structure

Your documentation site uses a **hierarchical structure** defined in `app/data/documentation.ts`:

```typescript
export const documentationTree: FileItem[] = [
  {
    type: 'directory', // Section folder
    name: 'Getting Started', // Display name
    path: 'getting-started', // URL path
    children: [
      // Files in this section
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'getting-started/introduction',
      },
    ],
  },
];
```

### Creating New Content

#### 1. Add a New Section

To add a new documentation section:

```typescript
// In app/data/documentation.ts
{
  type: 'directory',
  name: 'Your New Section',
  path: 'your-new-section',
  children: [
    {
      type: 'file',
      name: 'Overview.md',
      path: 'your-new-section/overview'
    }
  ]
}
```

#### 2. Create the Content File

Create the corresponding markdown file:

```bash
# Create the directory
mkdir -p app/docs/content/your-new-section

# Create the markdown file
touch app/docs/content/your-new-section/overview.md
```

#### 3. Write Your Content

```markdown
# Overview

Welcome to your new section! You can use:

- **Headers** for structure
- **Lists** for organization
- **Code blocks** for examples
- **Links** to other pages
- **Images** and media

## Subsection

Your content here...
```

### Content File Locations

All content files are stored in `app/docs/content/` with paths matching your configuration:

```
app/docs/content/
├── getting-started/
│   ├── introduction.md
│   ├── quick-start.md
│   └── installation.md
├── user-guide/
│   ├── basic-usage.md
│   ├── advanced-features.md
│   └── configuration.md
└── your-new-section/
    └── overview.md
```

## Navigation Features

### File Tree Sidebar

The left sidebar shows your documentation structure:

- **📁 Directories** - Expandable sections
- **📄 Files** - Individual pages
- **🎯 Current Page** - Highlighted in the tree
- **🔍 Search** - Type to filter content

### Interactive Mindmap

The **Documentation Map** at the bottom of the sidebar:

- **Visual Navigation** - See page relationships
- **Node Colors** - Files (purple) vs directories (blue)
- **Current Page** - Highlighted with pulsing border
- **Click to Navigate** - Click any node to jump to that page
- **Connected Pages** - Shows related content links

### Breadcrumb Navigation

At the top of each page:

- Shows your current location
- Click any segment to navigate up
- Automatically generated from file structure

## Writing Content

### Markdown Syntax

Your content supports full Markdown syntax:

````markdown
# H1 Header

## H2 Header

### H3 Header

**Bold text** and _italic text_

- Unordered lists

1. Ordered lists

`inline code` and code blocks:

```javascript
function example() {
  return 'Hello, world!';
}
```
````

[Links](./other-page) to other pages

![Images](./image.png) with alt text

````

### Code Blocks with Syntax Highlighting

Support for multiple languages:

```typescript
// TypeScript
interface User {
  name: string;
  email: string;
}
````

```bash
# Bash commands
npm install
npm run dev
```

```css
/* CSS styling */
.my-class {
  color: blue;
  font-size: 16px;
}
```

### Linking Between Pages

Use relative paths to link between documentation pages:

```markdown
<!-- Link to other pages -->

[Installation Guide](./installation)
[User Guide](../user-guide/basic-usage)
[API Reference](../../api-reference/overview)

<!-- Link to sections within a page -->

[Go to Content Management](#content-management)
```

### Adding Images

Store images in the `public/assets/` directory:

```markdown
![Documentation Screenshot](/assets/images/screenshot.png)
![Diagram](/assets/diagrams/flow-chart.svg)
```

## Customization

### Theme and Styling

#### Color Scheme

Modify colors in `app/globals.css`:

```css
:root {
  --primary-color: #3b82f6; /* Blue */
  --secondary-color: #64748b; /* Gray */
  --accent-color: #10b981; /* Green */
}

[data-theme='dark'] {
  --primary-color: #60a5fa; /* Lighter blue for dark mode */
}
```

#### Typography

Change fonts and text styling:

```css
:root {
  --font-family: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-size-base: 16px;
  --line-height: 1.6;
}
```

### Background Animations

Toggle between different background effects in the settings menu:

- **Wave** - Animated wave patterns
- **Geometric** - Moving geometric shapes
- **Particles** - Floating particle system
- **Grid** - Animated grid overlay
- **None** - Solid color background

### Mobile Responsiveness

The template is fully responsive:

- **Mobile-first design**
- **Collapsible sidebar** on small screens
- **Touch-friendly navigation**
- **Optimized fonts and spacing**

## Content Organization Tips

### Best Practices

1. **Logical Hierarchy**

   ```
   Getting Started → User Guide → Advanced Features → API Reference
   ```

2. **Clear Naming**
   - Use descriptive section names
   - Keep file names concise but clear
   - Use kebab-case for paths

3. **Cross-references**
   - Link related topics together
   - Create "See also" sections
   - Use the mindmap to visualize connections

4. **Progressive Disclosure**
   - Start with basics in "Getting Started"
   - Build complexity gradually
   - Reference advanced topics from basics

### Content Templates

#### New Feature Documentation

```markdown
# Feature Name

Brief description of what this feature does.

## When to Use

Explain the use cases and scenarios.

## How to Use

Step-by-step instructions.

## Examples

Practical examples with code.

## Troubleshooting

Common issues and solutions.

## Related Topics

- [Link to related feature](./related)
- [Link to API reference](../api/endpoint)
```

#### Tutorial Template

```markdown
# Tutorial: Doing Something

What you'll learn and accomplish.

## Prerequisites

What readers need before starting.

## Step-by-Step Guide

### Step 1: Setup

Instructions...

### Step 2: Implementation

Code examples...

### Step 3: Testing

Verification steps...

## Next Steps

Where to go from here.
```

## Publishing Workflow

### Local Development

```bash
# Make your changes
npm run dev

# Test your content
# Preview in browser at localhost:3000

# Check for build errors
npm run build
```

### Version Control

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add new user guide section"

# Push to repository
git push origin main
```

### Automatic Deployment

If connected to Cloudflare Pages:

1. Push changes to your main branch
2. Cloudflare automatically builds and deploys
3. Changes are live in 2-5 minutes

## Troubleshooting

### Common Issues

**Page not showing in navigation**

- Check that the file path matches the configuration in `documentation.ts`
- Ensure the markdown file exists in the correct directory

**Broken links**

- Use relative paths: `./page` or `../section/page`
- Check spelling and case sensitivity

**Images not loading**

- Store images in `public/assets/`
- Use absolute paths: `/assets/images/photo.jpg`

**Mindmap not showing connections**

- Connections are automatically generated based on folder structure
- Add manual connections by linking between pages

### Getting Help

- Check the [Configuration Guide](./configuration) for advanced setup
- Review [Troubleshooting](./troubleshooting) for specific issues
- Explore [Code Examples](../developer-guides/code-examples) for customization

Your documentation site is now ready to use! Start adding your content and customizing the design to match your needs.
