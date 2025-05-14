import fs from 'fs/promises';
import path from 'path';
import { documentationTree } from '../data/documentation';
import { FileItem } from '../components/FileTree';
import { cache } from 'react';

// Mark this module as server-only
import 'server-only';

/**
 * Utility function to load markdown content from files (cached with React cache)
 */
export const loadMarkdownContent = cache(async (docPath: string): Promise<string> => {
  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'app/docs/content', `${docPath}.md`);
    
    // Read the file content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Return the content directly - we'll let marked handle it
    return content;
  } catch (error) {
    console.error(`Error loading markdown file: ${docPath}`, error);
    return `# Error Loading Content\n\nThe requested documentation page could not be found. Please try again later or contact support if the problem persists.`;
  }
});

/**
 * Load all markdown files from a directory
 */
export async function getAllMarkdownContent(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  
  /**
   * Recursively process file items
   */
  async function processFileItems(items: FileItem[]) {
    for (const item of items) {
      if (item.type === 'file') {
        // This is a file, try to load it
        try {
          const content = await loadMarkdownContent(item.path);
          result[item.path] = content;
        } catch (error) {
          console.error(`Failed to load file: ${item.path}`, error);
        }
      } else if (item.type === 'directory' && item.children) {
        // Process all children in this directory
        await processFileItems(item.children);
      }
    }
  }
  
  // Process all items in the documentation tree
  await processFileItems(documentationTree);
  
  return result;
} 