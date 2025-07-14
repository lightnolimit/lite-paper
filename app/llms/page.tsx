import fs from 'fs';
import path from 'path';

import DocumentationPage from '../docs/components/DocumentationPage';

export default function LLMSPage() {
  // Read the markdown content
  const contentPath = path.join(process.cwd(), 'app', 'docs', 'content', 'llms.md');
  let content = fs.readFileSync(contentPath, 'utf8');

  // Read the llms.txt file to include as preview
  try {
    const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
    const llmsContent = fs.readFileSync(llmsPath, 'utf8');
    content = content.replace('{llms-preview}', llmsContent);
  } catch (error) {
    content = content.replace('{llms-preview}', '# LLMs.txt content will appear here');
  }

  return <DocumentationPage initialContent={content} currentPath="llms" />;
}
