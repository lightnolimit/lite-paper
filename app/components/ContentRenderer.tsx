'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import { documentationTree } from '../data/documentation';
import { FileItem } from './FileTree';
import { applyMarkdownStyles, processLinks, processWalletAddresses } from '../utils/contentProcessor';
import logger from '../utils/logger';

// Create a component-specific logger
const componentLogger = logger;

/**
 * Props for the ContentRenderer component
 * 
 * @typedef {Object} ContentRendererProps
 * @property {string} content - The markdown content to render
 * @property {string} path - The current document path
 */
type ContentRendererProps = {
  content: string;
  path: string;
};

/**
 * An HTMLAnchorElement with an optional custom property to hold its click handler.
 * This is used to properly remove the event listener during cleanup.
 */
type LinkWithHandler = HTMLAnchorElement & {
  __clickHandler?: (e: MouseEvent) => void;
};

/**
 * Type definition for adjacent page navigation
 * 
 * @typedef {Object} AdjacentPage
 * @property {string} path - The path to the adjacent document
 * @property {string} title - The title of the adjacent document
 */
type AdjacentPage = {
  path: string;
  title: string;
};

// Memoized flatten function to avoid recreation
const flattenDocumentationTree = (() => {
  let cachedFlattened: { path: string, name: string }[] | null = null;
  
  return (): { path: string, name: string }[] => {
    if (cachedFlattened) return cachedFlattened;
    
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
    cachedFlattened = flattenedItems;
    return flattenedItems;
  };
})();

/**
 * Find the previous and next pages based on the current path
 * 
 * @param {string} currentPath - The current document path
 * @returns {Object} Object containing previous and next page information
 */
const findAdjacentPages = (currentPath: string): { prevPage?: AdjacentPage, nextPage?: AdjacentPage } => {
  const flattenedItems = flattenDocumentationTree();
  
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
 * 
 * @param {React.RefObject<HTMLDivElement>} contentRef - Reference to the content container
 * @param {string} content - The markdown content
 */
const useProcessDomElements = (contentRef: React.RefObject<HTMLDivElement | null>, content: string): void => {
  const processDOM = useCallback(() => {
    const currentRef = contentRef.current;
    if (!currentRef) {
      componentLogger.debug('No content ref found, skipping DOM processing');
      return;
    }

    componentLogger.debug('Processing DOM elements');
    
    // Process links and wallet addresses immediately
    processLinks(currentRef as HTMLElement);
    processWalletAddresses(currentRef as HTMLElement);
    
    componentLogger.debug('DOM processing complete');
  }, [contentRef]);

  useEffect(() => {
    // Use requestAnimationFrame for better performance instead of setTimeout
    const rafId = requestAnimationFrame(processDOM);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(rafId);
      
      componentLogger.debug('Running cleanup function for ContentRenderer');
      const currentRef = contentRef.current;
      if (currentRef) {
        // Remove event listeners from links if needed
        const links = currentRef.querySelectorAll('a');
        links.forEach(link => {
          // Only remove our custom keydown listeners
          const clonedLink = link.cloneNode(true);
          link.parentNode?.replaceChild(clonedLink, link);
        });
      }
    };
  }, [processDOM, content]);
};

/**
 * ContentRenderer component that renders markdown content with styling and navigation
 * 
 * Features:
 * - Renders markdown with syntax highlighting
 * - Processes links and wallet addresses for interactivity
 * - Provides navigation between adjacent pages
 * - Adds special styling for synopsis pages
 * 
 * @param {ContentRendererProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export default function ContentRenderer({ content = '', path = '' }: ContentRendererProps): React.ReactElement {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Memoize adjacent pages to prevent recalculation
  const { prevPage, nextPage } = useMemo(() => findAdjacentPages(path), [path]);
  
  // Process DOM elements after render
  useProcessDomElements(contentRef, content);
  
  // Setup content processing and DOM manipulation
  // We disable the ref exhaustive-deps warning because we properly handle the ref 
  // by storing its value at the beginning of the effect as recommended by React team
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Store current ref value for cleanup, as suggested by React's exhaustive-deps lint rule.
    // This prevents issues where the ref might be nullified before the cleanup function runs.
    const currentContentRef = contentRef.current;

    if (!content || !currentContentRef) return;
    
    // Apply content processing immediately
    const processContent = async () => {
      try {
        // Process markdown content with existing utilities
        const rawHtml = await marked(content);
        const styledHtml = applyMarkdownStyles(rawHtml);
        
        // Sanitize the HTML to prevent XSS attacks
        const sanitizedHtml = DOMPurify.sanitize(styledHtml, {
          // Allow safe HTML tags and attributes for documentation
          ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
            'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'a', 'strong', 'em', 'u', 'del', 'mark',
            'img', 'div', 'span'
          ],
          ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'id',
            'data-address', 'data-processed', 'data-copy-processed',
            'tabindex', 'aria-label', 'width', 'height'
          ],
          ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|\/docs\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        });
        
        // Always use the stored ref value, not the current ref
        currentContentRef.innerHTML = sanitizedHtml;
        
        // Add click handlers for internal links
        const links = currentContentRef.querySelectorAll('a[href^="/docs/"]');
        links.forEach(rawLink => {
          const link = rawLink as LinkWithHandler;
          const href = link.getAttribute('href');
          if (href) {
            const clickHandler = (e: MouseEvent) => {
              e.preventDefault();
              router.push(href);
            };
            link.addEventListener('click', clickHandler as EventListener);
            
            // Store handler for cleanup
            link.__clickHandler = clickHandler;
          }
        });
      } catch (error) {
        console.error('Error processing markdown content:', error);
        // Always use the stored ref value
        currentContentRef.innerHTML = '<p>Error loading content. Please try again.</p>';
      }
    };
    
    processContent();
    
    // Cleanup function using the stored ref value (not contentRef.current)
    return () => {
      if (currentContentRef) {
        const links = currentContentRef.querySelectorAll('a[href^="/docs/"]');
        links.forEach(rawLink => {
          const link = rawLink as LinkWithHandler;
          // Properly remove the exact event listener we added
          const handler = link.__clickHandler;
          if (handler) {
            link.removeEventListener('click', handler as EventListener);
          }
        });
      }
    };
  }, [content, path, router]); // contentRef is a stable ref and doesn't need to be in dependencies
  /* eslint-enable react-hooks/exhaustive-deps */
  
  // Render markdown with memoization
  const contentHtml = useMemo(() => {
    if (!content) return '<p>No content available.</p>';

    try {
      // Configure marked to handle markdown properly
      marked.setOptions({
        gfm: true,
        breaks: false,
        pedantic: false
      });

      // Parse markdown into HTML and apply styling
      const html = marked.parse(content) as string;
      return applyMarkdownStyles(html);
    } catch (error: unknown) {
      componentLogger.error('Error rendering markdown:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `<p>Error rendering content: ${errorMessage}</p>`;
    }
  }, [content]);
  
  // Check if this is a synopsis page to show banner
  const isSynopsisPage = useMemo(() => path.toLowerCase().includes('synopsis'), [path]);
  
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