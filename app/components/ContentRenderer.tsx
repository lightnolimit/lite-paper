'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
type ContentRendererProps = {
  content: string;
  path: string;
};

export default function ContentRenderer({ content, path }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Process links after render to add tabindex and other accessibility attributes
  useEffect(() => {
    if (contentRef.current) {
      // Find all links in the rendered content
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        // Add tabindex to make links focusable in tab order
        link.setAttribute('tabindex', '0');
        
        // Add keyboard event listener for Enter key
        link.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            link.click();
          }
        });
      });
    }
  }, [content]);
  
  // Basic markdown rendering (you would use a proper markdown library in a real app)
  const contentHtml = content
    // Headers with Yeezy font
    .replace(/^# (.*$)/gim, '<h1 class="font-yeezy font-heavy text-2xl font-bold my-4" tabindex="0">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="font-yeezy font-bold text-xl font-bold my-3" tabindex="0">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="font-yeezy text-lg font-medium my-2" tabindex="0">$1</h3>')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h|ul|ol|li|blockquote|code|hr)/gim.test(m) ? m : '<p class="font-yeezy font-light my-2">$2</p>';
    })
    // Links - now the tabindex will be added by JavaScript after render
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a class="font-yeezy text-primary-color hover:underline focus:outline-none focus:ring-2 focus:ring-primary-color" style="color: var(--primary-color);" href="$2">$1</a>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="p-4 rounded-md my-4 overflow-x-auto" style="background-color: var(--card-color); border: 1px solid var(--border-color);" tabindex="0"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1 rounded" style="background-color: var(--card-color); border: 1px solid var(--border-color);">$1</code>');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full py-0 md:py-4"
    >
      <div className="doc-card p-6 md:p-8 relative" role="article" style={{ maxWidth: '100%', width: '100%' }}>
        <div 
          ref={contentRef}
          className="prose max-w-none font-yeezy"
          style={{ color: 'var(--text-color)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        {/* Document footer with breadcrumbs and navigation */}
        <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {/* Breadcrumbs */}
          <div className="text-sm mb-6 flex flex-wrap items-center font-yeezy font-light" style={{ color: 'var(--muted-color)' }}>
            <span className="mr-2 font-medium">Path:</span>
            {path.split('/').map((part, index, array) => (
              <React.Fragment key={index}>
                <span className="px-1">{part}</span>
                {index < array.length - 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Pagination links - prev/next */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <a 
              href={`/docs/project-overview/introduction`}
              className="font-yeezy flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ 
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              }}
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>
                <span className="block text-xs opacity-75">Previous</span>
                <span className="block font-medium">Introduction</span>
              </span>
            </a>
            
            <a 
              href={`/docs/core-mechanisms/tokenization`}
              className="font-yeezy flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ 
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              }}
              tabIndex={0}
            >
              <span>
                <span className="block text-xs opacity-75">Next</span>
                <span className="block font-medium">Tokenization</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 