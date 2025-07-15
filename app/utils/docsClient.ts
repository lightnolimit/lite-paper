/**
 * Client-side documentation content accessor
 *
 * This module provides functions to access documentation content
 * from the statically generated JSON files, since API routes
 * don't work with static exports.
 */

import { createLogger } from './logger';

const logger = createLogger('DocsClient');

interface DocsContentResponse {
  generated: string;
  content: Record<string, string>;
  paths: string[];
  count: number;
}

interface DocsIndexResponse {
  generated: string;
  paths: string[];
  count: number;
}

let cachedContent: DocsContentResponse | null = null;
let cachedIndex: DocsIndexResponse | null = null;

/**
 * Load the documentation content from the static JSON file
 */
export async function loadDocsContent(): Promise<DocsContentResponse> {
  if (cachedContent) {
    return cachedContent;
  }

  try {
    const response = await fetch('/docs-content.json');

    if (!response.ok) {
      throw new Error(`Failed to load docs content: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as DocsContentResponse;
    cachedContent = data;
    return data;
  } catch (error) {
    logger.error('Error loading documentation content:', error);
    throw new Error(
      `Failed to load documentation content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Load the documentation index from the static JSON file
 */
export async function loadDocsIndex(): Promise<DocsIndexResponse> {
  if (cachedIndex) {
    return cachedIndex;
  }

  try {
    const response = await fetch('/docs-index.json');

    if (!response.ok) {
      throw new Error(`Failed to load docs index: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as DocsIndexResponse;
    cachedIndex = data;
    return data;
  } catch (error) {
    logger.error('Error loading documentation index:', error);
    throw new Error(
      `Failed to load documentation index: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get markdown content for a specific documentation path
 */
export async function getDocumentationContent(path: string): Promise<string> {
  try {
    const docsContent = await loadDocsContent();

    const content = docsContent.content[path];

    if (!content) {
      const availablePaths = docsContent.paths.join(', ');
      return `# Documentation Not Found

The requested documentation path "${path}" could not be found.

**Available paths:**
${availablePaths}

Please check the path and try again.`;
    }

    return content;
  } catch (error) {
    logger.error(`Error getting documentation content for path "${path}":`, error);
    return `# Error Loading Documentation

Failed to load documentation for path "${path}".

**Error:** ${error instanceof Error ? error.message : 'Unknown error'}

Please try refreshing the page or contact support if the problem persists.`;
  }
}

/**
 * Check if a documentation path exists
 */
export async function documentationPathExists(path: string): Promise<boolean> {
  try {
    const docsIndex = await loadDocsIndex();
    return docsIndex.paths.includes(path);
  } catch (error) {
    logger.error(`Error checking if path "${path}" exists:`, error);
    return false;
  }
}

/**
 * Get all available documentation paths
 */
export async function getAvailableDocumentationPaths(): Promise<string[]> {
  try {
    const docsIndex = await loadDocsIndex();
    return docsIndex.paths;
  } catch (error) {
    logger.error('Error getting available documentation paths:', error);
    return [];
  }
}

/**
 * Search documentation content
 */
export async function searchDocumentation(
  query: string
): Promise<Array<{ path: string; content: string; excerpt: string }>> {
  try {
    const docsContent = await loadDocsContent();
    const results: Array<{ path: string; content: string; excerpt: string }> = [];

    const searchTerm = query.toLowerCase();

    for (const [path, content] of Object.entries(docsContent.content)) {
      const contentLower = content.toLowerCase();

      if (contentLower.includes(searchTerm)) {
        // Find the first occurrence and create an excerpt
        const index = contentLower.indexOf(searchTerm);
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + 200);
        let excerpt = content.substring(start, end);

        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';

        results.push({
          path,
          content,
          excerpt,
        });
      }
    }

    return results;
  } catch (error) {
    logger.error('Error searching documentation:', error);
    return [];
  }
}

/**
 * Get documentation statistics
 */
export async function getDocumentationStats(): Promise<{
  totalFiles: number;
  totalContent: number;
  generated: string;
  paths: string[];
}> {
  try {
    const docsContent = await loadDocsContent();

    const totalContent = Object.values(docsContent.content).reduce(
      (sum, content) => sum + content.length,
      0
    );

    return {
      totalFiles: docsContent.count,
      totalContent,
      generated: docsContent.generated,
      paths: docsContent.paths,
    };
  } catch (error) {
    logger.error('Error getting documentation statistics:', error);
    return {
      totalFiles: 0,
      totalContent: 0,
      generated: new Date().toISOString(),
      paths: [],
    };
  }
}

/**
 * Clear the cached documentation content (useful for development)
 */
export function clearDocsCache(): void {
  cachedContent = null;
  cachedIndex = null;
}
