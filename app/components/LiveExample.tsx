'use client';

import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';

interface LiveExampleProps {
  code: string;
  language: string;
  showCode?: boolean;
}

const LiveExample: React.FC<LiveExampleProps> = ({ code, language, showCode = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCodeView, setShowCodeView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      setError(null);

      // Clear previous content
      containerRef.current.innerHTML = '';

      if (language === 'html') {
        // For HTML examples, render directly
        containerRef.current.innerHTML = code;

        // Process any wallet addresses or other interactive elements
        import('../utils/contentProcessor').then(({ processWalletAddresses }) => {
          if (containerRef.current) {
            processWalletAddresses(containerRef.current);
          }
        });
      } else if (language === 'css') {
        // For CSS examples, create a style element and apply to example content
        const styleId = `live-example-${Math.random().toString(36).substr(2, 9)}`;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = code;
        document.head.appendChild(styleElement);

        // Create example elements based on CSS selectors
        const exampleContent = createExampleFromCSS(code);
        containerRef.current.innerHTML = exampleContent;

        // Cleanup
        return () => {
          const style = document.getElementById(styleId);
          if (style) {
            style.remove();
          }
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render example');
    }
  }, [code, language]);

  // Helper to create example content from CSS
  const createExampleFromCSS = (css: string): string => {
    // Extract class names from CSS
    const classMatches = css.match(/\.([\w-]+)/g);
    if (!classMatches) return '<div>No CSS classes found to demonstrate</div>';

    // Create example elements for each unique class
    const uniqueClasses = [...new Set(classMatches.map((c) => c.substring(1)))];

    return uniqueClasses
      .map((className) => {
        // Special handling for specific component types
        if (className.includes('notification')) {
          return `<div class="${className}">
          <strong>Example:</strong> This is a ${className.replace('-', ' ')}
        </div>`;
        } else if (className.includes('wallet-address')) {
          return `<code class="${className}" data-address="0x1234...5678">
          0x1234...5678
        </code>`;
        } else if (className.includes('button')) {
          return `<button class="${className}">Example Button</button>`;
        } else if (className.includes('font-')) {
          return `<div class="${className}">Example text with ${className}</div>`;
        } else {
          return `<div class="${className}">Example ${className.replace(/-/g, ' ')}</div>`;
        }
      })
      .join('\n');
  };

  if (error) {
    return (
      <div className="notification notification-error mb-4">
        <Icon icon="mingcute:close-circle-fill" className="w-5 h-5" />
        <div>
          <strong>Render Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="live-example-container mb-6">
      {showCode && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono text-muted-color">Live Example</span>
          <button
            onClick={() => setShowCodeView(!showCodeView)}
            className="text-sm text-primary-color hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <Icon
              icon={showCodeView ? 'mingcute:eye-close-line' : 'mingcute:code-line'}
              className="w-4 h-4"
            />
            {showCodeView ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      )}

      <div className="example-preview p-4 bg-card-color border border-border-unified rounded-lg mb-2">
        <div ref={containerRef} />
      </div>

      {showCode && showCodeView && (
        <div className="example-code">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default LiveExample;
