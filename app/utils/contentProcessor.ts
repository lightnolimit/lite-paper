/**
 * Add accessibility features to links in the document
 * 
 * @param element - The parent element containing links
 */
export const processLinks = (element: HTMLElement): void => {
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    // Add tabindex to make links focusable in tab order
    link.setAttribute('tabindex', '0');
    
    // Add keyboard event listener for Enter key
    link.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        link.click();
      }
    });
  });
};

/**
 * Process wallet address elements by adding copy buttons
 * 
 * @param element - The parent element containing wallet addresses
 */
export const processWalletAddresses = (element: HTMLElement): void => {
  const walletAddresses = element.querySelectorAll('.wallet-address');
  
  walletAddresses.forEach((walletElement) => {
    const address = walletElement.getAttribute('data-address');
    if (!address) return;
    
    // Check if button already exists to prevent duplicates
    if (walletElement.querySelector('.copy-button')) return;

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('aria-label', 'Copy to clipboard');
    copyButton.setAttribute('title', 'Copy to clipboard');
    
    // Add the copy icon
    copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="14" height="14" />`;
    
    // Add click handler
    copyButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling
      navigator.clipboard.writeText(address).then(() => {
        // Success feedback
        copyButton.innerHTML = `<img src="/assets/icons/pixel-check-circle-solid.svg" alt="Copied" width="14" height="14" />`;
        
        // Show feedback toast
        const toast = document.createElement('div');
        toast.innerText = 'Copied to clipboard!';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
          toast.style.opacity = '1';
        }, 10);
        
        // Reset the button and remove toast after delay
        setTimeout(() => {
          copyButton.innerHTML = `<img src="/assets/icons/pixel-copy-solid.svg" alt="Copy" width="14" height="14" />`;
          toast.style.opacity = '0';
          
          // Remove the toast element after fade out
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 1500);
      });
    });
    
    // Add button to the wallet address element
    walletElement.appendChild(copyButton);
  });
};

/**
 * Apply CSS classes to various HTML elements in the rendered markdown
 * 
 * @param html - The raw HTML string from markdown parsing
 * @returns Styled HTML string
 */
export const applyMarkdownStyles = (html: string): string => {
  const styleMap = {
    code: '<code class="font-mono bg-opacity-10 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-20 px-1 py-0.5 rounded"',
    table: '<table class="w-full border-collapse my-4">',
    th: '<th class="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">',
    td: '<td class="border border-gray-300 dark:border-gray-700 px-4 py-2">',
    blockquote: '<blockquote class="border-l-4 border-primary-color pl-4 italic text-gray-600 dark:text-gray-400 my-4">',
    h1: '<h1$1 class="font-title text-3xl mb-6 mt-8">',
    h2: '<h2$1 class="font-title text-2xl mb-4 mt-6">',
    h3: '<h3$1 class="font-title text-xl mb-3 mt-5">',
    h4: '<h4$1 class="font-title text-lg mb-2 mt-4">',
    h5: '<h5$1 class="font-title text-base mb-2 mt-3">',
    h6: '<h6$1 class="font-title text-sm mb-2 mt-3">',
    p: '<p$1 class="font-body mb-4">',
    a: '<a$1 class="text-primary-color hover:underline">',
    ul: '<ul$1 class="list-disc pl-6 mb-4">',
    ol: '<ol$1 class="list-decimal pl-6 mb-4">',
    li: '<li$1 class="mb-1">',
    hr: '<hr class="my-8 border-t border-gray-300 dark:border-gray-700">',
  };

  // Style for code blocks (but not wallet addresses)
  html = html.replace(/<code(?! class="wallet-address")/g, styleMap.code);
  
  // Apply styling for tables
  html = html.replace(/<table>/g, styleMap.table);
  html = html.replace(/<th>/g, styleMap.th);
  html = html.replace(/<td>/g, styleMap.td);
  
  // Style for blockquotes
  html = html.replace(/<blockquote>/g, styleMap.blockquote);
  
  // Style for regular headings (not icon headings)
  html = html.replace(/<h1(?! class="icon-heading")([^>]*)>/g, styleMap.h1)
    .replace(/<h2(?! class="icon-heading")([^>]*)>/g, styleMap.h2)
    .replace(/<h3(?! class="icon-heading")([^>]*)>/g, styleMap.h3)
    .replace(/<h4(?! class="icon-heading")([^>]*)>/g, styleMap.h4)
    .replace(/<h5(?! class="icon-heading")([^>]*)>/g, styleMap.h5)
    .replace(/<h6(?! class="icon-heading")([^>]*)>/g, styleMap.h6);
  
  // Style for paragraphs
  html = html.replace(/<p([^>]*)>/g, styleMap.p);
  
  // Style for links
  html = html.replace(/<a(?! class="social)([^>]*)>/g, styleMap.a);
  
  // Style for lists
  html = html.replace(/<ul([^>]*)>/g, styleMap.ul)
    .replace(/<ol([^>]*)>/g, styleMap.ol)
    .replace(/<li([^>]*)>/g, styleMap.li);

  // Add styling for horizontal rules
  html = html.replace(/<hr>/g, styleMap.hr);

  return html;
}; 