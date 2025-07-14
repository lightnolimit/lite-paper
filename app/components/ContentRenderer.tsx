'use client';

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
  let cachedFlattened: { path: string; name: string }[] | null = null;

  return (): { path: string; name: string }[] => {
    if (cachedFlattened) return cachedFlattened;

    const flattenedItems: { path: string; name: string }[] = [];

    function flattenTree(items: FileItem[]) {
      items.forEach((item) => {
        if (item.type === 'file') {
          flattenedItems.push({
            path: item.path,
            name: item.name.replace(/\.md$/, ''),
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
 * ContentRenderer component that renders markdown content with styling and navigation
 */
export default function ContentRenderer({
  content = '',
  path = '',
}: ContentRendererProps): React.ReactElement {
  const router = useRouter();

  // Memoize adjacent pages to prevent recalculation
  const { prevPage, nextPage } = useMemo(() => findAdjacentPages(path), [path]);

  // Check if this is a synopsis page to show banner
  const isSynopsisPage = useMemo(() => path.toLowerCase().includes('synopsis'), [path]);

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full h-full p-4 md:p-6 lg:p-8"
    >
      <div className="doc-card h-full flex flex-col overflow-hidden" role="article">
        <div className="flex-1 overflow-y-auto doc-content-scroll">
          <div className="p-6 md:p-8">
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

            {/* Main content area - use new MarkdownRenderer */}
            <MarkdownRenderer content={content} path={path} />

            {/* Navigation between pages */}
            {(prevPage || nextPage) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-12 pt-8 border-t border-unified"
              >
                <div className="pagination-links">
                  {prevPage ? (
                    <motion.button
                      onClick={() => router.push(`/docs/${prevPage.path}`)}
                      className="nav-button text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        ← Previous
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prevPage.title}
                      </div>
                    </motion.button>
                  ) : (
                    <div></div>
                  )}

                  {nextPage && (
                    <motion.button
                      onClick={() => router.push(`/docs/${nextPage.path}`)}
                      className="nav-button text-right p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next →</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {nextPage.title}
                      </div>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
