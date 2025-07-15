import { Icon } from '@iconify/react/dist/iconify.js';
import { useMemo, createElement } from 'react';

import { documentationTree } from '../../data/documentation';
import { useDebounce } from '../../hooks/useDebounce';
import { isAIAvailable } from '../../lib/clientRAG';
import { useTheme } from '../../providers/ThemeProvider';
import type { FileItem } from '../../types/documentation';

import type { SearchResultType } from './SearchResult';

// FAQ data moved to separate constant for better maintainability
const FAQ_ITEMS = [
  {
    question: 'How do I change the theme?',
    answer:
      'You can change the theme using Cmd + I (Mac) or Ctrl + I (Windows/Linux). Alternatively, use the theme toggle button in the navigation bar or select "Switch to Dark/Light Mode" from this command palette.',
  },
  {
    question: 'How do I search the documentation?',
    answer:
      'Use Cmd + K (Mac) or Ctrl + K (Windows/Linux) to open this command palette, then type your search query. You can also use the AI Assistant for more complex questions.',
  },
  {
    question: 'How can I contribute to the documentation?',
    answer:
      'At the bottom of each documentation page, you\'ll find "edit", "issue", and "source" links. Click "edit" to propose changes directly on GitHub, or "issue" to report problems.',
  },
  {
    question: 'What keyboard shortcuts are available?',
    answer:
      'Key shortcuts: Cmd/Ctrl + K (Command Palette), Cmd/Ctrl + I (Theme Toggle), Escape (Close dialogs), Arrow keys (Navigate), Enter (Select).',
  },
  {
    question: 'How do I navigate between pages?',
    answer:
      'Use the file tree on the left sidebar, the interactive mindmap on the right, or the Previous/Next buttons at the bottom of each page. You can also use this command palette to quickly jump to any page.',
  },
];

export const useSearchLogic = (query: string, setIsAIMode: (mode: boolean) => void) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const debouncedQuery = useDebounce(query, 150);

  // Build search index with memoization
  const searchIndex = useMemo(() => {
    const results: SearchResultType[] = [];

    // Add AI Assistant only if AI is available
    if (isAIAvailable()) {
      results.push({
        title: 'Ask AI Assistant',
        path: 'ai-assistant',
        type: 'ai',
        description: 'Get help from AI about the documentation',
        action: () => setIsAIMode(true),
        icon: createElement(Icon, { icon: 'mingcute:ai-fill', className: 'w-5 h-5' }),
        shortcut: 'A',
      });
    }

    // Add theme toggle action
    results.push({
      title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      path: 'theme-toggle',
      type: 'theme',
      description: 'Toggle between light and dark themes',
      action: toggleDarkMode,
      icon: isDarkMode
        ? createElement(Icon, { icon: 'mingcute:sun-line', className: 'w-5 h-5' })
        : createElement(Icon, { icon: 'mingcute:moon-line', className: 'w-5 h-5' }),
      shortcut: 'I',
    });

    // Add navigation to llms.txt page
    results.push({
      title: 'LLMs.txt - AI Documentation',
      path: '/llms',
      type: 'page',
      description: 'View and download AI-friendly documentation format',
      icon: createElement(Icon, { icon: 'mingcute:file-line', className: 'w-5 h-5' }),
      shortcut: 'L',
    });

    // Add only first 2 FAQ items for default results
    FAQ_ITEMS.slice(0, 2).forEach((faq, index) => {
      results.push({
        title: faq.question,
        path: `faq-${index}`,
        type: 'faq',
        description: 'Frequently Asked Question',
        answer: faq.answer,
        icon: createElement(Icon, { icon: 'mingcute:question-line', className: 'w-5 h-5' }),
      });
    });

    // Process documentation tree
    function processTree(items: FileItem[], parentPath: string = '') {
      items.forEach((item) => {
        if (item.type === 'file') {
          results.push({
            title: item.name.replace('.md', ''),
            path: `/docs/${item.path}`,
            type: 'page',
            description: parentPath,
            icon: createElement(Icon, { icon: 'mingcute:file-line', className: 'w-5 h-5' }),
          });
        } else if (item.type === 'directory' && item.children) {
          processTree(item.children, item.name);
        }
      });
    }

    processTree(documentationTree);

    // Add quick actions
    results.push({
      title: 'Go to Homepage',
      path: '/',
      type: 'action',
      description: 'Navigate to the main page',
      icon: createElement(Icon, { icon: 'mingcute:home-2-line', className: 'w-5 h-5' }),
      shortcut: 'H',
    });

    return results;
  }, [isDarkMode, toggleDarkMode, setIsAIMode]);

  // Create a complete searchable index that includes all FAQ items
  const completeSearchIndex = useMemo(() => {
    const allResults = [...searchIndex];

    // Add remaining FAQ items (beyond first 2) only for search purposes
    FAQ_ITEMS.slice(2).forEach((faq, index) => {
      allResults.push({
        title: faq.question,
        path: `faq-${index + 2}`,
        type: 'faq',
        description: 'Frequently Asked Question',
        answer: faq.answer,
        icon: createElement(Icon, { icon: 'mingcute:question-line', className: 'w-5 h-5' }),
      });
    });

    return allResults;
  }, [searchIndex]);

  // Optimized search with better performance
  const filteredResults = useMemo(() => {
    if (!debouncedQuery) return searchIndex.slice(0, 8);

    const lowerQuery = debouncedQuery.toLowerCase();
    const results = [];

    // Pre-allocate arrays for different priority levels
    const exactMatches = [];
    const titleStartMatches = [];
    const titleContainMatches = [];
    const descriptionMatches = [];

    for (const item of completeSearchIndex) {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description?.toLowerCase() || '';

      if (titleLower === lowerQuery) {
        exactMatches.push(item);
      } else if (titleLower.startsWith(lowerQuery)) {
        titleStartMatches.push(item);
      } else if (titleLower.includes(lowerQuery)) {
        titleContainMatches.push(item);
      } else if (descLower.includes(lowerQuery)) {
        descriptionMatches.push(item);
      }
    }

    // Combine results in priority order
    results.push(
      ...exactMatches,
      ...titleStartMatches,
      ...titleContainMatches,
      ...descriptionMatches
    );

    return results.slice(0, 8);
  }, [debouncedQuery, searchIndex, completeSearchIndex]);

  return {
    searchIndex,
    filteredResults,
    debouncedQuery,
  };
};
