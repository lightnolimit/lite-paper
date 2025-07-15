'use client';

import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import React, { useState, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import styles from './CodeBlock.module.css';

/**
 * Props for individual code snippets
 */
interface CodeSnippet {
  language: string;
  code: string;
  label?: string; // Optional custom label for the tab
}

/**
 * Props for the CodeBlock component
 */
interface CodeBlockProps {
  snippets: CodeSnippet[];
  title?: string;
  defaultLanguage?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * Enhanced CodeBlock component with language tabs and copy functionality
 *
 * Features:
 * - Multiple language support with tabs
 * - Copy to clipboard functionality
 * - Modern, theme-aware styling
 * - Smooth animations
 * - Syntax highlighting preservation
 *
 * @param {CodeBlockProps} props - Component props
 * @returns {React.ReactElement} Rendered CodeBlock component
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  snippets = [],
  title,
  defaultLanguage,
  showLineNumbers = true,
  className = '',
}) => {
  const { theme, systemTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing theme-dependent styles
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default active tab based on defaultLanguage
  useEffect(() => {
    if (defaultLanguage && snippets.length > 1) {
      const defaultIndex = snippets.findIndex(
        (snippet) => snippet.language.toLowerCase() === defaultLanguage.toLowerCase()
      );
      if (defaultIndex !== -1) {
        setActiveTab(defaultIndex);
      }
    }
  }, [defaultLanguage, snippets]);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const currentSnippet = snippets[activeTab] || snippets[0];

  const copyToClipboard = useCallback(async () => {
    if (!currentSnippet) return;

    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentSnippet.code;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentSnippet]);

  const getLanguageDisplay = (language: string): string => {
    const languageMap: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      tsx: 'React/TSX',
      jsx: 'React/JSX',
      python: 'Python',
      bash: 'Bash',
      shell: 'Shell',
      json: 'JSON',
      yaml: 'YAML',
      markdown: 'Markdown',
      css: 'CSS',
      html: 'HTML',
      sql: 'SQL',
      solidity: 'Solidity',
      rust: 'Rust',
      go: 'Go',
      java: 'Java',
      php: 'PHP',
      ruby: 'Ruby',
      dart: 'Dart',
      kotlin: 'Kotlin',
      swift: 'Swift',
    };
    return languageMap[language.toLowerCase()] || language.toUpperCase();
  };

  if (!snippets.length) {
    return null;
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`${styles.codeBlockContainer} ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.codeBlockContainer} ${className}`}>
      {/* Title */}
      {title && (
        <div className={styles.codeBlockTitle}>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h4>
        </div>
      )}

      {/* Language tabs */}
      {snippets.length > 1 && (
        <div className={styles.codeBlockTabs}>
          {snippets.map((snippet, index) => (
            <button
              key={index}
              className={`${styles.codeBlockTab} ${activeTab === index ? styles.codeBlockTabActive : ''}`}
              onClick={() => setActiveTab(index)}
              type="button"
            >
              {snippet.label || getLanguageDisplay(snippet.language)}
            </button>
          ))}
        </div>
      )}

      {/* Code content */}
      <div className={styles.codeBlockWrapper}>
        {/* Header with language and copy button */}
        <div className={styles.codeBlockHeader}>
          <span className={styles.codeBlockLanguage}>
            {currentSnippet.label || getLanguageDisplay(currentSnippet.language)}
          </span>
          <button
            className={styles.codeBlockCopyBtn}
            onClick={copyToClipboard}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            type="button"
          >
            {copied ? (
              <>
                <Icon icon="mingcute:check-line" className="w-4 h-4" />
                <span className="text-xs font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Icon icon="mingcute:copy-line" className="w-4 h-4" />
                <span className="text-xs font-medium">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code content with animation */}
        <div className={styles.codeBlockContent}>
          <SyntaxHighlighter
            language={currentSnippet.language}
            style={isDark ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontSize: '0.875rem',
              lineHeight: '1.6',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'var(--mono-font)',
                fontSize: 'inherit',
              },
            }}
          >
            {currentSnippet.code.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
