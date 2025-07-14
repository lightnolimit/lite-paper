#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Documentation tree structure
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

async function generateLLMSTxt() {
  const sections = [];
  
  // Process documentation tree to create sections
  function processTree(items, parentPath = '') {
    items.forEach(item => {
      if (item.type === 'directory' && item.children) {
        const section = {
          title: item.name,
          items: []
        };
        
        item.children.forEach(child => {
          if (child.type === 'file') {
            // Read the markdown file to get description
            const filePath = path.join(process.cwd(), 'app', 'docs', 'content', `${child.path}.md`);
            let description = '';
            
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              // Extract first paragraph after the title as description
              const lines = content.split('\n');
              let foundTitle = false;
              for (const line of lines) {
                if (line.startsWith('# ')) {
                  foundTitle = true;
                  continue;
                }
                if (foundTitle && line.trim() && !line.startsWith('#')) {
                  description = line.trim();
                  break;
                }
              }
            } catch (error) {
              console.warn(`Could not read file ${filePath}:`, error);
            }
            
            section.items.push({
              title: child.name.replace('.md', ''),
              path: `/docs/${child.path}`,
              description
            });
          } else if (child.type === 'directory' && child.children) {
            // Handle nested directories
            processTree([child], item.path);
          }
        });
        
        if (section.items.length > 0) {
          sections.push(section);
        }
      }
    });
  }
  
  processTree(documentationTree);
  
  // Generate the llms.txt content
  let content = '# Lite Paper Documentation\n\n';
  content += '> A modern, customizable documentation template built with Next.js, featuring dark/light themes, interactive backgrounds, and AI-powered search.\n\n';
  content += 'Lite Paper is a documentation template designed for creating beautiful, functional documentation sites. It includes features like theme switching, multiple background options, responsive design, and an AI-powered chatbot for enhanced user experience.\n\n';
  
  // Add sections
  sections.forEach(section => {
    content += `## ${section.title}\n\n`;
    section.items.forEach(item => {
      const url = `https://docs.litepaper.com${item.path}`; // This will be replaced with actual domain
      content += `- [${item.title}](${url})`;
      if (item.description) {
        content += `: ${item.description}`;
      }
      content += '\n';
    });
    content += '\n';
  });
  
  return content;
}

// Function to generate llms-full.txt with all documentation content
async function generateLLMSFullTxt() {
  let fullContent = '# Lite Paper Documentation - Full Content\n\n';
  fullContent += '> Complete documentation content for AI ingestion. This file contains all documentation in a single, structured format.\n\n';
  
  // Process all markdown files
  function processTreeForFullContent(items, parentPath = '') {
    let content = '';
    
    items.forEach(item => {
      if (item.type === 'directory' && item.children) {
        content += `\n## ${item.name}\n\n`;
        content += processTreeForFullContent(item.children, item.path);
      } else if (item.type === 'file') {
        const filePath = path.join(process.cwd(), 'app', 'docs', 'content', `${item.path}.md`);
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          content += `\n### ${item.name.replace('.md', '')}\n\n`;
          content += `URL: /docs/${item.path}\n\n`;
          content += fileContent + '\n\n';
          content += '---\n\n';
        } catch (error) {
          console.warn(`Could not read file ${filePath}:`, error);
        }
      }
    });
    
    return content;
  }
  
  fullContent += processTreeForFullContent(documentationTree);
  
  return fullContent;
}

// Main function
async function main() {
  try {
    console.log('Generating llms.txt files...');
    
    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generate standard llms.txt
    const llmsTxt = await generateLLMSTxt();
    fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf8');
    console.log('Generated llms.txt');
    
    // Generate full llms.txt
    const llmsFullTxt = await generateLLMSFullTxt();
    fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullTxt, 'utf8');
    console.log('Generated llms-full.txt');
    
    console.log('Successfully generated llms.txt files!');
  } catch (error) {
    console.error('Failed to generate llms.txt files:', error);
    process.exit(1);
  }
}

main();