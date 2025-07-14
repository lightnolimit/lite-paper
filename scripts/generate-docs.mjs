import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Documentation file structure based on the documentation tree
const documentationTree = [
  {
    type: 'directory',
    name: 'Getting Started',
    path: 'getting-started',
    children: [
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'getting-started/introduction',
      },
      {
        type: 'file',
        name: 'Quick Start.md',
        path: 'getting-started/quick-start',
      },
      {
        type: 'file',
        name: 'Installation.md',
        path: 'getting-started/installation',
      },
    ],
  },
  {
    type: 'directory',
    name: 'User Guide',
    path: 'user-guide',
    children: [
      {
        type: 'file',
        name: 'Basic Usage.md',
        path: 'user-guide/basic-usage',
      },
      {
        type: 'file',
        name: 'Advanced Features.md',
        path: 'user-guide/advanced-features',
      },
      {
        type: 'file',
        name: 'Configuration.md',
        path: 'user-guide/configuration',
      },
      {
        type: 'file',
        name: 'Troubleshooting.md',
        path: 'user-guide/troubleshooting',
      },
      {
        type: 'file',
        name: 'Chatbot.md',
        path: 'user-guide/chatbot',
      },
    ],
  },
  {
    type: 'directory',
    name: 'API Reference',
    path: 'api-reference',
    children: [
      {
        type: 'file',
        name: 'Overview.md',
        path: 'api-reference/overview',
      },
      {
        type: 'file',
        name: 'Authentication.md',
        path: 'api-reference/authentication',
      },
      {
        type: 'file',
        name: 'Endpoints.md',
        path: 'api-reference/endpoints',
      },
    ],
  },
  {
    type: 'directory',
    name: 'Developer Guides',
    path: 'developer-guides',
    children: [
      {
        type: 'file',
        name: 'Code Examples.md',
        path: 'developer-guides/code-examples',
      },
      {
        type: 'file',
        name: 'Best Practices.md',
        path: 'developer-guides/best-practices',
      },
      {
        type: 'file',
        name: 'Contributing.md',
        path: 'developer-guides/contributing',
      },
      {
        type: 'file',
        name: 'Design System.md',
        path: 'developer-guides/design-system',
      },
      {
        type: 'file',
        name: 'UI Configuration.md',
        path: 'developer-guides/ui-configuration',
      },
      {
        type: 'file',
        name: 'Icon Customization.md',
        path: 'developer-guides/icon-customization',
      },
    ],
  },
  {
    type: 'directory',
    name: 'Deployment',
    path: 'deployment',
    children: [
      {
        type: 'file',
        name: 'Overview.md',
        path: 'deployment/overview',
      },
      {
        type: 'file',
        name: 'Production Setup.md',
        path: 'deployment/production-setup',
      },
      {
        type: 'directory',
        name: 'Platform Guides',
        path: 'deployment/platforms',
        children: [
          {
            type: 'file',
            name: 'Cloudflare.md',
            path: 'deployment/platforms/cloudflare',
          },
          {
            type: 'file',
            name: 'Vercel.md',
            path: 'deployment/platforms/vercel',
          },
          {
            type: 'file',
            name: 'Netlify.md',
            path: 'deployment/platforms/netlify',
          },
        ],
      },
    ],
  },
];

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