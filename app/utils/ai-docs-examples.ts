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
} from './ai-docs-integration';

/**
 * Example 1: AI Assistant handling user question about Cloudflare deployment
 */
export async function handleCloudflareDeploymentQuestion() {
  console.log('🤖 AI Assistant: User asked about Cloudflare deployment...');

  // First, check if the path exists and get the content
  const validation = await validateDocumentationPath('deployment/platforms/cloudflare');

  if (validation.exists) {
    const docData = await getDocumentationForAI('deployment/platforms/cloudflare');

    console.log('📄 Found documentation:', {
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
    console.log('❌ Path not found, suggesting alternatives:', validation.suggestions);
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
  console.log('🤖 AI Assistant: Searching for configuration information...');

  const searchResults = await smartSearchForAI('configuration settings', {
    maxResults: 5,
    includeContent: false,
  });

  console.log('🔍 Search results:', {
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
  console.log('🤖 AI Assistant: Providing documentation overview...');

  const outline = await getDocumentationOutline();

  console.log('📋 Documentation outline:', {
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
  console.log('🤖 AI Assistant: Handling multiple queries...');

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

  console.log('📊 Query results:', {
    pathsSuccess: pathsResult.success,
    statsSuccess: statsResult.success,
    searchSuccess: searchResult.success,
    searchResultCount: searchResult.success ? searchResult.data.results.length : 0,
  });

  if (pathsResult.success && statsResult.success && searchResult.success) {
    const response = `I can help you with the documentation! Here's what I found:

**Available Documentation:**
- ${pathsResult.data.count} total documents
- Generated: ${new Date(statsResult.data.generated).toLocaleDateString()}
- ${statsResult.data.totalContent.toLocaleString()} total characters

**Getting Started Resources:**
${searchResult.data.results
  .map((result: any, index: number) => `${index + 1}. ${result.path}\n   ${result.excerpt}`)
  .join('\n\n')}

What would you like to know more about?`;

    return {
      response,
      availablePaths: pathsResult.data.paths,
      stats: statsResult.data,
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
  console.log(`🤖 AI Assistant: Providing contextual help for: "${userQuery}"`);

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
  console.log('🚀 Starting AI Documentation Chat Session...\n');

  // User: "How do I deploy to Cloudflare?"
  console.log('👤 User: How do I deploy to Cloudflare?');
  const cloudflareResponse = await handleCloudflareDeploymentQuestion();
  console.log('🤖 AI:', cloudflareResponse.response.substring(0, 200) + '...\n');

  // User: "What configuration options are available?"
  console.log('👤 User: What configuration options are available?');
  const configResponse = await handleConfigurationSearch();
  console.log('🤖 AI:', configResponse.response.substring(0, 200) + '...\n');

  // User: "Can you give me an overview of all documentation?"
  console.log('👤 User: Can you give me an overview of all documentation?');
  const overviewResponse = await provideDocumentationOverview();
  console.log('🤖 AI:', overviewResponse.response.substring(0, 200) + '...\n');

  // User: "Help me with authentication"
  console.log('👤 User: Help me with authentication');
  const authResponse = await provideContextualHelp('authentication');
  console.log('🤖 AI:', authResponse.response.substring(0, 200) + '...\n');

  console.log('✅ AI Documentation Chat Session Complete!');
}

// Export the simulation function for testing
export { simulateAIChatSession };
