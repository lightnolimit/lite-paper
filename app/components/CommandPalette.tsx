'use client';

import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

import { documentationTree } from '../data/documentation';
import { isAIAvailable } from '../lib/clientRAG';
import { useTheme } from '../providers/ThemeProvider';
import { createLogger } from '../utils/logger';

const logger = createLogger('CommandPalette');

import type { FileItem } from './FileTree';

interface SearchResult {
  title: string;
  path: string;
  type: 'page' | 'action' | 'theme' | 'ai' | 'faq';
  description?: string;
  action?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  answer?: string; // For FAQ preset answers
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

// Frequently Asked Questions with preset answers
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

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, prefersReducedMotion } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build search index from documentation tree
  const searchIndex = useMemo(() => {
    const results: SearchResult[] = [];

    // Add AI Assistant only if AI is available
    if (isAIAvailable()) {
      results.push({
        title: 'Ask AI Assistant',
        path: 'ai-assistant',
        type: 'ai',
        description: 'Get help from AI about the documentation',
        action: () => setIsAIMode(true),
        icon: <Icon icon="mingcute:ai-fill" className="w-5 h-5" />,
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
      icon: isDarkMode ? (
        <Icon icon="mingcute:sun-line" className="w-5 h-5" />
      ) : (
        <Icon icon="mingcute:moon-line" className="w-5 h-5" />
      ),
      shortcut: 'I',
    });

    // Add navigation to llms.txt page
    results.push({
      title: 'LLMs.txt - AI Documentation',
      path: '/llms',
      type: 'page',
      description: 'View and download AI-friendly documentation format',
      icon: <Icon icon="mingcute:file-line" className="w-5 h-5" />,
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
        icon: <Icon icon="mingcute:question-line" className="w-5 h-5" />,
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
            icon: <Icon icon="mingcute:file-line" className="w-5 h-5" />,
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
      icon: <Icon icon="mingcute:home-2-line" className="w-5 h-5" />,
      shortcut: 'H',
    });

    return results;
  }, [isDarkMode, toggleDarkMode]);

  // Create a complete searchable index that includes all FAQ items for searching
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
        icon: <Icon icon="mingcute:question-line" className="w-5 h-5" />,
      });
    });

    return allResults;
  }, [searchIndex]);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query) return searchIndex.slice(0, 8); // Show top results when no query

    const lowerQuery = query.toLowerCase();
    return completeSearchIndex
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const descMatch = item.description?.toLowerCase().includes(lowerQuery);
        return titleMatch || descMatch;
      })
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.title.toLowerCase() === lowerQuery;
        const bExact = b.title.toLowerCase() === lowerQuery;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then prioritize title matches over description matches
        const aTitle = a.title.toLowerCase().includes(lowerQuery);
        const bTitle = b.title.toLowerCase().includes(lowerQuery);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;

        return 0;
      })
      .slice(0, 8);
  }, [query, searchIndex, completeSearchIndex]);

  // Define handleSelect before it's used
  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (result.type === 'faq' && result.answer) {
        // Handle FAQ selection - show preset answer in AI mode
        setIsAIMode(true);
        setAIResponse(result.answer);
        setQuery('');
      } else if (result.action) {
        result.action();
        // Don't close the palette for AI assistant
        if (result.type !== 'ai') {
          onClose();
        }
      } else {
        router.push(result.path);
        onClose();
      }
    },
    [router, onClose]
  );

  // Reset state when palette opens/closes and manage body scroll
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setIsAIMode(false);
      setAIResponse('');
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus input after a short delay to ensure it's rendered
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
    // Reset scroll position
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [filteredResults.length]);

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the command palette is actually focused
      const commandPaletteElement = document.querySelector('[data-command-palette]');
      if (!commandPaletteElement || !commandPaletteElement.contains(document.activeElement)) {
        return;
      }

      // Handle navigation keys
      if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
        // In AI mode, handle Enter and Escape differently
        if (isAIMode) {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Exit AI mode, go back to command palette
            setIsAIMode(false);
            setQuery('');
            setAIResponse('');
            return;
          }
          // Let Enter be handled by the input's onKeyDown for AI queries
          if (e.key === 'Enter') {
            return; // Don't prevent default, let input handle it
          }
        }

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        switch (e.key) {
          case 'ArrowDown':
            if (!isAIMode) {
              setSelectedIndex((prev) => {
                const next = prev + 1;
                return next >= filteredResults.length ? 0 : next;
              });
            }
            break;
          case 'ArrowUp':
            if (!isAIMode) {
              setSelectedIndex((prev) => {
                const next = prev - 1;
                return next < 0 ? filteredResults.length - 1 : next;
              });
            }
            break;
          case 'Enter':
            if (!isAIMode && filteredResults[selectedIndex]) {
              handleSelect(filteredResults[selectedIndex]);
            }
            break;
          case 'Escape':
            onClose();
            break;
        }
        return;
      }

      // Handle shortcuts (Cmd+key) - but not in AI mode
      if (!isAIMode) {
        const key = e.key.toUpperCase();
        const shortcut = e.shiftKey ? `Shift+${key}` : key;
        const resultWithShortcut = filteredResults.find((result) => result.shortcut === shortcut);
        if (resultWithShortcut && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          e.stopPropagation();
          handleSelect(resultWithShortcut);
        }
      }
    };

    // Use capture phase to intercept before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredResults, onClose, handleSelect, isAIMode]);

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current || selectedIndex < 0) return;
    const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Animation variants
  const backdropVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

  const modalVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0, scale: 1 },
        visible: { opacity: 1, scale: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.95, y: -20 },
        visible: { opacity: 1, scale: 1, y: 0 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Command Palette */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 flex items-start justify-center pt-[20vh] z-50 pointer-events-none"
          >
            <div className="w-full max-w-2xl px-4 pointer-events-auto">
              <div
                data-command-palette
                className="rounded-lg shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--card-color)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {/* Search Input */}
                <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  {isAIMode && (
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="mingcute:ai-fill" className="w-5 h-5" />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                        AI Assistant
                      </span>
                      <button
                        onClick={() => {
                          setIsAIMode(false);
                          setQuery('');
                          setAIResponse('');
                        }}
                        className="ml-auto text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        style={{
                          color: 'var(--muted-color)',
                          fontFamily: 'var(--mono-font)',
                        }}
                      >
                        exit ai mode
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(0);
                      }}
                      onKeyDown={async (e) => {
                        if (isAIMode && e.key === 'Enter' && query.trim()) {
                          e.preventDefault();
                          // Handle AI query submission
                          setIsAILoading(true);

                          try {
                            // Import and use the clientRAG search function
                            const { searchAndAnswer } = await import('../lib/clientRAG');
                            const response = await searchAndAnswer(query.trim());

                            setAIResponse(response.answer);

                            // Store sources for display if needed
                            if (response.sources && response.sources.length > 0) {
                              // We'll add source display in the UI
                              setAIResponse((prev) => {
                                let answer = prev;
                                answer += '\n\n**Sources:**\n';
                                response.sources.forEach((source) => {
                                  answer += `- [${source.title}](${source.path})\n`;
                                });
                                return answer;
                              });
                            }

                            // Clear the query after successful submission
                            setQuery('');
                          } catch (error) {
                            logger.error('AI search error:', error);
                            setAIResponse(
                              'I apologize, but I encountered an error while searching for information. Please try rephrasing your question or check the documentation directly.'
                            );
                          } finally {
                            setIsAILoading(false);
                          }
                        }
                      }}
                      placeholder={
                        isAIMode
                          ? 'Ask me anything about the documentation...'
                          : 'Search documentation or type a command...'
                      }
                      className="w-full px-3 py-2 rounded-md outline-none text-base"
                      style={{
                        color: 'var(--text-color)',
                        fontFamily: 'var(--mono-font)',
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                      }}
                    />
                  </div>
                </div>

                {/* Results */}
                <div
                  ref={resultsRef}
                  className="max-h-96 overflow-y-auto command-palette-scroll"
                  tabIndex={-1}
                  style={{ outline: 'none' }}
                >
                  {isAIMode ? (
                    <div className="flex flex-col h-64 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
                      {/* Chat messages area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {!aiResponse && !isAILoading && (
                          <div className="flex justify-start">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mingcute:ai-fill" className="w-5 h-5" />
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: 'var(--text-color)' }}
                                >
                                  AI Assistant
                                </span>
                              </div>
                              <p
                                className="text-sm"
                                style={{
                                  color: 'var(--text-color)',
                                  fontFamily: 'var(--mono-font)',
                                }}
                              >
                                Hi! I can help you find information in the documentation. What would
                                you like to know?
                              </p>
                            </div>
                          </div>
                        )}

                        {isAILoading && (
                          <div className="flex justify-start">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Icon icon="mingcute:ai-fill" className="w-5 h-5" />
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                                </div>
                                <span className="text-sm" style={{ color: 'var(--muted-color)' }}>
                                  Thinking...
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {aiResponse && (
                          <div className="flex justify-start">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mingcute:ai-fill" className="w-5 h-5" />
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: 'var(--text-color)' }}
                                >
                                  AI Assistant
                                </span>
                              </div>
                              <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <ReactMarkdown
                                  components={{
                                    a: ({ href, children }) => (
                                      <a
                                        href={href}
                                        style={{
                                          color: 'var(--primary-color)',
                                          textDecoration: 'none',
                                          borderBottom: '1px solid transparent',
                                          transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                          (e.target as HTMLAnchorElement).style.borderBottom =
                                            '1px solid var(--primary-color)';
                                          (e.target as HTMLAnchorElement).style.opacity = '0.8';
                                        }}
                                        onMouseLeave={(e) => {
                                          (e.target as HTMLAnchorElement).style.borderBottom =
                                            '1px solid transparent';
                                          (e.target as HTMLAnchorElement).style.opacity = '1';
                                        }}
                                        onClick={(e) => {
                                          if (href?.startsWith('/')) {
                                            e.preventDefault();
                                            router.push(href);
                                            onClose();
                                          }
                                        }}
                                      >
                                        {children}
                                      </a>
                                    ),
                                    p: ({ children }) => (
                                      <p
                                        className="text-sm mb-2 last:mb-0"
                                        style={{
                                          color: 'var(--text-color)',
                                          fontFamily: 'var(--mono-font)',
                                        }}
                                      >
                                        {children}
                                      </p>
                                    ),
                                    strong: ({ children }) => (
                                      <strong
                                        style={{ color: 'var(--text-color)', fontWeight: 600 }}
                                      >
                                        {children}
                                      </strong>
                                    ),
                                    ul: ({ children }) => (
                                      <ul
                                        className="list-disc list-inside space-y-1 text-sm"
                                        style={{
                                          color: 'var(--text-color)',
                                          fontFamily: 'var(--mono-font)',
                                        }}
                                      >
                                        {children}
                                      </ul>
                                    ),
                                    li: ({ children }) => (
                                      <li
                                        style={{
                                          color: 'var(--text-color)',
                                          fontFamily: 'var(--mono-font)',
                                        }}
                                      >
                                        {children}
                                      </li>
                                    ),
                                    h1: ({ children }) => (
                                      <h1
                                        className="text-base font-semibold mb-2"
                                        style={{ color: 'var(--text-color)' }}
                                      >
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2
                                        className="text-sm font-semibold mb-1"
                                        style={{ color: 'var(--text-color)' }}
                                      >
                                        {children}
                                      </h2>
                                    ),
                                    code: ({ children }) => (
                                      <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">
                                        {children}
                                      </code>
                                    ),
                                  }}
                                >
                                  {aiResponse}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input area for follow-up questions */}
                      <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div
                          className="text-xs text-center mb-2"
                          style={{
                            color: 'var(--muted-color)',
                            fontFamily: 'var(--mono-font)',
                          }}
                        >
                          Press Enter to ask • Esc to go back
                        </div>
                      </div>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => (
                      <button
                        key={result.path}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className="w-full px-4 py-3 flex items-center gap-3 transition-all text-left relative"
                        style={{
                          backgroundColor:
                            index === selectedIndex
                              ? 'rgba(var(--primary-color-rgb), 0.1)'
                              : 'transparent',
                          color: 'var(--text-color)',
                        }}
                      >
                        <span className="text-xl">{result.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{result.title}</div>
                          {result.description && (
                            <div
                              className="text-xs opacity-70"
                              style={{
                                color: 'var(--muted-color)',
                                fontFamily: 'var(--mono-font)',
                              }}
                            >
                              {result.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {result.shortcut && (
                            <kbd
                              className="px-2 py-1 text-xs rounded border font-mono"
                              style={{
                                borderColor:
                                  index === selectedIndex
                                    ? 'var(--primary-color)'
                                    : 'var(--border-color)',
                                backgroundColor:
                                  index === selectedIndex
                                    ? 'var(--primary-color)'
                                    : 'var(--hover-color)',
                                color:
                                  index === selectedIndex
                                    ? isDarkMode
                                      ? '#000'
                                      : '#fff'
                                    : 'var(--text-color)',
                              }}
                            >
                              {result.shortcut === 'T'
                                ? '⌘ + T'
                                : result.shortcut === 'A' || result.shortcut === 'L'
                                  ? `⌘ + ${result.shortcut}`
                                  : `⌘${result.shortcut}`}
                            </kbd>
                          )}
                          {result.type === 'action' && (
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: 'var(--primary-color)',
                                color: isDarkMode ? '#000' : '#fff',
                                fontFamily: 'var(--mono-font)',
                              }}
                            >
                              action
                            </span>
                          )}
                          {result.type === 'faq' && (
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: 'var(--secondary-color)',
                                color: isDarkMode ? '#000' : '#fff',
                                fontFamily: 'var(--mono-font)',
                              }}
                            >
                              faq
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center" style={{ color: 'var(--muted-color)' }}>
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="px-4 py-2 border-t flex items-center justify-between"
                  style={{
                    fontSize: '10px',
                    borderColor: 'var(--border-color)',
                    color: 'var(--muted-color)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        ↑
                      </kbd>
                      <kbd
                        className="px-1.5 py-0.5 rounded border ml-1"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        ↓
                      </kbd>{' '}
                      <span style={{ fontFamily: 'var(--mono-font)' }}>to navigate</span>
                    </span>
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        ↵
                      </kbd>{' '}
                      <span style={{ fontFamily: 'var(--mono-font)' }}>to select</span>
                    </span>
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        esc
                      </kbd>{' '}
                      <span style={{ fontFamily: 'var(--mono-font)' }}>to close</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
