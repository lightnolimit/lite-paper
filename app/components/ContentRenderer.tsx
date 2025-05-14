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
  const renderMarkdown = (text: string) => {
    // Process the content step by step
    let html = text;
    
    // Handle headers
    html = html.replace(/^# (.*$)/gim, '<h1 class="font-yeezy font-heavy text-2xl font-bold my-4" tabindex="0">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="font-yeezy font-bold text-xl font-bold my-3" tabindex="0">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="font-yeezy text-lg font-medium my-2" tabindex="0">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="font-yeezy text-md font-medium my-2" tabindex="0">$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5 class="font-yeezy text-sm font-medium my-2" tabindex="0">$1</h5>');
    
    // Handle code blocks first
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre class="p-4 rounded-md my-4 overflow-x-auto" style="background-color: var(--card-color); border: 1px solid var(--border-color);" tabindex="0"><code>${code}</code></pre>`;
    });
    
    // Handle inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 rounded" style="background-color: var(--card-color); border: 1px solid var(--border-color);">$1</code>');
    
    // Process links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, 
      '<a class="font-yeezy text-primary-color hover:underline focus:outline-none focus:ring-2 focus:ring-primary-color" style="color: var(--primary-color);" href="$2">$1</a>');
    
    // Process styling
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process lists
    html = html.replace(/^\s*-\s+(.*)/gim, '<li class="font-yeezy ml-4">$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*)/gim, '<li class="font-yeezy ml-4">$1</li>');
    
    // Wrap consecutive <li> elements with <ul> or <ol>
    html = html.replace(/(<li.*?>.*?<\/li>)(\s*\n\s*)?(<li)/g, '$1$3');
    html = html.replace(/(<li[^>]*>.*?<\/li>(\s*\n\s*)?)+/g, '<ul class="list-disc pl-5 my-3">$&</ul>');
    
    // Process paragraphs (lines that aren't already wrapped in HTML tags)
    const paragraphLines = html.split('\n');
    let processedHtml = '';
    
    for (let line of paragraphLines) {
      line = line.trim();
      if (line.length === 0) {
        processedHtml += '\n';
        continue;
      }
      
      // Skip lines that are already HTML elements or inside HTML blocks
      if (line.startsWith('<') && !line.startsWith('</')) {
        processedHtml += line + '\n';
        continue;
      }
      
      // Wrap remaining text in paragraphs
      processedHtml += `<p class="font-yeezy font-light my-2">${line}</p>\n`;
    }
    
    return processedHtml;
  };
  
  const contentHtml = renderMarkdown(content);
  
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
              href={`/docs/introduction/synopsis`}
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
                <span className="block text-xs opacity-75">Home</span>
                <span className="block font-medium">Introduction</span>
              </span>
            </a>
            
            <a 
              href={`/docs/prelude-phantasy/synopsis`}
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
                <span className="block font-medium">Phantasy Platform</span>
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