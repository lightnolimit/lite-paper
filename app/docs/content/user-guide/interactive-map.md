# Interactive Map Guide

The Interactive Map provides a visual representation of the documentation structure, allowing you to navigate and explore content relationships intuitively.

## Overview

The Interactive Map is a force-directed graph visualization that displays all documentation pages as nodes, with connections representing the folder structure and relationships between documents.

## Features

### Visual Navigation

- **Click any node** to navigate directly to that documentation page
- **Hover over nodes** to see the full page title
- **Zoom and pan** using mouse wheel or touch gestures
- **Drag nodes** to rearrange the layout temporarily

### Node Types

- **Folder nodes**: Larger circles representing document categories
- **Document nodes**: Smaller circles representing individual pages
- **Active node**: Highlighted in primary color showing your current location

### Connections

- **Solid lines**: Connect documents within the same folder structure
- **Line thickness**: Varies based on the hierarchical relationship

## Controls

### Mouse Controls

- **Click**: Navigate to page
- **Drag**: Pan the view
- **Scroll**: Zoom in/out
- **Drag node**: Reposition temporarily

### Touch Controls (Mobile)

- **Tap**: Navigate to page
- **Pinch**: Zoom in/out
- **Drag**: Pan the view

## Understanding the Layout

The map uses a force-directed layout algorithm that:

- Groups related documents closer together
- Maintains comfortable spacing between nodes
- Allows the graph to self-organize based on connections

### Visual Indicators

- **Node size**: Indicates hierarchy level (folders are larger)
- **Node color**: Follows your theme preference
- **Active highlight**: Shows your current location
- **Hover effects**: Reveals additional information

## Tips for Effective Use

1. **Quick Navigation**: Use the map when you want to jump between different sections quickly
2. **Explore Relationships**: Discover related content by following connections
3. **Get Overview**: Zoom out to see the entire documentation structure
4. **Find Your Location**: The highlighted node always shows where you are

## Customization

The Interactive Map respects your theme settings:

- Light mode: Matcha green color scheme
- Dark mode: Sakura pink color scheme

## Performance

The map is optimized for smooth interaction:

- Efficient rendering using React Three Fiber
- Responsive to window resizing
- Minimal resource usage when idle

## Future Enhancements

We're planning to add:

- **Tag-based connections**: Show relationships between documents with similar tags
- **Search integration**: Highlight search results on the map
- **Custom layouts**: Different visualization modes
- **Filters**: Show/hide specific categories

---

The Interactive Map transforms documentation browsing from linear navigation to spatial exploration, making it easier to understand the overall structure and find what you need quickly.
