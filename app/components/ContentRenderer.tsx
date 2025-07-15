'use client';

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { documentationTree } from '../data/documentation';

import { FileItem } from './FileTree';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * Props for the ContentRenderer component
 */
type ContentRendererProps = {
  content: string;
  path: string;
};

/**
 * Type for adjacent page navigation
 */
type AdjacentPage = {
  path: string;
  title: string;
};

// Memoized flatten function to avoid recreation
const flattenDocumentationTree = (() => {
  let cachedFlattened: { path: string; name: string; tags?: string[] }[] | null = null;

  return (): { path: string; name: string; tags?: string[] }[] => {
    if (cachedFlattened) return cachedFlattened;

    const flattenedItems: { path: string; name: string; tags?: string[] }[] = [];

    function flattenTree(items: FileItem[]) {
      items.forEach((item) => {
        if (item.type === 'file') {
          flattenedItems.push({
            path: item.path,
            name: item.name.replace(/\.md$/, ''),
            tags: item.tags,
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
 */
const findAdjacentPages = (
  currentPath: string
): { prevPage?: AdjacentPage; nextPage?: AdjacentPage } => {
  const flattenedItems = flattenDocumentationTree();

  // Find the current item index
  const currentIndex = flattenedItems.findIndex((item) => item.path === currentPath);

  // If not found, return empty result
  if (currentIndex === -1) {
    return {};
  }

  // Get previous and next pages
  const prevPage =
    currentIndex > 0
      ? {
          path: flattenedItems[currentIndex - 1].path,
          title: flattenedItems[currentIndex - 1].name,
        }
      : undefined;

  const nextPage =
    currentIndex < flattenedItems.length - 1
      ? {
          path: flattenedItems[currentIndex + 1].path,
          title: flattenedItems[currentIndex + 1].name,
        }
      : undefined;

  return { prevPage, nextPage };
};

/**
 * Find tags for the current page
 */
const findPageTags = (currentPath: string): string[] => {
  const flattenedItems = flattenDocumentationTree();
  const currentItem = flattenedItems.find((item) => item.path === currentPath);
  return currentItem?.tags || [];
};

/**
 * ContentRenderer component that renders markdown content with styling and navigation
 */
export default function ContentRenderer({
  content = '',
  path = '',
}: ContentRendererProps): React.ReactElement {
  const router = useRouter();

  // Memoize adjacent pages to prevent recalculation
  const { prevPage, nextPage } = useMemo(() => findAdjacentPages(path), [path]);

  // Get tags for current page
  const pageTags = useMemo(() => findPageTags(path), [path]);

  // Check if this is a synopsis page to show banner
  const isSynopsisPage = useMemo(() => path.toLowerCase().includes('synopsis'), [path]);

  // Get GitHub branch (default to 'main' if not set)
  const githubBranch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';

  return (
    <div className="w-full h-full overflow-hidden" role="article">
      <div className="flex-1 overflow-y-auto doc-content-scroll h-full">
        <div className="doc-content pt-4 pb-6 px-6 md:pt-6 md:pb-8 md:px-8 lg:pt-8 lg:pb-12 lg:px-12 max-w-4xl mx-auto">
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

          {/* Tags display */}
          {pageTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              {pageTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    opacity: 0.8,
                    fontFamily: 'var(--mono-font)',
                  }}
                >
                  <Icon icon="mingcute:tag-line" className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Main content area - use new MarkdownRenderer */}
          <MarkdownRenderer content={content} path={path} />

          {/* Navigation between pages */}
          {(prevPage || nextPage) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-800/50"
            >
              <div className="pagination-links">
                {prevPage ? (
                  <button
                    onClick={() => router.push(`/docs/${prevPage.path}`)}
                    className="nav-button text-left p-4 rounded-lg transition-opacity hover:opacity-70"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">← Previous</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {prevPage.title}
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}

                {nextPage && (
                  <button
                    onClick={() => router.push(`/docs/${nextPage.path}`)}
                    className="nav-button text-right p-4 rounded-lg transition-opacity hover:opacity-70"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next →</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {nextPage.title}
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Contribution Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-800/50"
          >
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {/* Edit this page on GitHub */}
              {process.env.NEXT_PUBLIC_GITHUB_URL && (
                <a
                  href={`${process.env.NEXT_PUBLIC_GITHUB_URL}/edit/${githubBranch}/app/docs/content/${path}.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  style={{ fontFamily: 'var(--mono-font)' }}
                >
                  <Icon icon="mingcute:edit-2-line" className="w-3.5 h-3.5" />
                  <span>edit</span>
                </a>
              )}

              {/* Report an issue */}
              {process.env.NEXT_PUBLIC_GITHUB_URL && (
                <a
                  href={`${process.env.NEXT_PUBLIC_GITHUB_URL}/issues/new?title=Issue with ${encodeURIComponent(path)}&body=${encodeURIComponent(`I found an issue with the documentation page: ${path}\n\nDescription:\n`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  style={{ fontFamily: 'var(--mono-font)' }}
                >
                  <Icon icon="mingcute:bug-2-line" className="w-3.5 h-3.5" />
                  <span>issue</span>
                </a>
              )}

              {/* View source */}
              {process.env.NEXT_PUBLIC_GITHUB_URL && (
                <a
                  href={`${process.env.NEXT_PUBLIC_GITHUB_URL}/blob/${githubBranch}/app/docs/content/${path}.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  style={{ fontFamily: 'var(--mono-font)' }}
                >
                  <Icon icon="mingcute:code-2-line" className="w-3.5 h-3.5" />
                  <span>source</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
