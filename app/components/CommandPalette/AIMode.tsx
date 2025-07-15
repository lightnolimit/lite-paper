'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AIModeProps {
  aiResponse: string;
  isAILoading: boolean;
  onExitAI: () => void;
  onClose: () => void;
}

const AIMode: React.FC<AIModeProps> = React.memo(
  ({ aiResponse, isAILoading, onExitAI, onClose }) => {
    const router = useRouter();

    return (
      <div className="flex flex-col h-96 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
        {/* Header */}
        <div
          className="flex items-center gap-2 p-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Icon icon="mingcute:ai-fill" className="w-5 h-5" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            AI Assistant
          </span>
          <button
            onClick={onExitAI}
            className="ml-auto text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            style={{
              color: 'var(--muted-color)',
              fontFamily: 'var(--mono-font)',
            }}
          >
            exit ai mode
          </button>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!aiResponse && !isAILoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--text-color)',
                    fontFamily: 'var(--mono-font)',
                  }}
                >
                  Hi! I can help you find information in the documentation. What would you like to
                  know?
                </p>
              </div>
            </motion.div>
          )}

          {isAILoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {aiResponse && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
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
                        <strong style={{ color: 'var(--text-color)', fontWeight: 600 }}>
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
            </motion.div>
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
    );
  }
);

AIMode.displayName = 'AIMode';

export default AIMode;
