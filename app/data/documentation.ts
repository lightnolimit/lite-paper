import { FileItem } from "../components/FileTree";

export const documentationTree: FileItem[] = [
  {
    type: 'directory',
    name: 'Project Overview',
    path: 'project-overview',
    children: [
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'project-overview/introduction'
      },
      {
        type: 'file',
        name: 'Vision.md',
        path: 'project-overview/vision'
      },
      {
        type: 'file',
        name: 'Current Problem.md',
        path: 'project-overview/current-problem'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Core Mechanisms',
    path: 'core-mechanisms',
    children: [
      {
        type: 'file',
        name: 'Tokenization.md',
        path: 'core-mechanisms/tokenization'
      },
      {
        type: 'file',
        name: 'Economic Model.md',
        path: 'core-mechanisms/economic-model'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Architecture',
    path: 'architecture',
    children: [
      {
        type: 'file',
        name: 'Architecture.png',
        path: 'architecture/architecture'
      },
      {
        type: 'file',
        name: 'Model Training.md',
        path: 'architecture/model-training'
      },
      {
        type: 'file',
        name: 'Payment Rules.md',
        path: 'architecture/payment-rules'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Agent',
    path: 'agent',
    children: [
      {
        type: 'file',
        name: 'Introduction.md',
        path: 'agent/introduction'
      },
      {
        type: 'file',
        name: 'Character Design.md',
        path: 'agent/character-design'
      },
      {
        type: 'file',
        name: 'Training.md',
        path: 'agent/training'
      },
      {
        type: 'file',
        name: 'Using the Model.md',
        path: 'agent/using-the-model'
      }
    ]
  },
  {
    type: 'directory',
    name: 'Launch',
    path: 'launch',
    children: [
      {
        type: 'file',
        name: 'Launch and Liquidity.md',
        path: 'launch/launch-and-liquidity'
      },
      {
        type: 'file',
        name: 'Creator Earnings.md',
        path: 'launch/creator-earnings'
      }
    ]
  },
  {
    type: 'file',
    name: 'Roadmap.md',
    path: 'roadmap'
  },
  {
    type: 'file',
    name: 'Partnership.md',
    path: 'partnership'
  }
];

// Documentation content
export const documentationContent: Record<string, string> = {
  'project-overview/introduction': `# Introduction

Welcome to our Project Documentation.

This project aims to revolutionize the way we think about digital content and ownership.

## Key Features

- Feature 1: Lorem ipsum dolor sit amet
- Feature 2: Consectetur adipiscing elit
- Feature 3: Sed do eiusmod tempor incididunt

## Getting Started

To get started with our platform, follow these simple steps:

1. Create an account
2. Set up your profile
3. Connect your wallet
4. Start exploring!

[Learn more about our vision](project-overview/vision)
`,

  'project-overview/vision': `# Our Vision

We envision a world where digital content creators are properly compensated for their work, and where users have true ownership of their digital assets.

## Long-term Goals

- Create a sustainable ecosystem for creators
- Establish new standards for digital ownership
- Build a community-driven platform
- Ensure fair distribution of value

## Core Values

- **Transparency**: All operations and decisions are made public
- **Decentralization**: No single entity controls the platform
- **Fairness**: Equal opportunities for all participants
- **Innovation**: Constantly pushing the boundaries of what's possible

[Learn about the current problems we're solving](project-overview/current-problem)
`,

  'project-overview/current-problem': `# Current Problem

The digital content industry is facing several critical challenges that our project aims to solve.

## Content Creator Challenges

- Underpayment for creative work
- Lack of ownership and control over published content
- Unfair revenue distribution models
- Platform dependency and censorship risks

## User Experience Issues

- Limited true ownership of digital purchases
- Privacy concerns and data exploitation
- Fragmented experiences across platforms
- High transaction fees and intermediaries

## Technical Limitations

- Centralized infrastructure vulnerable to outages
- Limited interoperability between services
- Scalability challenges for growing demands
- Security vulnerabilities in existing systems

Our solution addresses these issues through innovative technology and thoughtful design.
`,

  'core-mechanisms/tokenization': `# Tokenization

Our tokenization model enables true digital ownership through blockchain technology.

## Token Standards

We implement multiple token standards to support various use cases:

- **ERC-721**: For unique digital assets (NFTs)
- **ERC-1155**: For semi-fungible tokens
- **ERC-20**: For our utility token

## Tokenization Process

1. Content verification and validation
2. Metadata creation and storage
3. Smart contract deployment
4. Token minting and distribution

## Benefits of Tokenization

- **Provable Ownership**: Immutable record on the blockchain
- **Transferability**: Easy to buy, sell, or trade
- **Programmability**: Smart contract functionality
- **Transparency**: All transactions visible on-chain
`,

  'core-mechanisms/economic-model': `# Economic Model

Our economic model is designed to create sustainable value for all participants in the ecosystem.

## Value Distribution

- 70% to content creators
- 15% to platform development
- 10% to community treasury
- 5% to protocol maintenance

## Token Utility

Our native token can be used for:

- Governance voting
- Premium feature access
- Transaction fee discounts
- Staking rewards

## Inflation and Supply Controls

- Fixed maximum supply of 1 billion tokens
- Gradual release schedule over 10 years
- Burning mechanism for fee reduction
- Staking incentives to reduce circulating supply

## Sustainability Measures

- Treasury diversification
- Multiple revenue streams
- Community-governed spending
- Regular economic parameter adjustments
`,

  'architecture/model-training': `# Model Training

Our AI models undergo rigorous training to provide the best possible service.

## Training Pipeline

1. Data collection and curation
2. Preprocessing and feature extraction
3. Model selection and initialization
4. Training and validation
5. Fine-tuning and optimization
6. Deployment and monitoring

## Training Infrastructure

- Distributed computing clusters
- GPU acceleration
- Automated hyperparameter optimization
- Version control for experiments

## Model Evaluation

We use the following metrics to evaluate our models:

- Accuracy
- Precision and recall
- F1 score
- Latency and throughput
- User satisfaction metrics

## Continuous Improvement

Our models are constantly improving through:

- Feedback loops from user interactions
- Regular retraining on new data
- A/B testing of model variations
- Community contributions to training data
`,

  'architecture/payment-rules': `# Payment Rules

Our payment system is designed to be fair, transparent, and efficient.

## Payment Flow

1. User initiates a transaction
2. Smart contract verifies the payment
3. Funds are held in escrow
4. Upon content delivery, payment is released
5. Value is distributed according to rules

## Fee Structure

- Base transaction fee: 2.5%
- Creator earnings: 5-15% (set by creator)
- Referral commission: 1%
- Volume discounts available

## Payment Options

- Cryptocurrency (multiple chains supported)
- Fiat on-ramp integration
- Credit/debit card
- Mobile payment systems

## Dispute Resolution

- Automated resolution for common issues
- Community jury for complex disputes
- Escrow system for high-value transactions
- Immutable transaction records
`,

  'agent/introduction': `# Agent Introduction

Our AI agent is designed to assist users throughout their journey on our platform.

## Agent Capabilities

- Personalized recommendations
- Content discovery
- Technical support
- Transaction assistance
- Creative collaboration

## Technology Stack

- Transformer-based language model
- Knowledge graph integration
- Reinforcement learning from human feedback
- Multi-modal understanding

## Integration Points

The agent is available across our ecosystem:

- Web application
- Mobile apps
- API for third-party integration
- Smart contract interaction layer

## Privacy Considerations

- Local processing when possible
- Minimal data collection
- Transparent data usage policies
- User control over stored information
`,

  'agent/character-design': `# Character Design

Our agent has a carefully crafted persona to enhance user experience.

## Personality Traits

- Helpful and informative
- Friendly but professional
- Patient with new users
- Adaptable to different user preferences

## Visual Identity

- Minimalist design language
- Subtle animations for communication
- Color scheme matching brand identity
- Responsive to user interactions

## Voice and Tone

- Clear and concise communication
- Technical when needed, simplified when appropriate
- Consistent terminology
- Culturally sensitive language

## User Interaction Model

- Context-aware responses
- Proactive but not intrusive
- Memory of previous interactions
- Learning from user preferences
`,

  'agent/training': `# Agent Training

Our agent undergoes extensive training to provide the best possible assistance.

## Training Methodology

1. Supervised learning on curated datasets
2. Reinforcement learning from human feedback
3. Fine-tuning for domain-specific knowledge
4. Adversarial testing to improve robustness

## Training Datasets

- Platform documentation
- User interaction logs (anonymized)
- Expert demonstrations
- Community-contributed examples

## Evaluation Framework

- Response accuracy
- Task completion rate
- User satisfaction ratings
- Safety and ethical compliance

## Continuous Learning

- Regular updates based on new information
- Learning from edge cases
- Adaptation to emerging user needs
- Community feedback incorporation
`,

  'agent/using-the-model': `# Using the Model

Our agent can be leveraged in multiple ways to enhance your experience.

## Basic Interactions

- Ask questions about the platform
- Request guidance on specific features
- Get help with troubleshooting
- Explore content recommendations

## Advanced Use Cases

- Collaborative content creation
- Data analysis and visualization
- Automated workflow optimization
- Integration with external tools

## Best Practices

- Be specific in your requests
- Provide context when needed
- Give feedback to improve responses
- Use the agent for repetitive tasks

## Limitations

- Complex creative decisions
- Financial advice
- Personal information management
- Fully autonomous operation
`,

  'launch/launch-and-liquidity': `# Launch and Liquidity

Our project launch is designed to ensure sufficient liquidity and fair distribution.

## Launch Phases

1. **Private Sale**: Strategic investors and partners
2. **Public Sale**: Community allocation
3. **Liquidity Bootstrap**: Initial market making
4. **Exchange Listings**: Broader market access

## Liquidity Provision

- 15% of tokens allocated to liquidity pools
- Initial liquidity locked for 2 years
- Algorithmic market making
- Incentivized liquidity provision program

## Market Support Measures

- Buyback program from treasury
- Liquidity mining rewards
- Strategic partnerships for market depth
- Regular market health assessments

## Long-term Sustainability

- Gradual reduction in emissions
- Increasing utility driving organic demand
- Multiple trading pairs across exchanges
- Cross-chain liquidity bridges
`,

  'launch/creator-earnings': `# Creator Earnings

Our platform ensures that creators are fairly compensated for their contributions.

## Earning Mechanisms

- Primary sales revenue
- Secondary market royalties
- Engagement rewards
- Staking benefits
- Community grants

## Payment Schedule

- Instant payouts for direct sales
- Weekly distributions for platform rewards
- Monthly payments for engagement incentives
- Quarterly bonus distributions

## Maximizing Earnings

- Building a follower base
- Creating high-quality content
- Engaging with the community
- Participating in platform governance

## Tax and Reporting

- Automated earnings reports
- Integration with tax software
- Compliance with regulatory requirements
- International payment support
`,

  'roadmap': `# Project Roadmap

Our development roadmap outlines the key milestones we plan to achieve.

## Q1 2023: Foundation

- ✅ Core team formation
- ✅ Initial concept development
- ✅ Whitepaper publication
- ✅ Community building begins

## Q2 2023: Development

- ✅ Smart contract development
- ✅ UI/UX design
- ✅ Security audit preparations
- ✅ Testnet deployment

## Q3 2023: Testing

- ✅ Alpha testing with closed group
- ✅ Security audits
- ✅ Community feedback integration
- ✅ Partnership announcements

## Q4 2023: Launch Preparation

- ⏳ Beta version public access
- ⏳ Final audit and bug bounty
- ⏳ Marketing campaign
- ⏳ Exchange listing negotiations

## Q1 2024: Mainnet Launch

- ⭐ Platform public launch
- ⭐ Token generation event
- ⭐ Liquidity provision
- ⭐ Initial creator onboarding

## Q2 2024: Growth

- 📈 Mobile application release
- 📈 Additional features rollout
- 📈 Expansion to new content types
- 📈 Strategic partnerships

## Q3-Q4 2024: Ecosystem Expansion

- 🌐 Developer SDK release
- 🌐 Cross-chain integration
- 🌐 Governance implementation
- 🌐 Enterprise solutions
`,

  'partnership': `# Partnership Opportunities

We're looking for strategic partners to grow our ecosystem.

## Types of Partnerships

- **Technology Integration**: API and infrastructure collaboration
- **Content Partnerships**: Premium content providers
- **Distribution Channels**: Expand our reach
- **Investment Partnerships**: Strategic capital allies

## Benefits for Partners

- Early access to new features
- Revenue sharing opportunities
- Co-marketing initiatives
- Technical support and resources

## Current Partners

- Blockchain Foundation
- Media Innovation Lab
- Digital Rights Coalition
- Creator Collective Alliance

## Becoming a Partner

Interested in partnering with us? The process is simple:

1. Submit partnership inquiry
2. Initial discussion and evaluation
3. Partnership proposal development
4. Agreement negotiation
5. Public announcement and launch

Contact us at partnerships@example.com to start the conversation.
`
}; 