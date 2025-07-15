/**
 * Example usage of the AI Documentation Integration
 *
 * This file demonstrates how an AI assistant can use the documentation API
 * to access and work with documentation content.
 */

import {
  queryDocumentation,
  getDocumentationForAI,
  smartSearchForAI,
  getDocumentationOutline,
  validateDocumentationPath,
  AIDocumentationQuery,
} from './aiDocsIntegration';
import { createLogger } from './logger';

const logger = createLogger('AIDocsExamples');

// Type definitions for queryDocumentation responses
interface PathsQueryData {
  paths: string[];
  count: number;
}

interface StatsQueryData {
  totalFiles: number;
  totalContent: number;
  generated: string;
  paths: string[];
}

interface SearchQueryData {
  query: string;
  results: Array<{
    path: string;
    content: string;
    excerpt: string;
  }>;
  totalResults: number;
}

/**
 * Example 1: AI Assistant handling user question about Cloudflare deployment
 */
export async function handleCloudflareDeploymentQuestion() {
  logger.debug('🤖 AI Assistant: User asked about Cloudflare deployment...');

  // First, check if the path exists and get the content
  const validation = await validateDocumentationPath('deployment/platforms/cloudflare');

  if (validation.exists) {
    const docData = await getDocumentationForAI('deployment/platforms/cloudflare');

    logger.debug('📄 Found documentation:', {
      path: docData.metadata.path,
      contentLength: docData.metadata.length,
      relatedPaths: docData.metadata.relatedPaths,
    });

    // AI can now process the content and provide a response
    const response = `Based on the documentation, here's how to deploy to Cloudflare Pages:

${docData.content.split('\n').slice(0, 10).join('\n')}...

Would you like me to explain any specific part of the deployment process?`;

    return {
      response,
      relatedTopics: docData.metadata.relatedPaths,
    };
  } else {
    logger.debug('❌ Path not found, suggesting alternatives:', validation.suggestions);
    return {
      response: `I couldn't find specific Cloudflare deployment documentation. Here are some related topics: ${validation.suggestions.join(', ')}`,
      relatedTopics: validation.suggestions,
    };
  }
}

/**
 * Example 2: AI Assistant searching for information about configuration
 */
export async function handleConfigurationSearch() {
  logger.debug('🤖 AI Assistant: Searching for configuration information...');

  const searchResults = await smartSearchForAI('configuration settings', {
    maxResults: 5,
    includeContent: false,
  });

  logger.debug('🔍 Search results:', {
    query: searchResults.searchQuery,
    totalResults: searchResults.totalResults,
    topResults: searchResults.results.slice(0, 3).map((r) => ({
      path: r.path,
      relevance: r.relevance.toFixed(2),
    })),
  });

  // AI can now provide a comprehensive answer
  const response = `I found ${searchResults.totalResults} documents about configuration:

${searchResults.results
  .map(
    (result, index) =>
      `${index + 1}. **${result.path}** (relevance: ${result.relevance.toFixed(1)})
     ${result.excerpt}`
  )
  .join('\n\n')}

Would you like me to get the full content for any of these topics?`;

  return {
    response,
    searchResults: searchResults.results,
  };
}

/**
 * Example 3: AI Assistant providing documentation overview
 */
export async function provideDocumentationOverview() {
  logger.debug('🤖 AI Assistant: Providing documentation overview...');

  const outline = await getDocumentationOutline();

  logger.debug('📋 Documentation outline:', {
    totalFiles: outline.totalFiles,
    categories: outline.structure.map((s) => ({ category: s.category, count: s.count })),
  });

  const response = `Here's an overview of the available documentation:

${outline.structure
  .map(
    (section) =>
      `**${section.category.replace(/-/g, ' ').toUpperCase()}** (${section.count} files)
${section.paths.map((path) => `  • ${path.split('/').pop()?.replace(/-/g, ' ')}`).join('\n')}`
  )
  .join('\n\n')}

Total: ${outline.totalFiles} documentation files available.

What specific topic would you like to explore?`;

  return {
    response,
    outline,
  };
}

/**
 * Example 4: AI Assistant handling multiple queries in sequence
 */
export async function handleMultipleQueries() {
  logger.debug('🤖 AI Assistant: Handling multiple queries...');

  // Query 1: Get available paths
  const pathsQuery: AIDocumentationQuery = { type: 'paths' };
  const pathsResult = await queryDocumentation(pathsQuery);

  // Query 2: Get documentation stats
  const statsQuery: AIDocumentationQuery = { type: 'stats' };
  const statsResult = await queryDocumentation(statsQuery);

  // Query 3: Search for specific content
  const searchQuery: AIDocumentationQuery = {
    type: 'search',
    query: 'getting started',
    limit: 3,
  };
  const searchResult = await queryDocumentation(searchQuery);

  logger.debug('📊 Query results:', {
    pathsSuccess: pathsResult.success,
    statsSuccess: statsResult.success,
    searchSuccess: searchResult.success,
    searchResultCount: searchResult.success
      ? (searchResult.data as SearchQueryData).results.length
      : 0,
  });

  if (pathsResult.success && statsResult.success && searchResult.success) {
    const pathsData = pathsResult.data as PathsQueryData;
    const statsData = statsResult.data as StatsQueryData;
    const searchData = searchResult.data as SearchQueryData;

    const response = `I can help you with the documentation! Here's what I found:

**Available Documentation:**
- ${pathsData.count} total documents
- Generated: ${new Date(statsData.generated).toLocaleDateString()}
- ${statsData.totalContent.toLocaleString()} total characters

**Getting Started Resources:**
${searchData.results
  .map((result, index) => `${index + 1}. ${result.path}\n   ${result.excerpt}`)
  .join('\n\n')}

What would you like to know more about?`;

    return {
      response,
      availablePaths: pathsData.paths,
      stats: statsData,
    };
  }

  return {
    response: 'Sorry, I encountered an error while retrieving the documentation information.',
    errors: [pathsResult.error, statsResult.error, searchResult.error].filter(Boolean),
  };
}

/**
 * Example 5: AI Assistant providing contextual help
 */
export async function provideContextualHelp(userQuery: string) {
  logger.debug(`🤖 AI Assistant: Providing contextual help for: "${userQuery}"`);

  // First, try to understand what the user is asking about
  const searchResults = await smartSearchForAI(userQuery, { maxResults: 3 });

  if (searchResults.results.length === 0) {
    // No direct matches, provide general help
    const outline = await getDocumentationOutline();

    return {
      response: `I couldn't find specific information about "${userQuery}". Here are the main documentation categories available:

${outline.structure
  .map(
    (section) =>
      `• **${section.category.replace(/-/g, ' ').toUpperCase()}** - ${section.count} files`
  )
  .join('\n')}

Could you be more specific about what you're looking for?`,
      suggestedCategories: outline.structure.map((s) => s.category),
    };
  }

  // Get detailed content for the most relevant result
  const topResult = searchResults.results[0];
  const detailedContent = await getDocumentationForAI(topResult.path);

  const response = `Based on your question about "${userQuery}", here's what I found:

**Most Relevant: ${topResult.path}**
${detailedContent.content.split('\n').slice(0, 15).join('\n')}...

**Other Related Topics:**
${searchResults.results
  .slice(1)
  .map((result) => `• ${result.path} (relevance: ${result.relevance.toFixed(1)})`)
  .join('\n')}

Would you like me to explain any specific part in more detail?`;

  return {
    response,
    primaryContent: detailedContent,
    relatedTopics: searchResults.results.slice(1),
  };
}

/**
 * Example usage in a chat interface
 */
export async function simulateAIChatSession() {
  logger.debug('🚀 Starting AI Documentation Chat Session...\n');

  // User: "How do I deploy to Cloudflare?"
  logger.debug('👤 User: How do I deploy to Cloudflare?');
  const cloudflareResponse = await handleCloudflareDeploymentQuestion();
  logger.debug('🤖 AI:', cloudflareResponse.response.substring(0, 200) + '...\n');

  // User: "What configuration options are available?"
  logger.debug('👤 User: What configuration options are available?');
  const configResponse = await handleConfigurationSearch();
  logger.debug('🤖 AI:', configResponse.response.substring(0, 200) + '...\n');

  // User: "Can you give me an overview of all documentation?"
  logger.debug('👤 User: Can you give me an overview of all documentation?');
  const overviewResponse = await provideDocumentationOverview();
  logger.debug('🤖 AI:', overviewResponse.response.substring(0, 200) + '...\n');

  // User: "Help me with authentication"
  logger.debug('👤 User: Help me with authentication');
  const authResponse = await provideContextualHelp('authentication');
  logger.debug('🤖 AI:', authResponse.response.substring(0, 200) + '...\n');

  logger.debug('✅ AI Documentation Chat Session Complete!');
}
