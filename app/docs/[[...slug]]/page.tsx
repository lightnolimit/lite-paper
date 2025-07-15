import fs from 'fs';
import path from 'path';

import { Suspense } from 'react';

import { createLogger } from '../../utils/logger';
import { loadMarkdownContent } from '../../utils/markdownLoader';
import DocumentationPage from '../components/DocumentationPage';

const logger = createLogger('DocsPage');

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

/**
 * Function to generate all possible static paths for Next.js static export
 * This is required for static site generation with dynamic routes
 */
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'app/docs/content');
  const paths: { slug: string[] }[] = [];

  // Recursive function to traverse directories
  async function traverse(dir: string, currentPath: string[] = []) {
    try {
      const files = await fs.promises.readdir(dir);

      // Add directory path (for cases like /docs/getting-started)
      if (currentPath.length > 0) {
        paths.push({ slug: [...currentPath] });
      }

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          // If it's a directory, traverse it recursively
          await traverse(filePath, [...currentPath, file]);
        } else if (file.endsWith('.md')) {
          // If it's a markdown file, add it to paths
          const pathWithoutExt = file.replace(/\.md$/, '');
          paths.push({ slug: [...currentPath, pathWithoutExt] });
        }
      }
    } catch (error) {
      logger.error('Error generating static params:', error);
    }
  }

  await traverse(contentDir);

  // Add the root docs path (no slug)
  paths.push({ slug: [] });

  logger.debug('Generated static params:', paths);
  return paths;
}

export default async function DocPage({ params }: PageProps) {
  // Await the params promise to resolve
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Function to determine the correct path
  function getDocumentPath(slug?: string[]): string {
    if (!slug || slug.length === 0) {
      return 'getting-started/introduction';
    }

    const joinedPath = slug.join('/');

    // Handle directory redirects to default files
    const directoryDefaults: Record<string, string> = {
      'getting-started': 'getting-started/introduction',
      'user-guide': 'user-guide/basic-usage',
      'api-reference': 'api-reference/overview',
      'developer-guides': 'developer-guides/code-examples',
      deployment: 'deployment/overview',
    };

    // If it's a directory, redirect to default file
    if (directoryDefaults[joinedPath]) {
      return directoryDefaults[joinedPath];
    }

    return joinedPath;
  }

  const slugPath = getDocumentPath(slug);

  // Load the content for this document
  const content = await loadMarkdownContent(slugPath);

  return (
    <Suspense fallback={<div className="animate-pulse p-8">Loading documentation...</div>}>
      <DocumentationPage initialContent={content} currentPath={slugPath} />
    </Suspense>
  );
}
