import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import logger from './logger';

const processorLogger = logger;

export interface CodeBlockData {
  language: string;
  code: string;
  label?: string;
}

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  highlight: (code: string) => {
    // We'll let our React component handle the highlighting
    // This just ensures the code is preserved properly
    return code;
  }
}));

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false,
  pedantic: false
});

/**
 * Custom renderer for code blocks to support our CodeBlock component
 */
const renderer = new marked.Renderer();

// Store code blocks data for later React component rendering
let codeBlocksData: Map<string, CodeBlockData[]> = new Map();

renderer.code = function(token: { text: string; lang?: string; escaped?: boolean }) {
  const blockId = `codeblock-${Math.random().toString(36).substr(2, 9)}`;
  
  // Safely get code and language from the token
  const code = token.text || '';
  const language = token.lang || 'text';
  
  // Handle ColorPalette code blocks
  if (language === 'ColorPalette') {
    try {
      const paletteData = JSON.parse(code);
      // Return a placeholder that we'll replace with ColorPalette component
      return `<div data-colorpalette-id="${blockId}" data-palette='${JSON.stringify(paletteData)}' class="color-palette-placeholder"></div>`;
    } catch (error) {
      console.error('Invalid ColorPalette JSON:', error);
      return `<div class="notification notification-error">Invalid ColorPalette JSON format</div>`;
    }
  }
  
  // Handle multi-language code blocks (custom syntax)
  if (language.includes('|')) {
    // Format: javascript|TypeScript|python with optional labels
    const languages = language.split('|');
    const snippets: CodeBlockData[] = [];
    
    // Split code by language if separated by markers
    const codeSections = code.split(/^---\s*$/m);
    
    if (codeSections.length === languages.length) {
      languages.forEach((lang, index) => {
        const [langName, label] = lang.split(':');
        snippets.push({
          language: langName.trim(),
          code: codeSections[index].trim(),
          label: label?.trim()
        });
      });
    } else {
      // Same code for all languages
      languages.forEach(lang => {
        const [langName, label] = lang.split(':');
        snippets.push({
          language: langName.trim(),
          code: code.trim(),
          label: label?.trim()
        });
      });
    }
    
    codeBlocksData.set(blockId, snippets);
  } else {
    // Single language code block
    codeBlocksData.set(blockId, [{
      language: language || 'text',
      code: code.trim()
    }]);
  }
  
  // Return a placeholder that we'll replace with React component
  return `<div data-codeblock-id="${blockId}" class="code-block-placeholder"></div>`;
};

/**
 * Process markdown content and return HTML with code block placeholders
 */
export const processMarkdown = async (content: string): Promise<{ html: string; codeBlocks: Map<string, CodeBlockData[]> }> => {
  try {
    processorLogger.debug('Processing markdown content');
    
    // Reset code blocks data
    codeBlocksData = new Map();
    
    // Use our custom renderer
    marked.use({ renderer });
    
    // Parse markdown to HTML
    const rawHtml = await marked.parse(content);
    
    // Apply basic styling
    const styledHtml = applyBasicStyles(rawHtml);
    
    // Sanitize HTML
    const sanitizedHtml = DOMPurify.sanitize(styledHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'strong', 'em', 'u', 'del', 'mark',
        'img', 'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'data-codeblock-id', 'data-address', 'data-processed',
        'tabindex', 'aria-label', 'width', 'height'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|\/docs\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
    
    processorLogger.debug(`Processed markdown with ${codeBlocksData.size} code blocks`);
    
    return {
      html: sanitizedHtml,
      codeBlocks: new Map(codeBlocksData)
    };
  } catch (error) {
    processorLogger.error('Error processing markdown:', error);
    throw error;
  }
};

/**
 * Apply basic styling to HTML elements
 */
const applyBasicStyles = (html: string): string => {
  const styleReplacements: Array<[RegExp, string]> = [
    // Headings
    [/<h1([^>]*)>/g, '<h1$1 class="font-title text-3xl mb-6 mt-8 text-gray-900 dark:text-gray-100">'],
    [/<h2([^>]*)>/g, '<h2$1 class="font-title text-2xl mb-4 mt-6 text-gray-900 dark:text-gray-100">'],
    [/<h3([^>]*)>/g, '<h3$1 class="font-title text-xl mb-3 mt-5 text-gray-900 dark:text-gray-100">'],
    [/<h4([^>]*)>/g, '<h4$1 class="font-title text-lg mb-2 mt-4 text-gray-900 dark:text-gray-100">'],
    [/<h5([^>]*)>/g, '<h5$1 class="font-title text-base mb-2 mt-3 text-gray-900 dark:text-gray-100">'],
    [/<h6([^>]*)>/g, '<h6$1 class="font-title text-sm mb-2 mt-3 text-gray-900 dark:text-gray-100">'],
    
    // Paragraphs
    [/<p([^>]*)>/g, '<p$1 class="font-body mb-4 text-gray-700 dark:text-gray-300">'],
    
    // Links
    [/<a([^>]*)>/g, '<a$1 class="text-blue-600 dark:text-blue-400 hover:underline">'],
    
    // Lists
    [/<ul([^>]*)>/g, '<ul$1 class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">'],
    [/<ol([^>]*)>/g, '<ol$1 class="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300">'],
    [/<li([^>]*)>/g, '<li$1 class="mb-1">'],
    
    // Blockquotes
    [/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">'],
    
    // Tables
    [/<table([^>]*)>/g, '<table$1 class="w-full border-collapse my-4">'],
    [/<th([^>]*)>/g, '<th$1 class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left">'],
    [/<td([^>]*)>/g, '<td$1 class="border border-gray-300 dark:border-gray-600 px-4 py-2">'],
    
    // Horizontal rules
    [/<hr([^>]*)>/g, '<hr$1 class="my-8 border-t border-gray-300 dark:border-gray-700">'],
    
    // Inline code (not in pre blocks)
    [/<code(?![^<]*<\/pre>)([^>]*)>/g, '<code$1 class="font-mono text-sm bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">'],
  ];

  let styledHtml = html;
  for (const [regex, replacement] of styleReplacements) {
    styledHtml = styledHtml.replace(regex, replacement);
  }

  return styledHtml;
}; 