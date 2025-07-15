/**
 * AI Assistant Documentation Integration
 *
 * This module provides helper functions specifically designed for AI assistants
 * to access and work with documentation content.
 */

import {
  getDocumentationContent,
  getAvailableDocumentationPaths,
  searchDocumentation,
  documentationPathExists,
  getDocumentationStats,
} from './docsClient';

/**
 * AI-friendly interface for accessing documentation
 */
export interface AIDocumentationQuery {
  type: 'content' | 'search' | 'paths' | 'stats';
  path?: string;
  query?: string;
  limit?: number;
}

export interface AIDocumentationResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  suggestions?: string[];
}

/**
 * Main function for AI assistants to query documentation
 */
export async function queryDocumentation(
  query: AIDocumentationQuery
): Promise<AIDocumentationResponse> {
  try {
    switch (query.type) {
      case 'content':
        if (!query.path) {
          return {
            success: false,
            error: 'Path is required for content queries',
            suggestions: await getAvailableDocumentationPaths(),
          };
        }

        const content = await getDocumentationContent(query.path);
        return {
          success: true,
          data: {
            path: query.path,
            content: content,
            length: content.length,
          },
        };

      case 'search':
        if (!query.query) {
          return {
            success: false,
            error: 'Query is required for search operations',
          };
        }

        const searchResults = await searchDocumentation(query.query);
        const limitedResults = query.limit ? searchResults.slice(0, query.limit) : searchResults;

        return {
          success: true,
          data: {
            query: query.query,
            results: limitedResults,
            totalResults: searchResults.length,
          },
        };

      case 'paths':
        const paths = await getAvailableDocumentationPaths();
        return {
          success: true,
          data: {
            paths: paths,
            count: paths.length,
          },
        };

      case 'stats':
        const stats = await getDocumentationStats();
        return {
          success: true,
          data: stats,
        };

      default:
        return {
          success: false,
          error: 'Invalid query type. Supported types: content, search, paths, stats',
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get documentation content for AI assistant with enhanced context
 */
export async function getDocumentationForAI(path: string): Promise<{
  content: string;
  metadata: {
    path: string;
    exists: boolean;
    length: number;
    lastGenerated: string;
    relatedPaths?: string[];
  };
}> {
  const [content, pathExists, stats, allPaths] = await Promise.all([
    getDocumentationContent(path),
    documentationPathExists(path),
    getDocumentationStats(),
    getAvailableDocumentationPaths(),
  ]);

  // Find related paths (same directory or similar names)
  const pathParts = path.split('/');
  const relatedPaths = allPaths
    .filter((p) => {
      if (p === path) return false;
      const parts = p.split('/');
      return (
        parts[0] === pathParts[0] || // Same top-level directory
        parts.some((part) => pathParts.includes(part))
      ); // Common path segments
    })
    .slice(0, 5); // Limit to 5 related paths

  return {
    content,
    metadata: {
      path,
      exists: pathExists,
      length: content.length,
      lastGenerated: stats.generated,
      relatedPaths,
    },
  };
}

/**
 * Smart search function for AI assistants
 */
export async function smartSearchForAI(
  query: string,
  options: {
    maxResults?: number;
    includeContent?: boolean;
    minRelevance?: number;
  } = {}
): Promise<{
  results: Array<{
    path: string;
    relevance: number;
    excerpt: string;
    content?: string;
  }>;
  totalResults: number;
  searchQuery: string;
}> {
  const { maxResults = 10, includeContent = false } = options;

  const searchResults = await searchDocumentation(query);

  // Enhanced results with relevance scoring
  const enhancedResults = searchResults.map((result) => {
    const queryLower = query.toLowerCase();
    const contentLower = result.content.toLowerCase();

    // Simple relevance scoring based on:
    // 1. Number of query word matches
    // 2. Position of matches (earlier = more relevant)
    // 3. Path relevance (shorter paths often more relevant)

    const queryWords = queryLower.split(/\s+/);
    let relevance = 0;

    queryWords.forEach((word) => {
      const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
      relevance += matches;

      // Bonus for matches in path
      if (result.path.toLowerCase().includes(word)) {
        relevance += 5;
      }
    });

    // Normalize by content length and path length
    relevance = (relevance / (result.content.length / 1000)) * (10 / result.path.length);

    return {
      path: result.path,
      relevance,
      excerpt: result.excerpt,
      ...(includeContent && { content: result.content }),
    };
  });

  // Sort by relevance and limit results
  const sortedResults = enhancedResults
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults);

  return {
    results: sortedResults,
    totalResults: searchResults.length,
    searchQuery: query,
  };
}

/**
 * Get documentation outline for AI context
 */
export async function getDocumentationOutline(): Promise<{
  structure: Array<{
    category: string;
    paths: string[];
    count: number;
  }>;
  totalFiles: number;
  lastGenerated: string;
}> {
  const [paths, stats] = await Promise.all([
    getAvailableDocumentationPaths(),
    getDocumentationStats(),
  ]);

  // Group paths by top-level directory
  const grouped = paths.reduce(
    (acc, path) => {
      const [category] = path.split('/');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(path);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const structure = Object.entries(grouped).map(([category, categoryPaths]) => ({
    category,
    paths: categoryPaths,
    count: categoryPaths.length,
  }));

  return {
    structure,
    totalFiles: stats.totalFiles,
    lastGenerated: stats.generated,
  };
}

/**
 * Validate documentation path for AI
 */
export async function validateDocumentationPath(path: string): Promise<{
  valid: boolean;
  exists: boolean;
  suggestions: string[];
  message: string;
}> {
  const [exists, allPaths] = await Promise.all([
    documentationPathExists(path),
    getAvailableDocumentationPaths(),
  ]);

  if (exists) {
    return {
      valid: true,
      exists: true,
      suggestions: [],
      message: `Path '${path}' is valid and exists`,
    };
  }

  // Find similar paths
  const suggestions = allPaths
    .filter((p) => {
      const similarity = calculateStringSimilarity(path, p);
      return similarity > 0.5;
    })
    .slice(0, 5);

  return {
    valid: false,
    exists: false,
    suggestions,
    message: `Path '${path}' does not exist. ${suggestions.length > 0 ? 'Similar paths available.' : 'No similar paths found.'}`,
  };
}

/**
 * Simple string similarity calculation
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
