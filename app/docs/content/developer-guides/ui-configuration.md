# UI Configuration Guide

This documentation site includes configurable UI features that can be easily customized by users who fork the project. All UI configuration is centralized in the `app/config/ui.ts` file.

## Mobile File Tree Toggle

### Overview

The mobile file tree toggle is a floating action button that appears on mobile devices to provide quick access to the documentation sidebar. This feature can be enabled or disabled based on your preferences.

### Configuration

To configure the mobile file tree toggle, edit the `app/config/ui.ts` file:

```typescript
export const uiConfig: UIConfig = {
  // Enable or disable the floating mobile toggle button
  showMobileFileTreeToggle: false, // Change to true to enable

  // Position the toggle button
  mobileTogglePosition: 'bottom-left', // Options: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
};
```

### Available Options

#### `showMobileFileTreeToggle`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Controls whether the floating mobile toggle button is visible on mobile devices

**When enabled (`true`)**:

- Shows a floating action button on mobile screens
- Button appears when the sidebar is hidden
- Provides quick access to the file tree

**When disabled (`false`)**:

- No floating button appears
- Users can still access the file tree via the navigation menu
- Cleaner mobile interface

#### `mobileTogglePosition`

- **Type**: `'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'`
- **Default**: `'bottom-left'`
- **Description**: Controls the position of the floating toggle button

**Position Options**:

- `'bottom-left'`: Bottom-left corner of the screen
- `'bottom-right'`: Bottom-right corner of the screen
- `'top-left'`: Top-left corner of the screen
- `'top-right'`: Top-right corner of the screen

### Usage Examples

#### Example 1: Enable with Bottom-Right Position

```typescript
export const uiConfig: UIConfig = {
  showMobileFileTreeToggle: true,
  mobileTogglePosition: 'bottom-right',
};
```

#### Example 2: Disable (Default)

```typescript
export const uiConfig: UIConfig = {
  showMobileFileTreeToggle: false,
  mobileTogglePosition: 'bottom-left', // Position doesn't matter when disabled
};
```

### Alternative Access Methods

When the mobile toggle is disabled, users can still access the file tree through:

1. **Navigation Menu**: Tap the hamburger menu (☰) in the top-right corner, then select "Show Documentation Tree"
2. **Desktop View**: The sidebar is always visible on desktop screens

### Implementation Details

The mobile toggle system uses:

- **Responsive Design**: Only appears on mobile screens (`< 768px width`)
- **State Management**: Automatically hides when sidebar is open
- **Accessibility**: Includes proper ARIA labels and keyboard navigation
- **Smooth Animations**: Uses Framer Motion for polished interactions
- **Theme Integration**: Adapts to light/dark mode automatically

### Why It's Disabled by Default

The mobile file tree toggle is disabled by default because:

1. **Clean Interface**: Provides a cleaner mobile experience without floating elements
2. **Alternative Access**: Users can access the file tree via the navigation menu
3. **Customizable**: Projects can easily enable it if needed for their specific use case
4. **Reduced Clutter**: Avoids visual competition with other floating elements

### Customization Tips

- **Brand Consistency**: Consider your brand's design language when choosing the position
- **User Flow**: Place the button where it won't interfere with content interaction
- **Testing**: Test on various mobile devices to ensure the position works well
- **Analytics**: If you have analytics, monitor usage to optimize placement

## File Structure

```
app/
├── config/
│   └── ui.ts                    # UI configuration file
├── docs/
│   └── components/
│       └── DocumentationPage.tsx # Uses the configuration
└── docs/
    └── content/
        └── developer-guides/
            └── ui-configuration.md # This file
```

## Future Enhancements

The UI configuration system is designed to be extensible. Future configuration options might include:

- Sidebar width preferences
- Default theme selection
- Animation preferences
- Content layout options
- Search behavior settings

To request new configuration options, please open an issue in the project repository.
