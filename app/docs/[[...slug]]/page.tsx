import { Suspense } from 'react';
import { loadMarkdownContent } from '../../utils/markdown-loader';
import DocumentationPage from '../components/DocumentationPage';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function DocPage({ params }: PageProps) {
  // Await the params promise to resolve
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Safely determine slugPath
  const slugPath = (Array.isArray(slug) && slug.length > 0) 
    ? slug.join('/') 
    : 'introduction/synopsis';
  
  // Load the content for this document
  const content = await loadMarkdownContent(slugPath);
  
  return (
    <Suspense fallback={<div className="animate-pulse p-8">Loading documentation...</div>}>
      <DocumentationPage initialContent={content} currentPath={slugPath} />
    </Suspense>
  );
} 