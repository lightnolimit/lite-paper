'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { marked } from 'marked';
import { documentationTree } from '../data/documentation';
import { FileItem } from './FileTree';

type ContentRendererProps = {
  content: string;
  path: string;
};

type AdjacentPage = {
  path: string;
  title: string;
};

/**
 * Apply CSS classes to various HTML elements in the rendered markdown
 */
const applyMarkdownStyles = (html: string): string => {
  const styleMap = {
    code: '<code class="font-mono bg-opacity-10 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-20 px-1 py-0.5 rounded"',
    table: '<table class="w-full border-collapse my-4">',
    th: '<th class="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">',
    td: '<td class="border border-gray-300 dark:border-gray-700 px-4 py-2">',
    blockquote: '<blockquote class="border-l-4 border-primary-color pl-4 italic text-gray-600 dark:text-gray-400 my-4">',
    h1: '<h1$1 class="font-title text-3xl mb-6 mt-8">',
    h2: '<h2$1 class="font-title text-2xl mb-4 mt-6">',
    h3: '<h3$1 class="font-title text-xl mb-3 mt-5">',
    h4: '<h4$1 class="font-title text-lg mb-2 mt-4">',
    h5: '<h5$1 class="font-title text-base mb-2 mt-3">',
    h6: '<h6$1 class="font-title text-sm mb-2 mt-3">',
    p: '<p$1 class="font-body mb-4">',
    a: '<a$1 class="text-primary-color hover:underline">',
    ul: '<ul$1 class="list-disc pl-6 mb-4">',
    ol: '<ol$1 class="list-decimal pl-6 mb-4">',
    li: '<li$1 class="mb-1">',
    hr: '<hr class="my-8 border-t border-gray-300 dark:border-gray-700">',
  };

  // Style for code blocks (but not wallet addresses)
  html = html.replace(/<code(?! class="wallet-address")/g, styleMap.code);
  
  // Apply styling for tables
  html = html.replace(/<table>/g, styleMap.table);
  html = html.replace(/<th>/g, styleMap.th);
  html = html.replace(/<td>/g, styleMap.td);
  
  // Style for blockquotes
  html = html.replace(/<blockquote>/g, styleMap.blockquote);
  
  // Style for regular headings (not icon headings)
  html = html.replace(/<h1(?! class="icon-heading")([^>]*)>/g, styleMap.h1)
    .replace(/<h2(?! class="icon-heading")([^>]*)>/g, styleMap.h2)
    .replace(/<h3(?! class="icon-heading")([^>]*)>/g, styleMap.h3)
    .replace(/<h4(?! class="icon-heading")([^>]*)>/g, styleMap.h4)
    .replace(/<h5(?! class="icon-heading")([^>]*)>/g, styleMap.h5)
    .replace(/<h6(?! class="icon-heading")([^>]*)>/g, styleMap.h6);
  
  // Style for paragraphs
  html = html.replace(/<p([^>]*)>/g, styleMap.p);
  
  // Style for links
  html = html.replace(/<a(?! class="social)([^>]*)>/g, styleMap.a);
  
  // Style for lists
  html = html.replace(/<ul([^>]*)>/g, styleMap.ul)
    .replace(/<ol([^>]*)>/g, styleMap.ol)
    .replace(/<li([^>]*)>/g, styleMap.li);

  // Add styling for horizontal rules
  html = html.replace(/<hr>/g, styleMap.hr);

  return html;
};

/**
 * Function to find the previous and next pages based on the current path
 */
const findAdjacentPages = (currentPath: string): { prevPage?: AdjacentPage, nextPage?: AdjacentPage } => {
  // Flatten the documentation tree to get all file items in order
  const flattenedItems: { path: string, name: string }[] = [];
  
  function flattenTree(items: FileItem[]) {
    items.forEach(item => {
      if (item.type === 'file') {
        flattenedItems.push({ 
          path: item.path,
          name: item.name.replace(/\.md$/, '')
        });
      } else if (item.type === 'directory' && item.children) {
        flattenTree(item.children);
      }
    });
  }
  
  flattenTree(documentationTree);
  
  // Find the current item index
  const currentIndex = flattenedItems.findIndex(item => item.path === currentPath);
  
  // If not found, return empty result
  if (currentIndex === -1) {
    return {};
  }
  
  // Get previous and next pages
  const prevPage = currentIndex > 0 
    ? { 
        path: flattenedItems[currentIndex - 1].path,
        title: flattenedItems[currentIndex - 1].name
      } 
    : undefined;
  
  const nextPage = currentIndex < flattenedItems.length - 1 
    ? { 
        path: flattenedItems[currentIndex + 1].path,
        title: flattenedItems[currentIndex + 1].name
      } 
    : undefined;
  
  return { prevPage, nextPage };
};

/**
 * Process DOM elements after content has been rendered
 */
const useProcessDomElements = (contentRef: React.RefObject<HTMLDivElement>, content: string): void => {
  useEffect(() => {
    const currentRef = contentRef.current;
    if (!currentRef) return;

    // Process links for accessibility
    const processLinks = () => {
      const links = currentRef.querySelectorAll('a');
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
    };

    // Process wallet address elements
    const processWalletAddresses = () => {
      const walletAddresses = currentRef.querySelectorAll('.wallet-address');
      walletAddresses.forEach(walletElement => {
        const address = walletElement.getAttribute('data-address');
        if (!address) return;
        
        // Check if button already exists to prevent duplicates
        if (walletElement.querySelector('.copy-button')) return;

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="16" height="16" />`;
        copyButton.setAttribute('aria-label', 'Copy to clipboard');
        copyButton.setAttribute('title', 'Copy to clipboard');
        
        // Add click handler
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(address).then(() => {
            // Success feedback
            copyButton.innerHTML = `<img src="/assets/icons/pixel-check-circle-solid.svg" alt="Copied" width="16" height="16" />`;
            setTimeout(() => {
              copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="16" height="16" />`;
            }, 1500);
          });
        });
        
        // Add button after the wallet address
        walletElement.appendChild(copyButton);
      });
    };

    processLinks();
    processWalletAddresses();
    
    // Cleanup function
    return () => {
      // Cleanup event listeners if needed
      const links = currentRef.querySelectorAll('a');
      links.forEach(link => {
        link.removeEventListener('keydown', () => {});
      });
    };
  }, [content, contentRef]); // Re-run when content changes
};

export default function ContentRenderer({ content = '', path = '' }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get previous and next pages using useMemo
  const { prevPage, nextPage } = useMemo(() => findAdjacentPages(path), [path]);
  
  // Process DOM elements after render
  useProcessDomElements(contentRef, content);
  
  // Render markdown with memoization
  const contentHtml = useMemo(() => {
    if (!content) return '<p>No content available.</p>';

    try {
      // Configure marked to handle markdown properly
      marked.setOptions({
        gfm: true,
        breaks: true,
        pedantic: false
      });

      // Parse markdown into HTML and apply styling
      const html = marked.parse(content) as string;
      return applyMarkdownStyles(html);
    } catch (error: unknown) {
      console.error('Error rendering markdown:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `<p>Error rendering content: ${errorMessage}</p>`;
    }
  }, [content]);
  
  // Check if this is a synopsis page to show banner
  const isSynopsisPage = path.toLowerCase().includes('synopsis');
  
  return (
    <motion.div
      initial={{ opacity: 0.9, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full py-0 md:py-4"
    >
      <div className="doc-card p-6 md:p-8 relative" role="article" style={{ maxWidth: '100%', width: '100%' }}>
        {/* Banner for synopsis pages */}
        {isSynopsisPage && (
          <div className="w-full mb-6 overflow-hidden rounded-lg relative">
            <Image 
              src="/assets/banners/phantasy-banner.png" 
              alt="Phantasy Banner" 
              width={1200} 
              height={400}
              className="w-full object-cover"
              priority
            />
          </div>
        )}
        
        {/* Main content area */}
        <div
          ref={contentRef}
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        {/* Navigation between pages */}
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          {prevPage ? (
            <a href={`/docs/${prevPage.path}`} className="flex items-center text-primary-color hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              {prevPage.title}
            </a>
          ) : (
            <div></div>
          )}
          
          {nextPage && (
            <a href={`/docs/${nextPage.path}`} className="flex items-center text-primary-color hover:underline">
              {nextPage.title}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}