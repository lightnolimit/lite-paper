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
        name: 'Platform.md',
        path: 'banshee.sh/platform'
      },
      {
        type: 'file',
        name: 'Strategy.md',
        path: 'banshee.sh/blueprint'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: '2-banshee.sh/roadmap'
      },
      {
        type: 'directory',
        name: '@Sheena',
        path: 'phase2-banshee/sheena',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: 'banshee.sh/sheena/bio'
          },
          {
            type: 'file',
            name: 'Privacy.md',
            path: 'banshee.sh/sheena/privacy'
          },
          {
            type: 'file',
            name: 'Measurements.md',
            path: 'banshee.sh/sheena/measurements'
          }
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
    name: 'Phase 3: Okiya.fun',
    path: 'platform-okiya',
    children: [
      {
        type: 'file',
        name: 'Platform.md',
        path: 'okiya.fun/platform'
      },
      {
        type: 'file',
        name: 'Strategy.md',
        path: 'okiya.fun/blueprint'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'okiya.fun/roadmap'
      },
      {
        type: 'directory',
        name: 'Okāsan',
        path: 'okiya.fun/okasan',
        children: [
          {
            type: 'file',
            name: 'Bio.md',
            path: 'okiya.fun/okasan/bio'
          },
          {
            type: 'file',
            name: 'Profile.md',
            path: 'okiya.fun/okasan/profile'
          },
          {
            type: 'file',
            name: 'Measurements.md',
            path: 'okiya.fun/okasan/measurements'
          }
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'okiya.fun/tokenomics',
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