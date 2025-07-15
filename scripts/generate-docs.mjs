import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { documentationTree } from '../shared/documentation-config.js';

/**
 * Load markdown content from a file
 */
async function loadMarkdownContent(docPath) {
  try {
    const filePath = join(process.cwd(), 'app/docs/content', `${docPath}.md`);
    
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return `# File Not Found\n\nThe requested documentation file "${docPath}.md" could not be found.`;
    }

    const content = await readFile(filePath, 'utf-8');
    
    if (!content.trim()) {
      console.warn(`Empty file: ${filePath}`);
      return `# Empty File\n\nThe documentation file "${docPath}.md" appears to be empty.`;
    }

    return content;
  } catch (error) {
    console.error(`Error loading ${docPath}:`, error);
    return `# Error Loading Content\n\nFailed to load "${docPath}.md": ${error.message}`;
  }
}

/**
 * Process file items recursively
 */
async function processFileItems(items) {
  const result = {};
  
  for (const item of items) {
    if (item.type === 'file') {
      console.log(`Processing: ${item.path}`);
      const content = await loadMarkdownContent(item.path);
      result[item.path] = content;
    } else if (item.type === 'directory' && item.children) {
      const childResults = await processFileItems(item.children);
      Object.assign(result, childResults);
    }
  }
  
  return result;
}

/**
 * Generate the documentation content JSON
 */
async function generateDocsContent() {
  try {
    console.log('🚀 Generating documentation content...');
    
    // Process all documentation files
    const allContent = await processFileItems(documentationTree);
    
    // Generate the JSON output
    const output = {
      generated: new Date().toISOString(),
      content: allContent,
      paths: Object.keys(allContent),
      count: Object.keys(allContent).length
    };
    
    // Write to public directory for static serving
    const outputPath = join(process.cwd(), 'public', 'docs-content.json');
    await writeFile(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`✅ Generated documentation content for ${output.count} files`);
    console.log(`📁 Output saved to: ${outputPath}`);
    
    // Also generate a simple index file
    const indexPath = join(process.cwd(), 'public', 'docs-index.json');
    await writeFile(indexPath, JSON.stringify({
      generated: output.generated,
      paths: output.paths,
      count: output.count
    }, null, 2));
    
    console.log(`📋 Generated docs index: ${indexPath}`);
    
    return output;
    
  } catch (error) {
    console.error('❌ Error generating documentation content:', error);
    process.exit(1);
  }
}

// Run the script
generateDocsContent().then((result) => {
  console.log(`\n🎉 Documentation generation complete!`);
  console.log(`Generated ${result.count} documentation files`);
});