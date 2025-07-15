'use client';

import { useEffect, useState } from 'react';

import {
  getDocumentationContent,
  getAvailableDocumentationPaths,
  searchDocumentation,
  getDocumentationStats,
} from '../utils/docs-client';
import { createLogger } from '../utils/logger';

const logger = createLogger('TestDocs');

export default function TestDocsPage() {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    Array<{ path: string; content: string; excerpt: string }>
  >([]);
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalContent: number;
    generated: string;
  } | null>(null);

  // Load available paths on component mount
  useEffect(() => {
    const loadPaths = async () => {
      try {
        const paths = await getAvailableDocumentationPaths();
        setAvailablePaths(paths);
        if (paths.length > 0) {
          setSelectedPath(paths[0]);
        }
      } catch (error) {
        logger.error('Error loading paths:', error);
      }
    };

    loadPaths();
  }, []);

  // Load documentation stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const docStats = await getDocumentationStats();
        setStats(docStats);
      } catch (error) {
        logger.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  // Load content when selected path changes
  useEffect(() => {
    if (selectedPath) {
      const loadContent = async () => {
        setLoading(true);
        try {
          const docContent = await getDocumentationContent(selectedPath);
          setContent(docContent);
        } catch (error) {
          logger.error('Error loading content:', error);
          setContent('Error loading content');
        } finally {
          setLoading(false);
        }
      };

      loadContent();
    }
  }, [selectedPath]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchDocumentation(searchQuery);
      setSearchResults(results);
    } catch (error) {
      logger.error('Error searching:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Documentation API Test</h1>

      {/* Stats section */}
      {stats && (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Documentation Statistics</h2>
          <p>Total Files: {stats.totalFiles}</p>
          <p>Total Content: {stats.totalContent.toLocaleString()} characters</p>
          <p>Generated: {new Date(stats.generated).toLocaleString()}</p>
        </div>
      )}

      {/* Search section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Documentation</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
              >
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">{result.path}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{result.excerpt}</p>
                <button
                  onClick={() => setSelectedPath(result.path)}
                  className="mt-2 text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  View Full Content
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Path selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Documentation Path</h2>
        <select
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">Select a documentation path...</option>
          {availablePaths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
      </div>

      {/* Content display */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Documentation Content</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Path: {selectedPath}</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto">{content}</pre>
          </div>
        )}
      </div>

      {/* API Usage Examples */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API Usage Examples</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Get Documentation Content</h3>
            <code className="text-sm">
              {`import { getDocumentationContent } from '@/utils/docs-client';

const content = await getDocumentationContent('deployment/platforms/cloudflare');`}
            </code>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Search Documentation</h3>
            <code className="text-sm">
              {`import { searchDocumentation } from '@/utils/docs-client';

const results = await searchDocumentation('cloudflare');`}
            </code>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Get Available Paths</h3>
            <code className="text-sm">
              {`import { getAvailableDocumentationPaths } from '@/utils/docs-client';

const paths = await getAvailableDocumentationPaths();`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
