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
| `NEXT_PUBLIC_BACKGROUND_TYPE` | `wave`, `stars` | `wave` | Sets the background animation type |

You can set these variables using a `.env.local` file in the project root:

```
NEXT_PUBLIC_BACKGROUND_TYPE=stars
```

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by [nyko.cool](https://www.nyko.cool/)
- Built with [Next.js](https://nextjs.org/)
- 3D rendering with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
