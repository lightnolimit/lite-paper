// Client-side RAG implementation - works without a server!

export interface DocumentChunk {
  content: string;
  metadata: {
    title: string;
    path: string;
    section: string;
  };
}

export interface DocumentSource {
  title: string;
  path: string;
  snippet: string;
  relevanceScore: number;
}

// Pre-indexed documentation content (built at compile time)
// This gets populated by the build process and embedded in the client bundle
export const documentationIndex: DocumentChunk[] = [];

// Simple keyword-based search and scoring (client-side)
export function searchDocuments(query: string): DocumentSource[] {
  const queryTerms = query
    .toLowerCase()
    .split(' ')
    .filter((term) => term.length > 2);
  const results: Array<DocumentSource & { score: number }> = [];

  documentationIndex.forEach((doc) => {
    const content = doc.content.toLowerCase();
    const title = doc.metadata.title.toLowerCase();

    let score = 0;
    let bestSnippet = '';

    queryTerms.forEach((term) => {
      if (title.includes(term)) score += 10;
      const matches = content.split(term).length - 1;
      score += matches * 2;

      const termIndex = content.indexOf(term);
      if (termIndex !== -1 && !bestSnippet) {
        const start = Math.max(0, termIndex - 100);
        bestSnippet = doc.content.substring(start, start + 200);
      }
    });

    if (score > 0) {
      if (!bestSnippet) bestSnippet = doc.content.substring(0, 200);
      bestSnippet = bestSnippet.replace(/[#*`]/g, '').trim();
      if (bestSnippet.length >= 200) bestSnippet += '...';

      results.push({
        title: doc.metadata.title,
        path: doc.metadata.path,
        snippet: bestSnippet,
        relevanceScore: score,
        score,
      });
    }
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score, ...rest }) => ({ ...rest, relevanceScore: score }));
}

export function generateAnswer(query: string, sources: DocumentSource[]): string {
  if (sources.length === 0) {
    return "I couldn't find specific information about that in the documentation. Try rephrasing your question or browse the main sections.";
  }

  const queryLower = query.toLowerCase();
  const topSource = sources[0];

  if (queryLower.includes('how to') || queryLower.includes('how do i')) {
    let answer = `Here's how you can ${query.replace(/how to|how do i/i, '').trim()}:\n\n`;
    answer += topSource.snippet;
    return answer;
  }

  let answer = `Based on the documentation:\n\n${topSource.snippet}`;

  if (sources.length > 1) {
    answer += `\n\nRelated topics:\n`;
    sources.slice(1, 3).forEach((source) => {
      answer += `- ${source.title}\n`;
    });
  }

  return answer;
}

// Client-side search function that replaces the API call
export async function searchAndAnswer(
  query: string,
  useAI: boolean = true
): Promise<{ answer: string; sources: DocumentSource[] }> {
  if (documentationIndex.length === 0) {
    await loadEmbeddedDocs();
  }

  const sources = searchDocuments(query);

  // Use Akash AI for better responses if available
  if (useAI && sources.length > 0) {
    try {
      const aiAnswer = await getAIResponse(query, sources);
      return { answer: aiAnswer, sources };
    } catch (error) {
      console.warn('AI response failed, falling back to local generation:', error);
      // Fallback to local generation
    }
  }

  const answer = generateAnswer(query, sources);
  return { answer, sources };
}

// Call Akash Chat API for enhanced responses
async function getAIResponse(query: string, sources: DocumentSource[]): Promise<string> {
  // Build context from relevant documentation
  const context = sources
    .slice(0, 3)
    .map((source) => `**${source.title}** (from ${source.path}):\n${source.snippet}`)
    .join('\n\n');

  const systemPrompt = `You are a helpful documentation assistant. Answer the user's question based ONLY on the provided documentation context. 

Keep your response:
- Accurate and based only on the provided context
- Helpful and actionable
- Well-formatted with markdown
- Concise but complete

If the context doesn't contain enough information to answer the question, say so and suggest checking the referenced documentation sections.

Documentation Context:
${context}`;

  const response = await fetch('https://chatapi.akash.network/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`, // We'll implement this
    },
    body: JSON.stringify({
      model: 'Meta-Llama-3-1-8B-Instruct-FP8', // Fast and efficient model from Akash
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.1, // Low temperature for consistent, factual responses
      max_tokens: 500, // Reasonable response length
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Akash API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Get API key from environment or localStorage
function getApiKey(): string {
  // First try to get from environment (if built with the key by the developer)
  const envKey = process.env.NEXT_PUBLIC_AKASH_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey;
  }

  // Fall back to localStorage (user can set their own key in the UI)
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('akash_api_key') : null;
  if (userKey && userKey.trim() !== '') {
    return userKey;
  }

  // No key available
  throw new Error(
    'No Akash API key available. Please set it in the AI Assistant settings or, for development, as a NEXT_PUBLIC_AKASH_API_KEY environment variable.'
  );
}

// Load actual documentation content dynamically
async function loadEmbeddedDocs(): Promise<void> {
  if (documentationIndex.length > 0) return; // Already loaded

  // Define the actual documentation files that exist
  const docFiles = [
    {
      path: 'getting-started/introduction',
      title: 'Getting Started - Introduction',
      file: '/app/docs/content/getting-started/introduction.md',
    },
    {
      path: 'getting-started/installation',
      title: 'Installation Guide',
      file: '/app/docs/content/getting-started/installation.md',
    },
    {
      path: 'getting-started/quick-start',
      title: 'Quick Start',
      file: '/app/docs/content/getting-started/quick-start.md',
    },
    {
      path: 'deployment/overview',
      title: 'Deployment Overview',
      file: '/app/docs/content/deployment/overview.md',
    },
    {
      path: 'deployment/platforms/cloudflare',
      title: 'Deploying to Cloudflare Pages',
      file: '/app/docs/content/deployment/platforms/cloudflare.md',
    },
    {
      path: 'deployment/platforms/vercel',
      title: 'Deploying to Vercel',
      file: '/app/docs/content/deployment/platforms/vercel.md',
    },
    {
      path: 'deployment/platforms/netlify',
      title: 'Deploying to Netlify',
      file: '/app/docs/content/deployment/platforms/netlify.md',
    },
    {
      path: 'developer-guides/ui-configuration',
      title: 'UI Configuration',
      file: '/app/docs/content/developer-guides/ui-configuration.md',
    },
    {
      path: 'developer-guides/icon-customization',
      title: 'Icon Customization',
      file: '/app/docs/content/developer-guides/icon-customization.md',
    },
    {
      path: 'user-guide/advanced-features',
      title: 'Advanced Features',
      file: '/app/docs/content/user-guide/advanced-features.md',
    },
    {
      path: 'user-guide/basic-usage',
      title: 'Basic Usage',
      file: '/app/docs/content/user-guide/basic-usage.md',
    },
    {
      path: 'api-reference/overview',
      title: 'API Reference',
      file: '/app/docs/content/api-reference/overview.md',
    },
  ];

  // Load actual content from files using our API endpoint
  for (const doc of docFiles) {
    try {
      const response = await fetch(`/api/docs/${doc.path}`);
      if (response.ok) {
        const content = await response.text();
        if (content.trim()) {
          documentationIndex.push({
            content: content,
            metadata: {
              title: doc.title,
              path: doc.path,
              section: doc.path.split('/')[0],
            },
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${doc.path}:`, error);
    }
  }

  // Fallback content if no files loaded
  if (documentationIndex.length === 0) {
    documentationIndex.push({
      content: `# Documentation\n\nThis is a documentation site template. You can customize the content by editing the markdown files in the docs/content directory.\n\n## Features\n\n- Dark/light theme switching\n- Interactive backgrounds\n- Responsive design\n- Fast search\n- Command palette\n- AI assistant`,
      metadata: {
        title: 'Documentation',
        path: 'overview',
        section: 'general',
      },
    });
  }
}
