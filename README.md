# Project Documentation Site

A modern documentation site built with Next.js, inspired by the design of nyko.cool. This project provides a clean, responsive interface for documentation with features like:

- Interactive background animations (waves or stars) using Three.js
- File tree navigation for documentation structure
- Responsive design for all devices
- Dark mode with beautiful animations

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-docs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Environment Variables

This project uses environment variables to configure certain features:

| Variable | Options | Default | Description |
|----------|---------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | URL string | `https://phantasy-docs.example.com` | The base URL of the site used for metadata and SEO |
| `NEXT_PUBLIC_BACKGROUND_TYPE` | `wave`, `stars` | `wave` | Sets the background animation type |
| `NEXT_PUBLIC_DEBUG_CURSOR` | `true`, `false` | `false` | Shows a cursor indicator on the wave animation for debugging |
| `NEXT_PUBLIC_DEBUG_LOGGING` | `true`, `false` | `false` | Enables additional console logging for debugging |

You can set these variables using a `.env.local` file in the project root:

```
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
NEXT_PUBLIC_BACKGROUND_TYPE=stars
NEXT_PUBLIC_DEBUG_CURSOR=true
```

## Developer Utilities

### Debug Mode

This project includes built-in debugging tools:

- To toggle the cursor visibility for the wave animation, set `NEXT_PUBLIC_DEBUG_CURSOR=true` in your `.env.local` file or use `localStorage.setItem('debugCursor', 'true')` in your browser console.
- You can also toggle it dynamically by running `window.toggleDebugCursor()` in your browser console.
- For additional debug logging, set `NEXT_PUBLIC_DEBUG_LOGGING=true` in your environment variables.

### Debugging Wave Animation

The wave animation includes a cursor indicator (hidden by default) that helps visualize where the hover effect is being triggered. When visible, it appears as a small colored sphere that follows your mouse movements.

## Project Structure

- `/app`: Next.js app router pages and components
- `/app/components`: Reusable UI components
- `/app/data`: Documentation content and structure
- `/app/docs/[[...slug]]`: Dynamic routes for documentation pages
- `/public`: Static assets

## Documentation Structure

The documentation is structured as a file tree with nested categories and documents in markdown format. The structure is defined in `/app/data/documentation.ts`.

To edit or add new documentation:

1. Add your markdown content to the `documentationContent` object in `/app/data/documentation.ts`
2. Update the file tree structure in the `documentationTree` array if needed

## Features

- **Interactive Backgrounds**:
  - Wave animation: Interactive curved line grid that responds to cursor movements
  - Star animation: Interactive star field with subtle movement and cursor reactivity
- **Dynamic Navigation**: File tree structure with expandable sections
- **Markdown Rendering**: Built-in markdown parsing for documentation
- **Responsive Design**: Mobile-friendly layout
- **Client-side Navigation**: Fast page transitions with client-side routing
- **Smooth Animations**: Using Framer Motion for smooth UI transitions
- **SEO Optimized**: Complete metadata configuration for search engines
- **Production-Ready**: Performance optimized with proper caching headers
- **PWA Support**: Web app manifest and icons for installation

## Customization

### Theme Colors

The main colors are defined in `/app/globals.css`:

```css
:root {
  --primary-color: #8a56ff;
  --secondary-color: #61dafb;
}
```

### Documentation Content

Edit the markdown content in the `documentationContent` object in `/app/data/documentation.ts`.

### SEO Configuration

The project includes comprehensive SEO configuration in the `/app/layout.tsx` file. Key SEO features include:

- Complete OpenGraph metadata for social sharing
- Twitter card support
- Structured JSON-LD data
- Robots.txt and sitemap.xml generation
- Appropriate meta tags for search engines

### Favicons

The project includes a complete set of favicons and app icons in the `/public/favicon/` directory:

- favicon.ico - Browser tab icon (16x16, 32x32)
- favicon-16x16.png - 16x16 PNG icon
- favicon-32x32.png - 32x32 PNG icon
- apple-touch-icon.png - 180x180 icon for iOS devices
- android-chrome-192x192.png - 192x192 icon for Android devices
- android-chrome-512x512.png - 512x512 icon for Android devices
- site.webmanifest - Web app manifest for PWA support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by [nyko.cool](https://www.nyko.cool/)
- Built with [Next.js](https://nextjs.org/)
- 3D rendering with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
