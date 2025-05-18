import { FileItem } from "../components/FileTree";

export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Intro',
    path: 'intro',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'intro/synopsis'
      },
      {
        type: 'file',
        name: 'Disclaimers.md',
        path: 'intro/disclaimers'
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
        path: 'rally.sh/rally-profile',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: '1-rally.sh/rally/bio'
          },
          {
            type: 'file',
            name: 'Privacy.md',
            path: '1-rally.sh/rally/privacy'
          },
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: '1-rally.sh/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Index.md',
            path: '1-rally.sh/tokenomics/index'
          },
          {
            type: 'file',
            name: 'Distribution.md',
            path: '1-rally.sh/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: '1-rally.sh/tokenomics/utility'
          }
        ]
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 2: Banshee.sh',
    path: 'phase2-banshee',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: '2-banshee.sh/synopsis'
      },
      {
        type: 'file',
        name: 'Banshee Platform.md',
        path: '2-banshee.sh/banshee-platform'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: '2-banshee.sh/roadmap'
      },
      {
        type: 'directory',
        name: 'Models',
        path: 'phase2-banshee/models',
        children: [
          {
            type: 'file',
            name: 'Sheena.md',
            path: 'phase2-banshee/models/sheena'
          }
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'phase2-banshee/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'phase2-banshee/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'phase2-banshee/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Additional Benefits.md',
            path: 'phase2-banshee/tokenomics/additional-benefits'
          }
        ]
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 3: Phantasy.bot',
    path: 'platform-okiya',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'platform-okiya/synopsis'
      },
      {
        type: 'file',
        name: 'Platform.md',
        path: 'phantasy-bot/platform'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'platform-okiya/roadmap'
      },
      {
        type: 'directory',
        name: 'Okāsan',
        path: 'platform-okiya/okasan',
        children: [
          {
            type: 'file',
            name: 'Synopsis.md',
            path: 'platform-okiya/okasan/synopsis'
          },
          {
            type: 'file',
            name: 'Profile.md',
            path: 'platform-okiya/okasan/profile'
          },
          {
            type: 'file',
            name: 'Measurements.md',
            path: 'platform-okiya/okasan/measurements'
          }
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'platform-okiya/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'platform-okiya/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Total Supply.md',
            path: 'platform-okiya/tokenomics/total-supply'
          },
          {
            type: 'file',
            name: 'Fees.md',
            path: 'platform-okiya/tokenomics/fees'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'platform-okiya/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Additional Benefits.md',
            path: 'platform-okiya/tokenomics/additional-benefits'
          }
        ]
      }
    ]
  }
];

// Documentation content - empty object for migration to individual markdown files
export const documentationContent: Record<string, string> = {}; 