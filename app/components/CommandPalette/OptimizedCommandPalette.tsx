'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { TIMING_CONSTANTS } from '../../constants/ui';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { useTheme } from '../../providers/ThemeProvider';
import { createLogger } from '../../utils/logger';

import AIMode from './AIMode';
import SearchResult, { type SearchResultType } from './SearchResult';
import { useSearchLogic } from './useSearchLogic';

const logger = createLogger('CommandPalette');

interface OptimizedCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OptimizedCommandPalette({ isOpen, onClose }: OptimizedCommandPaletteProps) {
  const router = useRouter();
  const { prefersReducedMotion } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Use optimized search logic
  const { filteredResults } = useSearchLogic(query, setIsAIMode);

  // Debounced input handler to improve performance
  const handleInputChange = useDebouncedCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  }, 100);

  // Handle AI query submission
  const handleAIQuery = useCallback(async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsAILoading(true);
    try {
      const { searchAndAnswer } = await import('../../lib/clientRAG');
      const response = await searchAndAnswer(queryText.trim());

      setAIResponse(response.answer);

      // Add sources if available
      if (response.sources && response.sources.length > 0) {
        setAIResponse((prev) => {
          let answer = prev;
          answer += '\n\n**Sources:**\n';
          response.sources.forEach((source) => {
            answer += `- [${source.title}](${source.path})\n`;
          });
          return answer;
        });
      }

      setQuery('');
    } catch (error) {
      logger.error('AI search error:', error);
      setAIResponse(
        'I apologize, but I encountered an error while searching for information. Please try rephrasing your question or check the documentation directly.'
      );
    } finally {
      setIsAILoading(false);
    }
  }, []);

  // Optimized selection handler
  const handleSelect = useCallback(
    (result: SearchResultType) => {
      if (result.type === 'faq' && result.answer) {
        setIsAIMode(true);
        setAIResponse(result.answer);
        setQuery('');
      } else if (result.action) {
        result.action();
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

  // Reset state when palette opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setIsAIMode(false);
      setAIResponse('');
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), TIMING_CONSTANTS.autoFocusDelay);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [filteredResults.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const commandPaletteElement = document.querySelector('[data-command-palette]');
      if (!commandPaletteElement || !commandPaletteElement.contains(document.activeElement)) {
        return;
      }

      if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
        if (isAIMode) {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            setIsAIMode(false);
            setQuery('');
            setAIResponse('');
            return;
          }
          if (e.key === 'Enter') {
            return; // Let input handle it
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

      // Handle shortcuts
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
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      defaultValue={query}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={async (e) => {
                        if (isAIMode && e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          await handleAIQuery(e.currentTarget.value.trim());
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
                    <AIMode
                      aiResponse={aiResponse}
                      isAILoading={isAILoading}
                      onExitAI={() => {
                        setIsAIMode(false);
                        setQuery('');
                        setAIResponse('');
                      }}
                      onClose={onClose}
                    />
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => (
                      <SearchResult
                        key={result.path}
                        result={result}
                        index={index}
                        isSelected={index === selectedIndex}
                        onSelect={handleSelect}
                        onMouseEnter={setSelectedIndex}
                      />
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
