# Design Language Guide

This document outlines the design language and component styling for the Phantasy documentation system. Following these guidelines ensures consistency across all documentation pages.

## Typography

Our documentation uses a dual-font system:
- **Headings**: Yeezy T-Star (var(--title-font))
- **Body**: Urbanist (var(--body-font))
- **Monospace/Code**: VCR OSD Mono (var(--mono-font))

### Heading Styles

Headings use the Yeezy T-Star font family and follow a clear hierarchy:

<h1 style="font-family: var(--title-font); font-size: 2.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;">H1: Document Title</h1>

<h2 style="font-family: var(--title-font); font-size: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-soft); padding-bottom: 0.3rem;">H2: Section Title</h2>

<h3 style="font-family: var(--title-font); font-size: 1.5rem; margin-bottom: 1rem;">H3: Subsection Title</h3>

<h4 style="font-family: var(--title-font); font-size: 1.25rem; margin-bottom: 0.75rem;">H4: Group Title</h4>

<h5 style="font-family: var(--title-font); font-size: 1.1rem; margin-bottom: 0.5rem;">H5: Item Title</h5>

<h6 style="font-family: var(--title-font); font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">H6: Special Notes</h6>

### Body Text

Body text uses the Urbanist font family with optimized readability:

<p style="font-family: var(--body-font); margin-bottom: 1rem; line-height: 1.6;">This is a regular paragraph of text. It demonstrates the standard styling for body content in the documentation. The text has proper line height and spacing to ensure readability.</p>

### Links

Links use the primary color with hover effects:

<a href="#" style="color: var(--primary-color); text-decoration: none; transition: all 0.2s ease;">This is a standard link</a>

On hover, links will show an underline and slight opacity change.

## Lists

### Unordered Lists

<ul style="margin-bottom: 1rem; padding-left: 1.5rem;">
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">First item in an unordered list</li>
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">Second item in an unordered list</li>
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">Third item with a <a href="#" style="color: var(--primary-color); text-decoration: none;">link</a> inside it</li>
</ul>

### Ordered Lists

<ol style="margin-bottom: 1rem; padding-left: 1.5rem;">
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">First step in a process</li>
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">Second step in a process</li>
  <li style="margin-bottom: 0.25rem; font-family: var(--body-font);">Third step with a <a href="#" style="color: var(--primary-color); text-decoration: none;">link</a> inside it</li>
</ol>

## Blockquotes

Blockquotes are styled with a left border in the primary color:

<blockquote style="border-left: 4px solid var(--primary-color); padding-left: 1rem; margin: 0 0 1rem 0; color: var(--muted-color); font-style: italic;">
This is a blockquote. It can be used to highlight important quotes or to set apart a section of text that needs emphasis.
</blockquote>

## Code Blocks

Code blocks use the VCR OSD Mono font with proper syntax highlighting:

```javascript
// This is a code block
function example() {
  const message = "Hello, world!";
  console.log(message);
  return message;
}
```

Inline code uses the same monospace font: `const variable = "value";`

## Tables

Tables are styled for readability with borders:

<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-family: var(--body-font);">
  <thead>
    <tr>
      <th style="border: 1px solid var(--border-color); padding: 0.5rem; background-color: rgba(0, 0, 0, 0.05); font-weight: bold; text-align: left;">Header 1</th>
      <th style="border: 1px solid var(--border-color); padding: 0.5rem; background-color: rgba(0, 0, 0, 0.05); font-weight: bold; text-align: left;">Header 2</th>
      <th style="border: 1px solid var(--border-color); padding: 0.5rem; background-color: rgba(0, 0, 0, 0.05); font-weight: bold; text-align: left;">Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 1, Cell 1</td>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 1, Cell 2</td>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 1, Cell 3</td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 2, Cell 1</td>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 2, Cell 2</td>
      <td style="border: 1px solid var(--border-color); padding: 0.5rem;">Row 2, Cell 3</td>
    </tr>
  </tbody>
</table>

## Notifications

For important information, we provide styled notification components:

<div class="notification notification-info">
This is an info notification that provides useful information.
</div>

<div class="notification notification-warning">
This is a warning notification that highlights potential issues.
</div>

<div class="notification notification-error">
This is an error notification that highlights critical problems.
</div>

<div class="notification notification-success">
This is a success notification that confirms a positive outcome.
</div>

## Horizontal Rules

Horizontal rules provide visual separation between sections:

<hr style="margin: 2rem 0; border: 0; border-top: 1px solid var(--border-color);">

## Custom Components

### Profile Info

For profile information, use the flex layout structure:

```html
<div style="display: flex; margin-bottom: 8px;">
  <div style="font-weight: bold; min-width: 140px;">Label:</div>
  <div>Value</div>
</div>
```

### Social Media Links

For social media links, use the following structure:

```html
<div style="display: flex; align-items: center; margin: 5px 0;">
  <img src="/assets/icons/pixel-instagram.svg" alt="Instagram" style="height: 20px; width: auto; margin-right: 10px;" />
  <a href="https://instagram.com/username" style="color: var(--primary-color); text-decoration: none;" target="_blank">@username</a>
</div>
```

## CSS Variables

Our design system relies on CSS variables for consistent theming across light and dark modes:

| Variable | Purpose | Light Mode | Dark Mode |
|----------|---------|------------|-----------|
| `--primary-color` | Primary accent color | #678D58 | #FF85A1 |
| `--secondary-color` | Secondary accent | #A3C9A8 | #FFC4DD |
| `--text-color` | Main text color | #2E3A23 | #F0F0F5 |
| `--background-color` | Page background | #F3F5F0 | #0F0F12 |
| `--card-color` | Card background | #FFFFFF | #1A1A1F |
| `--border-color` | Main borders | #222 | #bbb |
| `--border-soft` | Subtle borders | #f2f2f2 | #23232a |
| `--muted-color` | Secondary text | #6E7D61 | #9C9CAF |

## Implementation Notes

When writing documentation:

1. Use the appropriate heading level for document structure
2. Maintain consistent spacing between elements
3. Use notifications sparingly and only when necessary
4. When embedding HTML, follow the patterns in this guide
5. Keep code examples short and focused

For technical implementation details on using these components in your markdown, refer to the [Code Examples](./code-examples) guide. 