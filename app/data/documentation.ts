import { FileItem } from "../components/FileTree";

export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Introduction',
    path: 'introduction',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'introduction/synopsis'
      },
      {
        type: 'file',
        name: 'Disclaimers.md',
        path: 'introduction/disclaimers'
      },
    ]
  },
  {
    type: 'directory',
    name: 'Prelude: Phantasy',
    path: 'prelude-phantasy',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'prelude-phantasy/synopsis'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'prelude-phantasy/roadmap'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Developer Guides',
    path: 'developer-guides',
    children: [
      {
        type: 'file',
        name: 'Code Examples.md',
        path: 'developer-guides/code-examples'
      },
      {
        type: 'file',
        name: 'Notification Components.md',
        path: 'developer-guides/notification-components'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 1: Rally',
    path: 'phase1-rally',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'phase1-rally/synopsis'
      },
      {
        type: 'file',
        name: 'Rally.sh Platform.md',
        path: 'phase1-rally/rallysh-platform'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'phase1-rally/roadmap'
      },
      {
        type: 'directory',
        name: '@Rally',
        path: 'phase1-rally/rally-profile',
        children: [
          {
            type: 'file',
            name: 'Biography.md',
            path: 'phase1-rally/rally-profile/biography'
          },
          {
            type: 'file',
            name: 'Measurements.md',
            path: 'phase1-rally/rally-profile/measurements'
          },
          {
            type: 'file',
            name: 'Technology.md',
            path: 'phase1-rally/rally-profile/technology'
          }
        ]
      },
      {
        type: 'directory',
        name: 'Tokenomics',
        path: 'phase1-rally/tokenomics',
        children: [
          {
            type: 'file',
            name: 'Index.md',
            path: 'phase1-rally/tokenomics/index'
          },
          {
            type: 'file',
            name: 'Distribution.md',
            path: 'phase1-rally/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'phase1-rally/tokenomics/utility'
          }
        ]
      }
    ]
  },
  {
    type: 'directory',
    name: 'Phase 2: Banshee',
    path: 'phase2-banshee',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'phase2-banshee/synopsis'
      },
      {
        type: 'file',
        name: 'Banshee Platform.md',
        path: 'phase2-banshee/banshee-platform'
      },
      {
        type: 'file',
        name: 'Roadmap.md',
        path: 'phase2-banshee/roadmap'
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
    name: 'Platform: Okiya',
    path: 'platform-okiya',
    children: [
      {
        type: 'file',
        name: 'Synopsis.md',
        path: 'platform-okiya/synopsis'
      },
      {
        type: 'file',
        name: 'Training Arc.md',
        path: 'platform-okiya/training-arc'
      },
      {
        type: 'file',
        name: 'Graduation Era.md',
        path: 'platform-okiya/graduation-era'
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