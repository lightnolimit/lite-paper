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
    
    // Process and return content
    return preprocessMarkdown(content);
  } catch (error) {
    console.error(`Error loading markdown file: ${docPath}`, error);
    return `# Error Loading Content\n\nThe requested documentation page could not be found. Please try again later or contact support if the problem persists.`;
  }
});

/**
 * Preprocess markdown content to handle HTML blocks better
 */
function preprocessMarkdown(content: string): string {
  // Add a special comment at the beginning of HTML blocks to preserve them during markdown parsing
  return content.replace(/(<div[\s\S]*?<\/div>)/g, '\n\n$1\n\n');
}

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