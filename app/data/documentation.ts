import type { FileItem } from '../components/FileTree';

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

// Documentation content - empty object for migration to individual markdown files
export const documentationContent: Record<string, string> = {};
