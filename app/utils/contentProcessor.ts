import logger from './logger';

// Create a utility-specific logger instance
const processorLogger = logger;

// Cache for processed elements to avoid reprocessing
const processedElements = new WeakSet<HTMLElement>();

/**
 * Add accessibility features to links in the document
 *
 * @param element - The parent element containing links
 */
export const processLinks = (element: HTMLElement): void => {
  if (processedElements.has(element)) {
    processorLogger.debug('Element already processed for links, skipping');
    return;
  }

  const links = element.querySelectorAll('a:not([data-processed])');
  processorLogger.debug(`Processing ${links.length} new links for accessibility`);

  links.forEach((link) => {
    const linkElement = link as HTMLAnchorElement;

    // Add tabindex to make links focusable in tab order
    linkElement.setAttribute('tabindex', '0');
    linkElement.setAttribute('data-processed', 'true');

    // Add keyboard event listener for Enter key
    const handleKeydown = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.preventDefault();
        linkElement.click();
      }
    };

    linkElement.addEventListener('keydown', handleKeydown);
  });

  processedElements.add(element);
};

/**
 * Detect blockchain type from address
 */
const detectChainFromAddress = (address: string): string => {
  // Ethereum/EVM addresses (0x + 40 hex chars)
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return 'eth';
  }

  // Bitcoin addresses
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(address)) {
    return 'btc';
  }

  // Solana addresses (base58, 32-44 chars)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return 'solana';
  }

  // Base (same as Ethereum format)
  if (/^0x[a-fA-F0-9]{40}$/.test(address) && address.toLowerCase().includes('base')) {
    return 'base';
  }

  // Default to Ethereum for 0x addresses
  return 'eth';
};

/**
 * Process wallet address elements by adding copy buttons and chain icons
 *
 * @param element - The parent element containing wallet addresses
 */
export const processWalletAddresses = (element: HTMLElement): void => {
  const walletAddresses = element.querySelectorAll('.wallet-address:not([data-copy-processed])');
  processorLogger.debug(`Processing ${walletAddresses.length} new wallet addresses`);

  walletAddresses.forEach((walletElement) => {
    const address = walletElement.getAttribute('data-address');
    const chainOverride = walletElement.getAttribute('data-chain');

    if (!address) {
      processorLogger.warn('Wallet element without data-address attribute found');
      return;
    }

    walletElement.setAttribute('data-copy-processed', 'true');
    processorLogger.debug(`Adding copy button for address: ${address.substring(0, 4)}...`);

    // Detect chain type
    const chain = chainOverride || detectChainFromAddress(address);

    // Add chain icon container
    const iconContainer = document.createElement('span');
    iconContainer.className = 'chain-icon-container';
    iconContainer.innerHTML = `
      <iconify-icon 
        icon="token:${chain}" 
        width="20" 
        height="20"
        class="chain-icon chain-icon-default"
      ></iconify-icon>
      <iconify-icon 
        icon="token-branded:${chain}" 
        width="20" 
        height="20"
        class="chain-icon chain-icon-branded"
      ></iconify-icon>
    `;

    // Insert icon at the beginning of the wallet element
    walletElement.insertBefore(iconContainer, walletElement.firstChild);

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('aria-label', 'Copy to clipboard');
    copyButton.setAttribute('title', 'Copy to clipboard');

    // Add the copy icon
    copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="14" height="14" />`;

    // Add click handler
    const handleCopyClick = async (e: Event) => {
      e.stopPropagation();

      try {
        await navigator.clipboard.writeText(address);
        processorLogger.debug(`Copied address to clipboard: ${address.substring(0, 4)}...`);

        // Success feedback
        copyButton.innerHTML = `<img src="/assets/icons/pixel-check-circle-solid.svg" alt="Copied" width="14" height="14" />`;

        // Show feedback toast
        showCopyToast();

        // Reset the button after delay
        setTimeout(() => {
          copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="14" height="14" />`;
        }, 1500);
      } catch (error) {
        processorLogger.error('Failed to copy to clipboard:', error);
      }
    };

    copyButton.addEventListener('click', handleCopyClick);

    // Add button to the wallet address element
    walletElement.appendChild(copyButton);
  });
};

/**
 * Show a copy success toast - memoized to prevent multiple toasts
 */
let toastTimeout: NodeJS.Timeout | null = null;
const showCopyToast = (): void => {
  // Prevent multiple toasts
  if (toastTimeout) return;

  const toast = document.createElement('div');
  toast.innerText = 'Copied to clipboard!';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    font-family: var(--mono-font);
    pointer-events: none;
  `;

  document.body.appendChild(toast);

  // Show the toast
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  // Remove toast after delay
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';

    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
      toastTimeout = null;
    }, 300);
  }, 1500);
};

/**
 * Optimized style map for better performance
 */
const styleReplacements: Array<[RegExp, string]> = [
  // Code elements (but not wallet addresses)
  [
    /<code(?! class="wallet-address")/g,
    '<code class="font-mono bg-opacity-10 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-20 px-1 py-0.5 rounded"',
  ],

  // Table elements
  [/<table>/g, '<table class="w-full border-collapse my-4">'],
  [
    /<th>/g,
    '<th class="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">',
  ],
  [/<td>/g, '<td class="border border-gray-300 dark:border-gray-700 px-4 py-2">'],

  // Blockquotes
  [
    /<blockquote>/g,
    '<blockquote class="border-l-4 border-primary-color pl-4 italic text-gray-600 dark:text-gray-400 my-4">',
  ],

  // Headings (but not icon headings)
  [/<h1(?! class="icon-heading")([^>]*)>/g, '<h1$1 class="font-title text-3xl mb-6 mt-8">'],
  [/<h2(?! class="icon-heading")([^>]*)>/g, '<h2$1 class="font-title text-2xl mb-4 mt-6">'],
  [/<h3(?! class="icon-heading")([^>]*)>/g, '<h3$1 class="font-title text-xl mb-3 mt-5">'],
  [/<h4(?! class="icon-heading")([^>]*)>/g, '<h4$1 class="font-title text-lg mb-2 mt-4">'],
  [/<h5(?! class="icon-heading")([^>]*)>/g, '<h5$1 class="font-title text-base mb-2 mt-3">'],
  [/<h6(?! class="icon-heading")([^>]*)>/g, '<h6$1 class="font-title text-sm mb-2 mt-3">'],

  // Paragraphs
  [/<p([^>]*)>/g, '<p$1 class="font-body mb-4">'],

  // Links (but not social links)
  [/<a(?! class="social)([^>]*)>/g, '<a$1 class="text-primary-color hover:underline">'],

  // Lists
  [/<ul([^>]*)>/g, '<ul$1 class="list-disc pl-6 mb-4">'],
  [/<ol([^>]*)>/g, '<ol$1 class="list-decimal pl-6 mb-4">'],
  [/<li([^>]*)>/g, '<li$1 class="mb-1">'],

  // Horizontal rules
  [/<hr>/g, '<hr class="my-8 border-t border-gray-300 dark:border-gray-700">'],
];

/**
 * Process CodeBlock components in markdown
 *
 * @param html - The HTML string containing CodeBlock components
 * @returns HTML string with CodeBlock components rendered
 */
export const processCodeBlocks = (html: string): string => {
  processorLogger.debug('Processing CodeBlock components in markdown');

  // Pattern to match CodeBlock components with their props
  const codeBlockPattern = /<CodeBlock\s+([^>]+)\/>/g;

  return html.replace(codeBlockPattern, (match, propsString) => {
    try {
      // Extract title and snippets from props
      const titleMatch = propsString.match(/title="([^"]+)"/);
      const snippetsMatch = propsString.match(/snippets=\{(\[[\s\S]+?\])\}/);

      if (!snippetsMatch) {
        processorLogger.warn('CodeBlock found without snippets prop');
        return match;
      }

      const title = titleMatch ? titleMatch[1] : '';
      const snippetsJson = snippetsMatch[1];

      // Parse the snippets JSON
      const snippets = JSON.parse(snippetsJson);

      // Generate a unique ID for this code block
      const blockId = `code-block-${Math.random().toString(36).substr(2, 9)}`;

      // Create HTML for the code block
      const codeBlockHtml = `
        <div class="code-block-container" id="${blockId}">
          ${title ? `<div class="code-block-title"><h4>${title}</h4></div>` : ''}
          
          ${
            snippets.length > 1
              ? `
          <div class="code-block-tabs">
            ${snippets
              .map(
                (snippet: { language: string; label?: string }, index: number) => `
              <button 
                class="code-block-tab ${index === 0 ? 'active' : ''}" 
                onclick="switchCodeTab('${blockId}', ${index})"
                data-tab="${index}"
              >
                ${snippet.label || getLanguageDisplay(snippet.language)}
              </button>
            `
              )
              .join('')}
          </div>
          `
              : ''
          }
          
          <div class="code-block-wrapper">
            <div class="code-block-header">
              <span class="code-block-language" id="${blockId}-language">
                ${snippets[0].label || getLanguageDisplay(snippets[0].language)}
              </span>
              <button 
                class="code-block-copy-btn" 
                onclick="copyCodeBlock('${blockId}')"
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                <span class="text-xs font-medium">Copy</span>
              </button>
            </div>
            
                         ${snippets
                           .map(
                             (snippet: { language: string; code: string }, index: number) => `
               <pre 
                 class="code-block-content ${index === 0 ? 'active' : 'hidden'}" 
                 id="${blockId}-content-${index}"
                 data-language="${snippet.language}"
               ><code class="language-${snippet.language}">${escapeHtml(snippet.code)}</code></pre>
             `
                           )
                           .join('')}
          </div>
          
          <script>
            window.codeBlockData = window.codeBlockData || {};
            window.codeBlockData['${blockId}'] = ${JSON.stringify(snippets)};
          </script>
        </div>
      `;

      return codeBlockHtml;
    } catch (error) {
      processorLogger.error('Error processing CodeBlock:', error);
      return match; // Return original if parsing fails
    }
  });
};

/**
 * Get display name for a programming language
 */
function getLanguageDisplay(language: string): string {
  const languageMap: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    solidity: 'Solidity',
    bash: 'Bash',
    shell: 'Shell',
    json: 'JSON',
    css: 'CSS',
    html: 'HTML',
    sql: 'SQL',
    yaml: 'YAML',
    toml: 'TOML',
    go: 'Go',
    rust: 'Rust',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
  };

  return languageMap[language.toLowerCase()] || language.toUpperCase();
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Apply CSS classes to various HTML elements in the rendered markdown
 *
 * @param html - The raw HTML string from markdown parsing
 * @returns Styled HTML string
 */
export const applyMarkdownStyles = (html: string): string => {
  processorLogger.debug('Applying styles to markdown HTML');

  // First process CodeBlock components
  let styledHtml = processCodeBlocks(html);

  // Apply all style replacements in a single pass
  for (const [regex, replacement] of styleReplacements) {
    styledHtml = styledHtml.replace(regex, replacement);
  }

  processorLogger.debug('Finished applying styles to markdown HTML');
  return styledHtml;
};
