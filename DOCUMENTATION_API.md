# Documentation API

Access markdown content for AI assistants and client apps. Uses pre-generated JSON files for static export compatibility.

## Overview

1. Build-time generation: Script reads markdown → JSON
2. Client utilities: Access documentation content
3. AI helpers: Specialized AI assistant functions

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

### 1. Generate Files

```bash
npm run generate:docs
```

Creates `docs-content.json` and `docs-index.json`

### 2. Get Content

```typescript
import { getDocumentationContent } from '@/utils/docs-client';
const content = await getDocumentationContent('deployment/platforms/cloudflare');
```

### 3. Search

```typescript
import { searchDocumentation } from '@/utils/docs-client';
const results = await searchDocumentation('cloudflare deployment');
```

## API Reference

### Core Functions (`docs-client.ts`)

#### `getDocumentationContent(path: string): Promise<string>`

Returns raw markdown for specified path.

#### `searchDocumentation(query: string): Promise<SearchResult[]>`

Searches all content, returns results with path/excerpt.

#### `getAvailableDocumentationPaths(): Promise<string[]>`

Returns all available documentation paths.

#### `documentationPathExists(path: string): Promise<boolean>`

Checks if path exists.

### AI Functions (`ai-docs-integration.ts`)

#### `queryDocumentation(query: AIDocumentationQuery)`

Main AI query function. Types: `content`, `search`, `paths`, `stats`.

#### `getDocumentationForAI(path: string)`

Enhanced access with metadata for AI.

#### `smartSearchForAI(query: string, options?)`

Advanced search with relevance scoring.

#### `getDocumentationOutline()`

Returns documentation structure by category.

#### `validateDocumentationPath(path: string)`

Validates path, provides suggestions if invalid.

## Structure

```
app/docs/content/
├── getting-started/
├── user-guide/
├── api-reference/
├── developer-guides/
└── deployment/
    └── platforms/
```

## Path Format

`category/subcategory/file-name` (no .md)

Examples:

- `getting-started/introduction`
- `deployment/platforms/cloudflare`

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

## Development

```bash
npm run dev  # http://localhost:3333
```

Test page: `/test-docs`

## Notes

Replaces API routes (incompatible with static export) with build-time generation and client-side access.

See `app/utils/ai-docs-examples.ts` for usage examples.
