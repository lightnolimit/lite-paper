import { Suspense } from 'react';
import { loadMarkdownContent } from '../../utils/markdown-loader';
import DocumentationPage from '../components/DocumentationPage';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export default async function DocPage({ params }: PageProps) {
  // Handle params safely without accessing properties directly
  const slugPath = Array.isArray(params?.slug) 
    ? params.slug.join('/') 
    : 'introduction/synopsis';
  
  // Load the content for this document
  const content = await loadMarkdownContent(slugPath);
  
  return (
    <Suspense fallback={<div className="animate-pulse p-8">Loading documentation...</div>}>
      <DocumentationPage initialContent={content} currentPath={slugPath} />
    </Suspense>
  );
} 