import { readFileSync } from 'fs';
import { join } from 'path';
import DocumentationPage from '../../components/DocumentationPage';

export default function UIConfigurationPage() {
  const content = readFileSync(
    join(process.cwd(), 'app/docs/content/developer-guides/ui-configuration.md'),
    'utf8'
  );

  return <DocumentationPage initialContent={content} currentPath="developer-guides/ui-configuration" />;
}

export function generateStaticParams() {
  return [{}];
} 