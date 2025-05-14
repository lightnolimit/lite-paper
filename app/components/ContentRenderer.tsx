'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { marked } from 'marked';
import { documentationTree } from '../data/documentation';
import { FileItem } from './FileTree';

type ContentRendererProps = {
  content: string;
  path: string;
};

// Function to find the previous and next pages based on the current path
const findAdjacentPages = (currentPath: string): { prevPage?: { path: string, title: string }, nextPage?: { path: string, title: string } } => {
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
}

export default function ContentRenderer({ content = '', path = '' }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get previous and next pages using useMemo to avoid re-calculating on every render
  const { prevPage, nextPage } = React.useMemo(() => findAdjacentPages(path), [path]);
  
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
  
  // Basic markdown rendering
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p>No content available.</p>';

    // Configure marked to handle HTML properly
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    // Process HTML blocks separately before passing to marked
    // This regex finds HTML div blocks and replaces them with placeholders
    const htmlBlocks: string[] = [];
    const processedText = text.replace(/<div[\s\S]*?<\/div>/g, (match) => {
      htmlBlocks.push(match);
      return `___HTML_BLOCK_${htmlBlocks.length - 1}___`;
    });

    // Parse with marked
    let parsedHtml = marked.parse(processedText) as string;

    // Restore HTML blocks
    htmlBlocks.forEach((block, index) => {
      parsedHtml = parsedHtml.replace(`___HTML_BLOCK_${index}___`, block);
    });

    // Process notification blocks to add icons
    parsedHtml = parsedHtml.replace(/<div class="notification notification-info">/g,
      '<div class="notification notification-info"><img src="/assets/icons/pixel-info-circle-solid.svg" alt="Info" width="24" height="24" class="inline-block mr-2" />');
    
    parsedHtml = parsedHtml.replace(/<div class="notification notification-warning">/g,
      '<div class="notification notification-warning"><img src="/assets/icons/pixel-exclamation-triangle-solid.svg" alt="Warning" width="24" height="24" class="inline-block mr-2" />');
    
    parsedHtml = parsedHtml.replace(/<div class="notification notification-error">/g,
      '<div class="notification notification-error"><img src="/assets/icons/pixel-times-circle-solid.svg" alt="Error" width="24" height="24" class="inline-block mr-2" />');
    
    parsedHtml = parsedHtml.replace(/<div class="notification notification-success">/g,
      '<div class="notification notification-success"><img src="/assets/icons/pixel-check-circle-solid.svg" alt="Success" width="24" height="24" class="inline-block mr-2" />');

    // Apply font styles to headings and paragraphs
    parsedHtml = parsedHtml
      .replace(/<h1([^>]*)>/g, '<h1$1 class="font-title text-3xl mb-6 mt-8">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="font-title text-2xl mb-4 mt-6">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="font-title text-xl mb-3 mt-5">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="font-title text-lg mb-2 mt-4">')
      .replace(/<h5([^>]*)>/g, '<h5$1 class="font-title text-base mb-2 mt-3">')
      .replace(/<h6([^>]*)>/g, '<h6$1 class="font-title text-sm mb-2 mt-3">')
      .replace(/<p([^>]*)>/g, '<p$1 class="font-body mb-4">')
      .replace(/<a([^>]*)>/g, '<a$1 class="text-primary-color hover:underline">');

    return parsedHtml;
  };

  const contentHtml = renderMarkdown(content);
  
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
              className="w-full h-auto"
              priority
            />
          </div>
        )}
        
        {isSynopsisPage && (
          <div className="bg-gradient-to-r from-primary-color to-secondary-color text-white p-4 rounded-lg mb-8">
            <h2 className="font-title text-xl mb-2">Synopsis</h2>
            <p className="font-body">This document provides an overview of the key concepts and features.</p>
          </div>
        )}
        
        <div 
          ref={contentRef}
          className="max-w-none font-body"
          style={{ color: 'var(--text-color)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        {/* Document footer with breadcrumbs and navigation */}
        <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {/* Breadcrumbs */}
          <div className="text-sm mb-6 flex flex-wrap items-center font-title" style={{ color: 'var(--muted-color)' }}>
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
          <div className="pagination-links mt-4 flex justify-between">
            {prevPage ? (
              <a 
                href={`/docs/${prevPage.path}`}
                className="font-title flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 nav-button"
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
                  <span className="block font-medium">{prevPage.title}</span>
                </span>
              </a>
            ) : (
              <span className="invisible"></span> /* Empty placeholder to maintain flexbox spacing */
            )}
            
            {nextPage ? (
              <a 
                href={`/docs/${nextPage.path}`}
                className="font-title flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 nav-button ml-auto"
                style={{ 
                  backgroundColor: 'var(--card-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }}
                tabIndex={0}
              >
                <span className="text-right">
                  <span className="block text-xs opacity-75">Next</span>
                  <span className="block font-medium">{nextPage.title}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            ) : (
              <span className="invisible"></span> /* Empty placeholder to maintain flexbox spacing */
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 