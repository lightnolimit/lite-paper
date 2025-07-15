import type { FileItem } from '../types/documentation';

export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Getting Started',
    path: 'getting-started',
    children: [
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'getting-started/introduction',
        tags: ['getting-started', 'beginner', 'overview'],
      },
      {
        type: 'file',
        name: 'Quick Start.md',
        path: 'getting-started/quick-start',
        tags: ['setup', 'beginner'],
      },
      {
        type: 'file',
        name: 'Installation.md',
        path: 'getting-started/installation',
        tags: ['setup', 'installation', 'beginner'],
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
        tags: ['usage', 'beginner', 'guide'],
      },
      {
        type: 'file',
        name: 'Advanced Features.md',
        path: 'user-guide/advanced-features',
        tags: ['advanced', 'features', 'guide'],
      },
      {
        type: 'file',
        name: 'Configuration.md',
        path: 'user-guide/configuration',
        tags: ['configuration', 'setup', 'guide'],
      },
      {
        type: 'file',
        name: 'Troubleshooting.md',
        path: 'user-guide/troubleshooting',
        tags: ['troubleshooting', 'help', 'guide'],
      },
      {
        type: 'file',
        name: 'Chatbot.md',
        path: 'user-guide/chatbot',
        tags: ['ai', 'chatbot', 'features'],
      },
      {
        type: 'file',
        name: 'Interactive Map.md',
        path: 'user-guide/interactive-map',
        tags: ['visualization', 'navigation', 'features'],
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
        tags: ['api', 'overview', 'reference'],
      },
      {
        type: 'file',
        name: 'Authentication.md',
        path: 'api-reference/authentication',
        tags: ['api', 'authentication', 'security'],
      },
      {
        type: 'file',
        name: 'Endpoints.md',
        path: 'api-reference/endpoints',
        tags: ['api', 'endpoints', 'reference'],
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
        tags: ['code', 'examples', 'development'],
      },
      {
        type: 'file',
        name: 'Best Practices.md',
        path: 'developer-guides/best-practices',
        tags: ['best-practices', 'development', 'guide'],
      },
      {
        type: 'file',
        name: 'Design System.md',
        path: 'developer-guides/design-system',
        tags: ['design', 'ui', 'development'],
      },
      {
        type: 'file',
        name: 'UI Configuration.md',
        path: 'developer-guides/ui-configuration',
        tags: ['ui', 'configuration', 'development'],
      },
      {
        type: 'file',
        name: 'Icon Customization.md',
        path: 'developer-guides/icon-customization',
        tags: ['icons', 'customization', 'ui'],
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
        tags: ['deployment', 'overview', 'production'],
      },
      {
        type: 'file',
        name: 'Production Setup.md',
        path: 'deployment/production-setup',
        tags: ['deployment', 'production', 'setup'],
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
            tags: ['deployment', 'cloudflare', 'hosting'],
          },
          {
            type: 'file',
            name: 'Vercel.md',
            path: 'deployment/platforms/vercel',
            tags: ['deployment', 'vercel', 'hosting'],
          },
          {
            type: 'file',
            name: 'Netlify.md',
            path: 'deployment/platforms/netlify',
            tags: ['deployment', 'netlify', 'hosting'],
          },
        ],
      },
    ],
  },
  {
    type: 'file',
    name: 'LLMs.txt Format.md',
    path: 'llms',
    tags: ['llms', 'format', 'ai'],
  },
];

// Documentation content - empty object for migration to individual markdown files
export const documentationContent: Record<string, string> = {};
