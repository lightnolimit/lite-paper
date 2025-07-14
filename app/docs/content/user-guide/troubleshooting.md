# Troubleshooting

Common issues and solutions for your documentation site.

## Build Issues

### Static Export Errors

If you encounter errors during static export:

```bash
# Clear build cache
rm -rf .next
npm run build
```

**Common solutions:**

- Check for dynamic imports that need `ssr: false`
- Verify all paths in `generateStaticParams` are valid
- Ensure no server-side only code in client components

### Font Loading Issues

If custom fonts aren't loading:

1. **Check font paths** in `globals.css`
2. **Verify font files** exist in `public/fonts/`
3. **Add proper font-display** values for performance

```css
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/your-font.woff2') format('woff2');
  font-display: swap; /* Important for performance */
}
```

## Performance Issues

### Slow Page Loading

If pages load slowly:

1. **Optimize images** - Use Next.js Image component
2. **Reduce bundle size** - Check for unused imports
3. **Enable compression** in your hosting provider

### Animation Performance

If animations are choppy:

1. **Use CSS transforms** instead of changing layout properties
2. **Enable hardware acceleration** with `transform3d(0,0,0)`
3. **Respect reduced motion** preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Content Issues

### Markdown Not Rendering

If markdown content isn't displaying:

1. **Check file extensions** - Should be `.md`
2. **Verify frontmatter** format
3. **Check for syntax errors** in markdown

### Search Not Working

If the documentation search isn't functioning:

1. **Verify search index** is being built
2. **Check for JavaScript errors** in browser console
3. **Ensure search component** is properly imported

## Deployment Issues

### Cloudflare Pages

Common Cloudflare deployment issues:

```bash
# Build command
npm run build

# Output directory
out
```

**Environment variables:**

- `NODE_VERSION=18`
- `NPM_VERSION=8`

### Vercel Deployment

For Vercel deployment issues:

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "out"
      }
    }
  ]
}
```

## Browser Compatibility

### Modern Browser Features

This template uses modern web features:

- **CSS Custom Properties** (IE 11+)
- **Flexbox** (IE 11+)
- **ES6+ JavaScript** (Chrome 51+, Firefox 54+, Safari 10+)

For older browser support, consider:

- Adding polyfills
- Using PostCSS with autoprefixer
- Transpiling JavaScript with Babel

## Getting Help

If you're still experiencing issues:

1. **Check the console** for error messages
2. **Review the documentation** thoroughly
3. **Search existing issues** on GitHub
4. **Create a new issue** with detailed information:
   - Browser version
   - Node.js version
   - Error messages
   - Steps to reproduce

## Debug Mode

Enable debug mode for additional logging:

```bash
# Development
npm run dev

# Check browser console for debug information
# Press Ctrl+Shift+D to toggle debug cursor (development only)
```

## Performance Monitoring

Monitor your site's performance:

1. **Lighthouse** - Built into Chrome DevTools
2. **WebPageTest** - Detailed performance analysis
3. **Core Web Vitals** - Google's performance metrics

### Optimization Checklist

- [ ] Images optimized and properly sized
- [ ] Fonts loading efficiently
- [ ] CSS/JS minified in production
- [ ] Unused code removed
- [ ] Caching headers configured
- [ ] CDN configured (if applicable)

## Common Error Messages

### "Page is missing param in generateStaticParams"

This occurs when a route is referenced but not included in static generation:

1. **Check documentation.ts** for invalid paths
2. **Verify content files** exist for all referenced paths
3. **Update generateStaticParams** to include all valid routes

### "Module not found"

Usually indicates:

- Missing dependency installation
- Incorrect import path
- Case sensitivity issues (especially on Linux/macOS)

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```
