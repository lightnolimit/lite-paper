import { FileItem } from "../components/FileTree";

export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Prelude',
    path: 'prelude',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'prelude/synopsis'
      },
      {
        type: 'file',
        name: 'Disclaimers.md',
        path: 'prelude/disclaimers'
      },
      {
        type: 'file',
        name: 'ACP.md',
        path: 'prelude/acp'
      },
    ]
  },
  {
    type: 'directory',
    name: 'Agents',
    path: 'agents',
    children: [
      {
        type: 'file',
        name: 'Rally.md',
        path: 'agents/rally'
      },
      {
        type: 'file',
        name: 'Alchemist.md',
        path: 'agents/alchemist'
      },
      {
        type: 'file',
        name: 'Munny.md',
        path: 'agents/munny'
      },
      {
        type: 'file',
        name: 'Sheena.md',
        path: 'agents/sheena'
      },
    ]
  },
  {
    type: 'directory',
    name: 'Platforms',
    path: 'platforms',
    children: [
      {
        type: 'file',
        name: 'Alkahest.md',
        path: 'platforms/alkahest'
      },
      {
        type: 'file',
        name: 'Atelier.md',
        path: 'platforms/atelier'
      },
      {
        type: 'file',
        name: 'Banshee.md',
        path: 'platforms/banshee'
      },
    ]
  },
  // {
  //   type: 'directory',
  //   name: 'Developer Guides',
  //   path: 'developer-guides',
  //   children: [
  //     {
  //       type: 'file',
  //       name: 'Code Examples.md',
  //       path: 'developer-guides/code-examples'
  //     },
  //     {
  //       type: 'file',
  //       name: 'Notification Components.md',
  //       path: 'developer-guides/notification-components'
  //     }
  //   ]
  // },
  {
    type: 'directory',
    name: 'Phase 1: Rally.sh',
    path: 'rally.sh',
    children: [
      {
        type: 'file',
        name: 'Platform.md',
        path: 'rally.sh/platform'
      },
      {
        type: 'file',
        name: 'Strategy.md',
        path: 'rally.sh/blueprint'
      },
      {
        type: 'directory',
        name: '@Rally',
        path: 'rally.sh/rally',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: 'rally.sh/rally/bio'
          },
        ]
      },
      {
        type: 'directory',
        name: 'Technology',
        path: 'rally.sh/technology',
        children: [
          {
            type: 'file',
            name: 'Privacy.md',
            path: 'rally.sh/technology/privacy'
          },
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics', 
        path: 'rally.sh/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'rally.sh/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'rally.sh/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Summary.md',
            path: 'rally.sh/tokenomics/summary'
          }
        ]
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 2: Banshee.sh',
    path: 'banshee.sh',
    children: [
      {
        type: 'file',
        name: 'Platform.md',
        path: 'banshee.sh/banshee-platform'
      },
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'banshee.sh/synopsis'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'banshee.sh/roadmap'
      },
      {
        type: 'directory',
        name: '@Sheena',
        path: 'banshee.sh/models',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: 'banshee.sh/models/sheena'
          },
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'banshee.sh/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'banshee.sh/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'banshee.sh/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Additional Benefits.md',
            path: 'banshee.sh/tokenomics/additional-benefits'
          }
        ]
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 3: Phantasy.bot',
    path: 'phantasy-bot',
    children: [
      {
        type: 'file',
        name: 'Platform.md',
        path: 'phantasy-bot/platform'
      },
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'phantasy-bot/synopsis'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'phantasy-bot/roadmap'
      },
      {
        type: 'directory',
        name: 'Okāsan',
        path: 'phantasy-bot/okasan',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: 'phantasy-bot/okasan/synopsis'
          },
          {
            type: 'file',
            name: 'Profile.md',
            path: 'phantasy-bot/okasan/profile'
          },
          {
            type: 'file',
            name: 'Measurements.md',
            path: 'phantasy-bot/okasan/measurements'
          }
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'phantasy-bot/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'phantasy-bot/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Total Supply.md',
            path: 'phantasy-bot/tokenomics/total-supply'
          },
          {
            type: 'file',
            name: 'Fees.md',
            path: 'phantasy-bot/tokenomics/fees'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'phantasy-bot/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Additional Benefits.md',
            path: 'phantasy-bot/tokenomics/additional-benefits'
          }
        ]
      }
    ]
  }
];

// Documentation content - empty object for migration to individual markdown files
export const documentationContent: Record<string, string> = {}; 