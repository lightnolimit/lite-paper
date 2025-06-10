import { Suspense } from 'react';
import { loadMarkdownContent } from '../../utils/markdown-loader';
import DocumentationPage from '../components/DocumentationPage';
import fs from 'fs';
import path from 'path';

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
  
  // Add the default path
  paths.push({ slug: ['prelude', 'synopsis'] });
  
  // Recursive function to traverse directories
  async function traverse(dir: string, currentPath: string[] = []) {
    try {
      const files = await fs.promises.readdir(dir);
      
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
      console.error('Error generating static params:', error);
    }
  }
  
  await traverse(contentDir);
  return paths;
}

export default async function DocPage({ params }: PageProps) {
  // Await the params promise to resolve
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Safely determine slugPath - use a path that actually exists
  const slugPath = (Array.isArray(slug) && slug.length > 0) 
    ? slug.join('/') 
    : 'prelude/synopsis';
  
  // Load the content for this document
  const content = await loadMarkdownContent(slugPath);
  
  return (
    <Suspense fallback={<div className="animate-pulse p-8">Loading documentation...</div>}>
      <DocumentationPage initialContent={content} currentPath={slugPath} />
    </Suspense>
  );
} 