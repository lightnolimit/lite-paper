#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { documentationTree } from '../shared/documentation-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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