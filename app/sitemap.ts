import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger';

// Sitemap-specific logger
const sitemapLogger = logger;

// Required for static export
export const dynamic = 'force-static';

/**
 * Get all content paths for documentation pages
 * 
 * This recursively traverses the content directory to find all markdown files
 * and transforms their paths into URL paths for the sitemap.
 * 
 * @returns {string[]} Array of URL paths
 */
async function getDocsPaths(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), 'app/docs/content');
  const paths: string[] = [];
  
  sitemapLogger.debug(`Gathering docs paths from directory: ${contentDir}`);
  
  // Recursive function to traverse directories
  async function traverse(dir: string, urlPath = '') {
    const files = await fs.promises.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.promises.stat(filePath);
      
      if (stat.isDirectory()) {
        // If it's a directory, traverse it recursively
        sitemapLogger.debug(`Traversing subdirectory: ${file}`);
        await traverse(filePath, `${urlPath}/${file}`);
      } else if (file.endsWith('.md')) {
        // If it's a markdown file, add it to paths
        const pathWithoutExt = file.replace(/\.md$/, '');
        const urlPathItem = `/docs${urlPath}/${pathWithoutExt}`;
        paths.push(urlPathItem);
        sitemapLogger.debug(`Added docs path: ${urlPathItem}`);
      }
    }
  }
  
  try {
    await traverse(contentDir);
    sitemapLogger.info(`Found ${paths.length} documentation pages for sitemap`);
  } catch (error) {
    sitemapLogger.error('Error generating sitemap paths:', error);
  }
  
  return paths;
}

/**
 * Generate sitemap for the application
 * 
 * This creates a sitemap with the main pages and all documentation content,
 * which helps search engines discover and index the site's content.
 * 
 * @returns {Promise<MetadataRoute.Sitemap>} Sitemap data for Next.js
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment or fallback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phantasy-docs.example.com';
  
  // Get dynamic doc paths
  const docPaths = await getDocsPaths();
  
  // Static pages
  const staticPages = [
    '',
    '/docs',
    '/api',
    '/playground',
  ];
  
  // Create sitemap entries for static pages
  const staticEntries = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1.0 : 0.9,
  }));
  
  // Create sitemap entries for documentation pages
  const docEntries = docPaths.map(docPath => ({
    url: `${baseUrl}${docPath}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Combine all entries
  return [...staticEntries, ...docEntries];
} 