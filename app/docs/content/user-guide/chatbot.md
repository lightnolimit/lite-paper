# Documentation Chatbot

The documentation site includes an intelligent chatbot assistant that can help you find information, answer questions, and navigate the documentation more effectively.

## Overview

The chatbot uses **Retrieval-Augmented Generation (RAG)** technology to:
- Search through all documentation content
- Provide contextual answers with source references  
- Suggest related topics and pages
- Guide you to the most relevant information

## How to Use

### Opening the Chatbot

The chatbot is available on every page of the documentation:

1. **Click the chat button** in the bottom-right corner of any page
2. **Keyboard shortcut**: Press `Ctrl/Cmd + K` to open search, then select "Ask AI"
3. The chat interface will slide up from the bottom

### Asking Questions

The chatbot understands natural language questions about:

**General inquiries:**
- "How do I customize the theme?"
- "What background options are available?"
- "How to add new icons?"

**Technical questions:**
- "Show me code examples for the navigation component"
- "How do I deploy this documentation site?"
- "What are the performance optimization features?"

**Navigation help:**
- "Where can I find the API documentation?"
- "Show me the getting started guide"
- "What's in the developer guides section?"

### Understanding Responses

Each chatbot response includes:

1. **Main Answer**: Contextual response based on your question
2. **Source Links**: Direct links to relevant documentation pages
3. **Related Topics**: Suggestions for additional reading
4. **Code Examples**: When applicable, working code snippets

## Features

### Smart Search

The chatbot performs intelligent keyword matching:
- **Title prioritization**: Matches in page titles score higher
- **Content relevance**: Searches through all documentation content
- **Contextual understanding**: Understands related terms and concepts

### Response Types

The chatbot adapts its responses based on your question:

**How-to Questions**
```
Q: "How do I add custom icons?"
A: Based on the documentation, here's how you can add custom icons:

1. Visit iconify.design and find your desired icon
2. Save the SVG file to /public/assets/icons/
3. Import and use in your components...

For more detailed information, check the Icon Customization section.
```

**Definition Questions**
```
Q: "What is the theme system?"
A: Based on the documentation:

The theme system provides automatic dark/light mode switching 
with smooth transitions, persistent storage, and reduced motion support...

You can find additional information in:
- UI Configuration
- Advanced Features
```

**Example Requests**
```
Q: "Show me navigation examples"
A: Here are relevant examples from the documentation:

**Navigation Component:**
Building a responsive navigation with search functionality...

**Code Examples:**
Real implementation of the theme provider...
```

### Source Attribution

Every response includes clickable source links:
- Links open in new tabs for easy reference
- Sources are ranked by relevance
- Up to 5 source documents per response

## Technical Implementation

### Backend API

The chatbot uses a RESTful API endpoint:

```typescript
POST /api/chat
{
  "query": "How do I customize themes?"
}

// Response
{
  "answer": "Based on the documentation...",
  "sources": [
    {
      "title": "UI Configuration",
      "path": "developer-guides/ui-configuration",
      "snippet": "Theme customization allows...",
      "relevanceScore": 85
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Document Processing

The system automatically:
1. **Indexes all markdown files** in the documentation
2. **Splits content into chunks** for better search performance
3. **Scores relevance** based on keyword matches and context
4. **Generates contextual answers** based on found content

### Performance

- **Fast responses**: Typically under 500ms
- **Efficient search**: Keyword-based matching with scoring
- **Cached content**: Documentation is indexed at build time
- **Lightweight**: No external AI dependencies required

## Customization

### Adding Content Sources

To include additional content in chatbot responses:

1. **Add markdown files** to `/app/docs/content/`
2. **Include frontmatter** for better categorization:
   ```markdown
   ---
   title: "Your Page Title"
   category: "user-guide"
   ---
   
   # Your Content
   ```
3. **Rebuild the site** to index new content

### Modifying Responses

The response generation logic is in `/app/api/chat/route.ts`:

```typescript
function generateAnswer(query: string, sources: DocumentSource[]): string {
  // Custom logic for different question types
  if (queryLower.includes('how to')) {
    return generateHowToAnswer(query, sources);
  }
  // Add your own response patterns here
}
```

### Styling the Interface

The chatbot UI can be customized via CSS variables:

```css
/* Chatbot theming */
.chatbot-container {
  --chat-primary: var(--primary-color);
  --chat-background: var(--card-background);
  --chat-border: var(--border-color);
}
```

## Best Practices

### For Users

1. **Be specific**: "How to add icons?" vs "Icons?"
2. **Use natural language**: Ask questions as you would to a person
3. **Check sources**: Click through to referenced documentation
4. **Try variations**: Rephrase if you don't get the expected answer

### For Content Authors

1. **Clear headings**: Use descriptive section titles
2. **Good structure**: Organize content logically
3. **Include examples**: Practical code examples improve responses
4. **Update regularly**: Keep documentation current for better answers

## Accessibility

The chatbot is designed with accessibility in mind:

- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels and structure
- **Motion preferences**: Respects `prefers-reduced-motion`
- **High contrast**: Works with high contrast modes
- **Focus management**: Proper focus handling for modal interface

## Privacy

The chatbot operates entirely on your documentation content:

- **No external APIs**: All processing happens locally
- **No data collection**: Questions and responses are not stored
- **No tracking**: No analytics or user behavior tracking
- **Offline capable**: Works without internet connection

## Troubleshooting

### Common Issues

**Chatbot doesn't respond:**
- Check browser console for JavaScript errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Poor search results:**
- Try different keywords or phrases
- Check if the topic exists in documentation
- Use more specific terms

**Interface doesn't appear:**
- Check if the chat button is visible (bottom-right)
- Try different screen sizes/devices
- Clear browser cache

### Performance Issues

**Slow responses:**
- Check network connectivity
- Ensure adequate device memory
- Close other browser tabs

**Search not finding content:**
- Verify content exists in `/app/docs/content/`
- Check if build includes new content
- Confirm file extensions are `.md`

---

**Related Documentation:**
- [Advanced Features](./advanced-features) - More platform capabilities
- [Configuration](./configuration) - Site customization options
- [Code Examples](../developer-guides/code-examples) - Implementation details 