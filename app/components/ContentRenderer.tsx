'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { marked } from 'marked';
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

/**
 * Find the previous and next pages based on the current path
 * 
 * @param {string} currentPath - The current document path
 * @returns {Object} Object containing previous and next page information
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
 * 
 * @param {React.RefObject<HTMLDivElement>} contentRef - Reference to the content container
 * @param {string} content - The markdown content
 */
const useProcessDomElements = (contentRef: React.RefObject<HTMLDivElement | null>, content: string): void => {
  useEffect(() => {
    componentLogger.debug('ContentRenderer useEffect running');
    const currentRef = contentRef.current;
    if (!currentRef) {
      componentLogger.debug('No content ref found, skipping DOM processing');
      return;
    }

    componentLogger.debug('Scheduling DOM processing');
    
    // Run with a slight delay to ensure the DOM is fully rendered
    setTimeout(() => {
      // Process links and wallet addresses
      componentLogger.debug('Processing links');
      processLinks(currentRef as HTMLElement);
      
      componentLogger.debug('Processing wallet addresses');
      processWalletAddresses(currentRef as HTMLElement);
      
      componentLogger.debug('DOM processing complete');
    }, 100);
    
    // Cleanup function
    return () => {
      componentLogger.debug('Running cleanup function for ContentRenderer');
      // Remove event listeners from links if needed
      const links = currentRef.querySelectorAll('a');
      links.forEach(link => {
        link.removeEventListener('keydown', () => {});
      });
    };
  }, [content, contentRef]); // Re-run when content changes
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