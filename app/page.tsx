import { Metadata } from 'next';
import { redirect } from 'next/navigation';

/**
 * Metadata for the home page
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: 'Phantasy Documentation',
  description:
    'Official documentation for the Phantasy platform - explore guides, references, and API docs',
};

/**
 * Home page component
 *
 * Redirects directly to the main documentation introduction page.
 *
 * @returns {null} No direct render as this redirects
 */
export default function Home() {
  redirect('/docs/getting-started/introduction');
}
