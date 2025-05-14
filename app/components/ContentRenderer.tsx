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
  
  // Process links and add wallet copy buttons after render
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

      // Add copy buttons to wallet addresses
      const walletAddresses = contentRef.current.querySelectorAll('.wallet-address');
      walletAddresses.forEach(walletElement => {
        const address = walletElement.getAttribute('data-address');
        if (!address) return;

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
        walletElement.appendChild(document.createTextNode(' '));
        walletElement.appendChild(copyButton);
      });
    }
  }, [content]);
  
  // Basic markdown rendering
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p>No content available.</p>';

    try {
      // Configure marked to handle markdown properly
      marked.setOptions({
        gfm: true,
        breaks: true,
        pedantic: false
      });

      // Parse markdown into HTML
      let html = marked.parse(text) as string;
      
      // Apply basic styling for images
      html = html.replace(/<img([^>]*)>/g, '<img$1 class="rounded-lg max-w-full my-4" style="max-height: 300px; object-fit: contain;" />');
      
      // Convert {.wallet-address data-address="xxx"} to proper attribute
      html = html.replace(/\{\.wallet-address data-address="([^"]+)"\}/g, 'class="wallet-address" data-address="$1"');
      
      // Style for code blocks
      html = html.replace(/<code>/g, '<code class="font-mono bg-opacity-10 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-20 px-1 py-0.5 rounded">');
      
      // Apply styling for tables
      html = html.replace(/<table>/g, '<table class="w-full border-collapse my-4">');
      html = html.replace(/<th>/g, '<th class="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">');
      html = html.replace(/<td>/g, '<td class="border border-gray-300 dark:border-gray-700 px-4 py-2">');
      
      // Style for blockquotes
      html = html.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary-color pl-4 italic text-gray-600 dark:text-gray-400 my-4">');
      
      // Style headings
      html = html.replace(/<h1([^>]*)>/g, '<h1$1 class="font-title text-3xl mb-6 mt-8">')
        .replace(/<h2([^>]*)>/g, '<h2$1 class="font-title text-2xl mb-4 mt-6">')
        .replace(/<h3([^>]*)>/g, '<h3$1 class="font-title text-xl mb-3 mt-5">')
        .replace(/<h4([^>]*)>/g, '<h4$1 class="font-title text-lg mb-2 mt-4">')
        .replace(/<h5([^>]*)>/g, '<h5$1 class="font-title text-base mb-2 mt-3">')
        .replace(/<h6([^>]*)>/g, '<h6$1 class="font-title text-sm mb-2 mt-3">');
      
      // Style for paragraphs
      html = html.replace(/<p([^>]*)>/g, '<p$1 class="font-body mb-4">');
      
      // Style for links
      html = html.replace(/<a([^>]*)>/g, '<a$1 class="text-primary-color hover:underline">');
      
      // Style for lists
      html = html.replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc pl-6 mb-4">')
        .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal pl-6 mb-4">')
        .replace(/<li([^>]*)>/g, '<li$1 class="mb-1">');

      // Add styling for horizontal rules
      html = html.replace(/<hr>/g, '<hr class="my-8 border-t border-gray-300 dark:border-gray-700">');

      return html;
    } catch (error: unknown) {
      console.error('Error rendering markdown:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `<p>Error rendering content: ${errorMessage}</p>`;
    }
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