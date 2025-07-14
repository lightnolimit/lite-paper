# Documentation API

This documentation API provides access to markdown content from the `app/docs/content` directory for AI assistants and client-side applications. Since this is a static export project, traditional API routes don't work, so this implementation uses pre-generated JSON files served statically.

## Overview

The system consists of:

1. **Build-time generation**: A script that reads all markdown files and generates JSON files
2. **Client-side utilities**: Functions to access the documentation content
3. **AI integration helpers**: Specialized functions for AI assistants

## Architecture

```
├── scripts/
│   └── generate-docs.mjs          # Build-time script to generate JSON files
├── app/utils/
│   ├── docs-client.ts             # Client-side documentation access
│   ├── ai-docs-integration.ts     # AI assistant integration helpers
│   └── ai-docs-examples.ts        # Usage examples
├── public/
│   ├── docs-content.json          # Generated: all documentation content
│   └── docs-index.json            # Generated: documentation index
└── app/docs/content/              # Source markdown files
```

## Quick Start

### 1. Generate Documentation Files

The documentation JSON files are generated during the build process:

```bash
npm run generate:docs
```

This creates:

- `public/docs-content.json`: Contains all markdown content
- `public/docs-index.json`: Contains the documentation index

### 2. Access Documentation Content

```typescript
import { getDocumentationContent } from '@/utils/docs-client';

// Get specific documentation
const content = await getDocumentationContent('deployment/platforms/cloudflare');
console.log(content); // Raw markdown content
```

### 3. Search Documentation

```typescript
import { searchDocumentation } from '@/utils/docs-client';

const results = await searchDocumentation('cloudflare deployment');
results.forEach((result) => {
  console.log(`${result.path}: ${result.excerpt}`);
});
```

## API Reference

### Core Functions (`docs-client.ts`)

#### `getDocumentationContent(path: string): Promise<string>`

Retrieves the raw markdown content for a specific documentation path.

**Parameters:**

- `path`: Documentation path (e.g., 'deployment/platforms/cloudflare')

**Returns:** Raw markdown content as string

**Example:**

```typescript
const content = await getDocumentationContent('getting-started/introduction');
```

#### `searchDocumentation(query: string): Promise<SearchResult[]>`

Searches through all documentation content.

**Parameters:**

- `query`: Search query string

**Returns:** Array of search results with path, content, and excerpt

**Example:**

```typescript
const results = await searchDocumentation('authentication API');
```

#### `getAvailableDocumentationPaths(): Promise<string[]>`

Gets all available documentation paths.

**Returns:** Array of available documentation paths

#### `documentationPathExists(path: string): Promise<boolean>`

Checks if a documentation path exists.

**Parameters:**

- `path`: Documentation path to check

**Returns:** Boolean indicating if path exists

### AI Integration Functions (`ai-docs-integration.ts`)

#### `queryDocumentation(query: AIDocumentationQuery): Promise<AIDocumentationResponse>`

Main query function for AI assistants.

**Query Types:**

- `content`: Get content for a specific path
- `search`: Search documentation
- `paths`: Get all available paths
- `stats`: Get documentation statistics

**Example:**

```typescript
// Get content
const response = await queryDocumentation({
  type: 'content',
  path: 'deployment/platforms/cloudflare',
});

// Search
const searchResponse = await queryDocumentation({
  type: 'search',
  query: 'cloudflare',
  limit: 5,
});
```

#### `getDocumentationForAI(path: string): Promise<DocumentationWithMetadata>`

Enhanced documentation access with metadata for AI assistants.

**Returns:** Content with metadata including related paths, existence status, etc.

#### `smartSearchForAI(query: string, options?): Promise<SmartSearchResult>`

Advanced search with relevance scoring.

**Options:**

- `maxResults`: Maximum number of results (default: 10)
- `includeContent`: Include full content in results (default: false)

#### `getDocumentationOutline(): Promise<DocumentationOutline>`

Gets the documentation structure organized by category.

#### `validateDocumentationPath(path: string): Promise<ValidationResult>`

Validates a documentation path and provides suggestions for invalid paths.

## File Structure

The documentation follows this structure:

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
├── api-reference/
│   ├── overview.md
│   ├── authentication.md
│   └── endpoints.md
├── developer-guides/
│   └── ...
└── deployment/
    ├── overview.md
    └── platforms/
        ├── cloudflare.md
        ├── vercel.md
        └── netlify.md
```

## Path Format

Documentation paths use the format: `category/subcategory/file-name` (without .md extension)

Examples:

- `getting-started/introduction`
- `deployment/platforms/cloudflare`
- `api-reference/authentication`

## AI Assistant Integration Examples

### Basic Content Retrieval

```typescript
import { getDocumentationForAI } from '@/utils/ai-docs-integration';

async function handleUserQuestion(userPath: string) {
  const docData = await getDocumentationForAI(userPath);

  if (docData.metadata.exists) {
    return {
      content: docData.content,
      relatedTopics: docData.metadata.relatedPaths,
    };
  } else {
    return {
      error: 'Documentation not found',
      suggestions: docData.metadata.relatedPaths,
    };
  }
}
```

### Smart Search

```typescript
import { smartSearchForAI } from '@/utils/ai-docs-integration';

async function handleUserQuery(query: string) {
  const results = await smartSearchForAI(query, {
    maxResults: 5,
    includeContent: false,
  });

  return {
    query: results.searchQuery,
    totalResults: results.totalResults,
    topResults: results.results.map((r) => ({
      path: r.path,
      relevance: r.relevance,
      excerpt: r.excerpt,
    })),
  };
}
```

### Contextual Help

```typescript
import { validateDocumentationPath, getDocumentationOutline } from '@/utils/ai-docs-integration';

async function provideHelp(userInput: string) {
  // Try to interpret as a path first
  const validation = await validateDocumentationPath(userInput);

  if (validation.exists) {
    return await getDocumentationForAI(userInput);
  }

  // Fall back to search
  return await smartSearchForAI(userInput, { maxResults: 3 });
}
```

## Build Integration

The documentation generation is integrated into the build process:

```json
{
  "scripts": {
    "dev": "npm run generate:docs && next dev",
    "build": "npm run generate:llms && npm run generate:docs && next build",
    "generate:docs": "node scripts/generate-docs.mjs"
  }
}
```

## Error Handling

The API includes comprehensive error handling:

- **File not found**: Returns error message with suggestions
- **Empty files**: Returns warning message
- **Invalid paths**: Provides path validation and suggestions
- **Network errors**: Graceful fallback with cached content

## Performance Considerations

- **Caching**: Client-side caching prevents repeated network requests
- **Static serving**: JSON files are served statically for optimal performance
- **Lazy loading**: Content is only loaded when requested
- **Build-time generation**: Processing happens at build time, not runtime

## Development Server

The development server runs on port 3333 to avoid conflicts with other projects:

```bash
npm run dev
# Visit http://localhost:3333
```

## Testing

A test page is available at `/test-docs` that demonstrates all API functionality:

```bash
npm run dev
# Visit http://localhost:3333/test-docs
```

## Migration from API Routes

This approach replaces traditional API routes (which don't work with static exports) with:

1. Build-time content generation
2. Static file serving
3. Client-side content access

This provides the same functionality while maintaining compatibility with static hosting platforms like Cloudflare Pages.

## Future Enhancements

Possible improvements:

- Full-text search indexing
- Content categorization and tagging
- Version tracking
- Content analytics
- Multi-language support

## Support

For issues or questions about the documentation API, please refer to the examples in `app/utils/ai-docs-examples.ts` or create an issue in the repository.
