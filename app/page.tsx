import { redirect } from 'next/navigation';
import { Metadata } from 'next';

/**
 * Metadata for the home page
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: 'Phantasy Documentation - Home',
  description: 'Official documentation for the Phantasy platform - explore guides, references, and API docs',
};

/**
 * Home page component
 * 
 * Redirects to the main documentation introduction page for a better user experience.
 * This approach ensures users immediately land on useful content rather than a landing page.
 * 
 * @returns {null} No direct render as this redirects
 */
export default function Home() {
  redirect('/docs/introduction/synopsis');
}
