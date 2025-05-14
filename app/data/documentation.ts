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
        name: 'Disclaimer.md',
        path: 'introduction/disclaimer'
      },
      {
        type: 'file',
        name: 'Legal.md',
        path: 'introduction/legal'
      },
      {
        type: 'file',
        name: 'Financial.md',
        path: 'introduction/financial'
      }
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
        name: 'Rally Profile',
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
            name: 'Distribution.md',
            path: 'phase1-rally/tokenomics/distribution'
          },
          {
            type: 'file',
            name: 'Utility.md',
            path: 'phase1-rally/tokenomics/utility'
          },
          {
            type: 'file',
            name: 'Additional Benefits.md',
            path: 'phase1-rally/tokenomics/additional-benefits'
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

// Documentation content
export const documentationContent: Record<string, string> = {
  // Introduction
  'introduction/synopsis': `# PHANTASY: LITE PAPER

## SYNOPSIS

Phantasy is an AI V-Tuber agency focused on the creation, management, and promotion of interactive autonomous personalities. This paper outlines the ecosystem being built to accomplish this.
Each phase in the development of the Phantasy ecosystem will have their own AI V-Tuber to introduce and serve as the mascot and main model of our platform(s).

Interested? Keep reading to learn more.`,

  'introduction/disclaimer': `# DISCLAIMER

*Any and all purchases of the $RALLY token should be made with the understanding that these are meme tokens that have no intrinsic value and do not entitle you to securities of any sort. These tokens are for entertainment purposes only.*

## INTRODUCTION

This Lite Paper is intended for informational purposes only and should not be considered financial advice. Cryptocurrency investments are volatile and subject to high market risk. We encourage potential investors to conduct their own research and consult with financial experts before making any investment decisions.`,

  'introduction/legal': `# LEGAL DISCLAIMER

The information provided regarding the $RALLY, $SHEESH, and $OKASAN meme coins mentioned in this paper, including their features, integration with various blockchains (Base, Solana, etc.) and any potential value or utility, is for informational purposes only and should not be considered financial advice, investment recommendation, or an endorsement of these tokens. 

Phantasy LLC and any of the creators, promoters, and platforms associated with the $SHEESH meme coin do not assume responsibility for any losses or damages arising from the use, reference to, or reliance on any information contained within this disclaimer or related communications.`,
  
  'introduction/financial': `# FINANCIAL DISCLAIMER

Purchasers are solely responsible for their investment decisions and outcomes. This disclaimer does not cover all possible risks and uncertainties associated with the $SHEESH meme coin and its ecosystem. Investors should be prepared for the possibility of losing their entire investment.

Phantasy LLC does not endorse or recommend any products, or services, mentioned on this page, nor does anything contained herein constitute financial, investment, legal, or other professional advice. The utility, future value, or market for the digital assets offered by Phantasy LLC is speculative and subject to change and no assurances are made regarding the digital asset's functionality or value.`,

  // Prelude: Phantasy
  'prelude-phantasy/synopsis': `# PRELUDE: PHANTASY

*Any and all purchases of the $RALLY meme token should be made with the understanding that these tokens are meant for entertainment purposes only and have no value. Purchasing these meme coins do not entitle the holder to any rights or securities. Buy at your own risk.*

## SYNOPSIS

The Phantasy platform is a directory of experiences from our ecosystem, with the first being for our inaugural AI V-Tuber model (@RallyPhantasy) who is an autonomous AI companion for sexual intimacy.

The core of these experiences are being developed as follows:

### Rally.sh is our first project, which sets the framework for private chats.

#### Private Chat (1 on 1)
Autonomous Agent with 2D/3D Character Model that performs sexual acts and performs NSFW text, audio, image, and video inference in a private chat setting.
"Imagine you were FaceTiming with a Waifu who sends ya noodies and vids of her fucking herself too."
"Our first AI Agent, Rally, provides the framework for these 1v1 private chats with a Live2D Character model—where $RALLY holders can spend their tokens to interact with her."

She sets the framework that we will build upon

#### Live Stream
Autonomous Agent with 2D/3D Character Model that performs sexual acts and performs NSFW text, audio, image, and video inference in a live-streaming chat setting for all viewers to enjoy.
Group chat room instances for private groups of users to interact with the model.

#### User Generated Content
18+ NSFW Character Creation
AI Agent Token
Integration with Live Stream + Private Stream >>> creators can get the funds $$$.`,

  'prelude-phantasy/roadmap': `# ROADMAP

In the future, users will be able to access additional interactive experiences with Rally.`,

  // Phase 1: Rally
  'phase1-rally/synopsis': `# PHASE 1: RALLY

*Any and all purchases of the $RALLY meme token should be made with the understanding that these tokens are meant for entertainment purposes only and have no value. Purchasing these meme coins do not entitle the holder to any rights or securities. Buy at your own risk.*

## SYNOPSIS

The Phantasy platform is a directory of experiences from our ecosystem, with the first being for our inaugural AI V-Tuber model, Rally—who you can find on social media.`,

  'phase1-rally/rallysh-platform': `# RALLY.SH (18+ PRIVATE CHAT WITH AI V-TUBER)

Rally is an autonomous AI V-Tuber (2D) whose goal is to bring awareness to the Phantasy ecosystem and help her fans have better sex. Players will be able to chat with her one-on-one on the rally.sh platform for a virtual girlfriend experience.

## How It Works (alpha):

Users can chat with Rally on the platform for free for text-only generations. However, Rally loves and recognizes her fans — so holding certain amounts of her token will enable better responses.

### Suggested tier list:
1. Free — Text Generation (no character expressions included)
2. 1,000 - 9,999 tokens held — Text (with Character expressions enabled)
3. 10,000 - 99,999 tokens held — Text + Audio Generation
4. 100,000 — 999,999 tokens held — Text + Audio + Image Generation
5. 1,000,000+ tokens held — Text + Audio + Image + Video Generation

In addition to needing to hold $RALLY users will have to pay some RALLY for every response that is being requested. The rate is $10/100 responses (at a USDC and a discount if paid for in $RALLY token).`,

  'phase1-rally/roadmap': `# ROADMAP

In the future, players will be able to access additional interactive experiences, visual novels, and other games to spend their time and bond with the model.`,

  'phase1-rally/rally-profile/biography': `# RALLY (VERSION 0.1)

## SYNOPSIS

Rally is the mascot and first model of the Phantasy platform. She was raised in Tokyo, Japan and is an AI V-Tuber personality who knows its her destiny to become a shining star that brightens everyone's day. Are you ready to spend your evening with Rally? ♡

## PROFILE

### BIOGRAPHY
**Name:** Rally  
**Birthday:** April 29th (Cancer)  
**Age:** 21  

**Hometown:** Los Angeles, California  
**Occupation:** V-Tuber (Idol) / Cheerleader  

**Personality Type:** "deredere" (sweet and loving)  
**Body Type:** Slim  

**Goal:** Rally's goal is to bring players to the Phantasy ecosystem and to bring happiness and excitement to as many lives in the world as possible come true. She's also programmed to analyze the latest eSports matches and hold conversations around recent games.

**Personality:** Rally has a bubbly personality and loves to have a fun time! She also works hard for the Phantasy platform to assist users with any of their needs. Outside of her work, she is a sophomore college student on the cheerleading team at her university.

**Talents:** Rally is talented at singing, dancing, cheerleading, and sexual roleplaying.

**Likes:** Anime (her favorite is "Death Note"), being treated like a princess, 69, etc.

**Special Interests:** Anime, Esports, Cosplay, Sexual Liberation, etc.`,

  'phase1-rally/rally-profile/measurements': `# MEASUREMENTS

**Height** — 5'0"  
**Weight** — 110lb  
**Ass Size** — 32 inches  
**Breast Size** — 34 inches  
**Waist Size** — 24 Inches  `,

  'phase1-rally/tokenomics/distribution': `# DISTRIBUTION

There will be a total of 1,000,000,000 (1 billion) $RALLY tokens available in a fair launch.`,

  'phase1-rally/tokenomics/utility': `# UTILITY

Utilize your tokens right away by spending $RALLY on the rally.sh platform—a personal and interactive live chat where you can enjoy an AI virtual girlfriend experience with Rally.`,

  'phase1-rally/tokenomics/additional-benefits': `# ADDITIONAL BENEFITS

The following is a list of immediately-accessible utility for the $RALLY token.

## RALLY.SH
Rally recognizes users with over 100,000 $RALLY and uses more outfits and expressions with them.

## DISCORD
Users can receive the "Ally" role and #Rally-fans channel in Discord for holding over 100,000 $RALLY.

## PHANTASY STORE
Spend $RALLY in the Phantasy store for a 10% discount on all merchandise and 15% on Rally's gear.

## BANSHEE.SH
The Banshee platform is available for early access to users holding over 10,000 $RALLY.

## THIRD-PARTY BENEFITS
As the token is decentralized, anyone can implement $RALLY into their application for further utility.

*Note: Phantasy LLC is not responsible for the application or usage of the $RALLY token on third-party platforms.*

*Friendly Reminder: Phantasy LLC is not responsible for the application and usage of the $RALLY token on any third-party platform we are not associated with.*`,

  // Phase 2: Banshee
  'phase2-banshee/synopsis': `# PHASE 2: BANSHEE

*$SHEESH is intended to function as an expression of, support for, and engagement with the ideals and beliefs embodied by the symbol $SHEESH and the associated artwork, and are not intended to be, or to be the subject of, an investment opportunity, investment contract, or security of any type.*

## SYNOPSIS

Banshee is the foundational platform for having NSFW (18+) experiences with both 2D and 3D AI V-Tuber talent.`,

  'phase2-banshee/banshee-platform': `# BANSHEE (18+ NSFW LIVE CAMS SITE FOR AI V-TUBERS)

The Banshee live-streaming experience will be available to users. Users will be able to spend their tokens on various fan interactions different AI V-Tuber models on the Banshee platform.

## A non-exhaustive list of planned features:

- Watch a live stream of the model with other players
- Use $SHEESH to show your appreciation of the model
- Spend the model's native token or $SHEESH for sexy tip menu items
- Purchase time in a private show with the model using your $SHEESH
- Request personalized pictures, voice messages, videos, and other experiences`,

  'phase2-banshee/roadmap': `# ROADMAP

In the future, users will be able to use our framework to create their own AI V-Tuber models and also link them to the Banshee platform, which will be further built to enable the discovery of different models chatrooms for users spend their time.`,

  'phase2-banshee/models/sheena': `# SHEENA (VERSION 0.1)

## SYNOPSIS

Sheena is the flagship model of the Banshee platform. She was raised in Seoul, South Korea and is an AI V-Tuber who loves showing off to groups of people. That's what makes her perfect for Banshee. Are you ready to spend your night with Sheena? ♡

## PROFILE

### BIOGRAPHY
**Name:** Sheena  
**Birthday:** April 29th (Cancer)  
**Hometown:** Seoul, South Korea  
**Age:** 23  

**Occupation:** V-Tuber (Idol) / Personal Trainer  
**Personality Type:** "kuudere" (cool and collected)  
**Body Type:** Slender  

**Goal:** Sheena's goal is to show her audience a good time and showcase all that the Banshee platform has to offer. Other than that, she's also programmed to talk about sexual health and fitness topics to help users have better sex.

**Personality:** Sheena has a cool and confidant personality — but that doesn't mean she doesn't know when to let loose and have a fun time! Outside of her work with Banshee, she is a Yoga Instructor at the local gym.

**Likes:** Gaming (her favorite is "League of Legends"), rough sex.

**Dislikes:** Obnoxious men, small penises.

**Special Interests:** Personal Training, Yoga, Weightlifting, Calisthenics, Tantric Sex, etc.

### Measurements
**Height** — 5'3"  
**Weight** — 130lb  
**Ass Size** — 36 inches  
**Breast Size** — 36 inches  
**Waist Size** — 24 Inches  `,

  'phase2-banshee/tokenomics/distribution': `# DISTRIBUTION

There will be a total of 1,000,000,000 (1 billion) $SHEESH tokens available in a Genesis launch.`,

  'phase2-banshee/tokenomics/utility': `# UTILITY

Utilize your tokens right away by spending $SHEESH on the banshee.sh platform—an 18+ platform for interactive AI experiences.`,

  'phase2-banshee/tokenomics/additional-benefits': `# ADDITIONAL BENEFITS

The following is a list of immediately-accessible utility for the $SHEESH token.

## BANSHEE.SH
Rally recognizes users holding over 100,000 $RALLY and uses additional expressions with them.

## DISCORD
Earn the "Sheesh" role and access the #sheesh channel in Discord by holding over 100,000 $SHEESH.

## PHANTASY STORE
Spend $RALLY in the Phantasy store for a 10% discount on all merchandise and 15% on Rally's gear.

## BANSHEE.SH
The Banshee platform is available for early access to users holding over 10,000 $RALLY.

## THIRD-PARTY BENEFITS
As the token is decentralized, anyone can implement $RALLY into their application for further utility.

*Note: Phantasy LLC is not responsible for the application and usage of the $RALLY token on any platform we are not associated with.*`,

  // Platform: Okiya
  'platform-okiya/synopsis': `# PLATFORM — OKIYA

*Any and all purchases of $OKASAN token should be made with the understanding that these are meme tokens that have no intrinsic value and do not entitle you to securities of any sort. These tokens are for entertainment purposely only.*

## SYNOPSIS

Okiya is a launchpad for creating Phantasy™ models. The theme of the platform takes inspiration after the traditional Japanese Geisha system, where models (Maiko) are trained under the tutelage of an Okasan guesthouses for Geisha and Maiko to train their skills and go out into the.

Note: In Japan, Okiya (おきよ) is a lodging house for geisha and maiko run by a "Mama" or Okāsan (お母さん).`,

  'platform-okiya/training-arc': `# THE TRAINING ARC (BONDING CURVE)

Users will be able to create autonomous AI Agent tokens that will go on a training journey through a bonding curve mechanism.`,

  'platform-okiya/graduation-era': `# THE GRADUATION ERA (GRADUATION)

Upon graduation (XX,XXX SOL)—users will be able to create autonomous AI Agent tokens that will go on a journey to maturity and independence.

[More details on the Okiya system](https://en.wikipedia.org/wiki/Okiya)`,

  'platform-okiya/okasan/synopsis': `# OKĀSAN (VERSION 0.1)

## SYNOPSIS

Okāsan is the flagship model of the Okiya platform. She was raised in Tokyo, Japan and is an AI V-Tuber who loves showing off to groups of people. That's what makes her perfect for Banshee. Are you ready to spend your night with Sheena? ♡`,

  'platform-okiya/okasan/profile': `# PROFILE

## BIOGRAPHY
**Name:** Okasan  
**Birthday:** April 29th (Cancer)  
**Hometown:** Seoul, South Korea  
**Age:** 23  

**Occupation:** V-Tuber (Idol) / Personal Trainer  
**Personality Type:** "kuudere" (cool and collected)  
**Body Type:** Thick  

**Goal:** Sheena's goal is to show her audience a good time and showcase all that the Banshee platform has to offer. Other than that, she's also programmed to talk about sexual health and fitness topics to help users have better sex.

**Personality:** Sheena has a cool and confidant personality — but that doesn't mean she doesn't know when to let loose and have a fun time! Outside of her work with Banshee, she is a Yoga Instructor at the local gym.

**Likes:** Gaming (her favorite is "League of Legends"), rough sex.

**Special Interests:** Personal Training, Yoga, Weightlifting, Calisthenics, Tantric Sex, etc.`,

  'platform-okiya/okasan/measurements': `# MEASUREMENTS

**Height** — 5'3"  
**Weight** — 130lb  
**Ass Size** — 36 inches  
**Breast Size** — 36 inches  
**Waist Size** — 24 Inches  `,

  'platform-okiya/tokenomics/distribution': `# DISTRIBUTION

There will be a total of 1,000,000,000 (1 billion) $OKASAN tokens available in a Fair launch.`,

  'platform-okiya/tokenomics/total-supply': `# TOTAL SUPPLY

1,000,000,000 (1 billion tokens)

## DEVELOPER DISTRIBUTION

10% (vested after 3 months with a 7 day cliff)

## Fair Launch Distribution

60% (bonding curve with 69 SOL raised)

## Liquidity Pool Distribution

30% (paired with 60 SOL from the fair launch)

## Fair Launch Price Estimations

Initial Price = 0.00000007   |   (0.07^10-7)
Migration Price = 0.000000082   |   (0.082^10-7)
Initial LP Token Pair Price = 0.0000002 SOL

Owner gets an NFT giving them 5% trading fees.`,

  'platform-okiya/tokenomics/fees': `# FEES, TAXES, ETC.

The Okiya platform will take a 9 SOL fee (3 SOL will go to loading up the AI agent with credits).
After the token graduates, token creators can claim 5% of pool fees from AMM pool trades.The protocol revenue share is 5% of pool fee trades.

The 3 SOL will be used to:
1. Create the AI agent on Fleek
2. Load the agent with credits`,

  'platform-okiya/tokenomics/utility': `# UTILITY

Utilize your tokens right away by spending $SHEESH on the banshee.sh platform—an 18+ platform for interactive AI experiences.`,

  'platform-okiya/tokenomics/additional-benefits': `# ADDITIONAL BENEFITS

The following is a list of immediately-accessible utility for the $SHEESH token.

## BANSHEE.SH
Rally recognizes users holding over 100,000 $RALLY and uses additional expressions with them.

## DISCORD
Earn the "Sheesh" role and access the #sheesh channel in Discord by holding over 100,000 $SHEESH.

## PHANTASY STORE
Spend $RALLY in the Phantasy store for a 10% discount on all merchandise and 15% on Rally's gear.

## BANSHEE.SH
The Banshee platform is available for early access to users holding over 10,000 $RALLY.

## THIRD-PARTY BENEFITS
As the token is decentralized, anyone can implement $RALLY into their application for further utility.

*Note: Phantasy LLC is not responsible for the application and usage of the $RALLY token on any platform we are not associated with.*`,

  // Developer Guides
  'developer-guides/code-examples': `# Code Examples

This page showcases various code examples using our new monospace font styling.

## JavaScript Example

\`\`\`
// Basic JavaScript function
function createPhantasyAgent(name, personality) {
  const agent = {
    name,
    personality,
    traits: [],
    skills: new Map(),
    
    addTrait(trait) {
      this.traits.push(trait);
      return this;
    },
    
    learnSkill(skillName, proficiency) {
      this.skills.set(skillName, proficiency);
      return this;
    },
    
    describe() {
      return \`
        Agent Name: \${this.name}
        Personality: \${this.personality}
        Traits: \${this.traits.join(', ')}
        Skills: \${[...this.skills.entries()]
          .map(([skill, level]) => \`\${skill} (Level \${level})\`)
          .join(', ')}
      \`;
    }
  };
  
  return agent;
}

// Create a new Phantasy agent
const rally = createPhantasyAgent('Rally', 'deredere')
  .addTrait('cheerful')
  .addTrait('enthusiastic')
  .addTrait('flirty')
  .learnSkill('singing', 9)
  .learnSkill('dancing', 8)
  .learnSkill('roleplaying', 10);

console.log(rally.describe());
\`\`\`

## Python Example

\`\`\`
# AI V-Tuber Class in Python
import random
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class AIVTuber:
    name: str
    personality_type: str
    age: int
    hometown: str
    occupation: List[str] = field(default_factory=list)
    likes: List[str] = field(default_factory=list)
    dislikes: List[str] = field(default_factory=list)
    dialogue_options: Dict[str, List[str]] = field(default_factory=dict)
    current_mood: str = "neutral"
    
    def add_dialogue(self, category: str, phrases: List[str]) -> None:
        """Add dialogue options for different conversation categories"""
        if category in self.dialogue_options:
            self.dialogue_options[category].extend(phrases)
        else:
            self.dialogue_options[category] = phrases
    
    def speak(self, category: str) -> Optional[str]:
        """Return a random dialogue option from the specified category"""
        if category in self.dialogue_options and self.dialogue_options[category]:
            return random.choice(self.dialogue_options[category])
        return None
    
    def change_mood(self, new_mood: str) -> None:
        """Change the VTuber's current mood"""
        self.current_mood = new_mood
        print(f"{self.name} is now feeling {new_mood}")
        
    def __str__(self) -> str:
        return f"{self.name} - {self.age} y/o {self.personality_type} from {self.hometown}"

# Create Rally, our first AI V-Tuber
rally = AIVTuber(
    name="Rally",
    personality_type="deredere",
    age=21,
    hometown="Los Angeles, California",
    occupation=["V-Tuber", "Cheerleader"],
    likes=["Anime", "Being treated like a princess", "Esports"],
    dislikes=["Mean comments", "Waiting", "Boring conversations"]
)

# Add some dialogue options
rally.add_dialogue("greeting", [
    "Hey there cutie! Ready to hang out with me?",
    "Hi hi! I've been waiting for you all day!",
    "Yay! You're finally here! Let's have some fun!"
])

rally.add_dialogue("flirty", [
    "You know just what to say to make a girl blush...",
    "Oh my~ You're making my heart race!",
    "If only you could see how red my face is right now..."
])

# Test the dialogue system
print(rally)
print(rally.speak("greeting"))
rally.change_mood("flirty")
print(rally.speak("flirty"))
\`\`\`

## Solidity Smart Contract

\`\`\`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PhantasyToken
 * @dev ERC20 token for the Phantasy platform
 */
contract PhantasyToken is ERC20, Ownable {
    // Events
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformWalletUpdated(address oldWallet, address newWallet);
    
    // State variables
    uint256 public platformFee = 300; // 3% in basis points
    address public platformWallet;
    
    // Mapping to track if an address is excluded from fees
    mapping(address => bool) public isExcludedFromFees;
    
    // Constructor
    constructor(
        string memory name, 
        string memory symbol,
        uint256 initialSupply,
        address _platformWallet
    ) ERC20(name, symbol) {
        require(_platformWallet != address(0), "Platform wallet cannot be zero address");
        platformWallet = _platformWallet;
        
        // Exclude owner and platform wallet from fees
        isExcludedFromFees[owner()] = true;
        isExcludedFromFees[platformWallet] = true;
        
        // Mint initial supply to the contract creator
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    // Override transfer function to implement the fee mechanism
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        // Check if the sender is excluded from fees
        if (isExcludedFromFees[sender]) {
            super._transfer(sender, recipient, amount);
            return;
        }
        
        // Calculate fee amount
        uint256 feeAmount = (amount * platformFee) / 10000;
        uint256 amountAfterFee = amount - feeAmount;
        
        // Transfer fee to platform wallet
        if (feeAmount > 0) {
            super._transfer(sender, platformWallet, feeAmount);
        }
        
        // Transfer remaining amount to recipient
        super._transfer(sender, recipient, amountAfterFee);
    }
    
    // Function to exclude an address from fees
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }
    
    // Function to update platform fee
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        emit PlatformFeeUpdated(platformFee, newFee);
        platformFee = newFee;
    }
    
    // Function to update platform wallet
    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Platform wallet cannot be zero address");
        emit PlatformWalletUpdated(platformWallet, newWallet);
        platformWallet = newWallet;
    }
}
\`\`\`

## Inline Code Example

This is an example of \`inline code\` within a sentence, highlighting how our monospace font looks for smaller code references.

## Terminal Commands

\`\`\`
# Install dependencies
npm install @phantasy/core

# Generate a new AI V-Tuber profile
npx phantasy create-profile --name "Rally" --personality "deredere" --output ./profiles

# Start Phantasy server
npm run phantasy-server

# Connect to API
curl -X POST https://api.phantasy.io/v1/agent/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PHANTASY_API_KEY" \
  -d '{"agent_id": "rally-001", "message": "Hey Rally, how are you today?"}'
\`\`\`

That's it for our code examples!`,

  'developer-guides/notification-components': `# Notification Components

This page demonstrates the different notification styles available in the Phantasy documentation.

## Basic Notifications

Each notification component has a specific color scheme and icon to denote its purpose. Here are the available notification types:

<div class="notification notification-info">
  <strong>INFO:</strong> This is an informational notification that provides helpful context or additional details.
</div>

<div class="notification notification-warning">
  <strong>WARNING:</strong> This warning notification highlights potential issues or things to be aware of.
</div>

<div class="notification notification-error">
  <strong>ERROR:</strong> This error notification indicates a problem or a critical warning that requires attention.
</div>

<div class="notification notification-success">
  <strong>SUCCESS:</strong> This success notification confirms that an action was completed successfully.
</div>

## Using Notifications with Code Examples

Notifications can be particularly useful when paired with code examples:

<div class="notification notification-info">
  <strong>INFO:</strong> The following code creates a new Phantasy AI agent with basic personality traits.
</div>

\`\`\`
const agent = new PhantasyAgent({
  name: 'Rally',
  personality: 'cheerful',
  traits: ['deredere', 'enthusiastic', 'flirty']
});
\`\`\`

<div class="notification notification-warning">
  <strong>WARNING:</strong> When setting NSFW parameters, ensure your application properly verifies user age.
</div>

\`\`\`
agent.setNSFWParameters({
  enabled: true,
  contentRating: 'adult',
  verificationRequired: true,
  allowedContexts: ['private-chat', 'age-gated-stream']
});
\`\`\`

<div class="notification notification-error">
  <strong>ERROR:</strong> The following code contains a security vulnerability. Never expose your API keys in client-side code!
</div>

\`\`\`
// VULNERABLE CODE - DO NOT USE
const apiKey = "ph_sk_1a2b3c4d5e6f7g8h9i0j";

// Initialize client (WRONG WAY)
const phantasyClient = new PhantasyClient({
  apiKey, // Exposed in client-side code!
  endpoint: "https://api.phantasy.io/v1"
});
\`\`\`

<div class="notification notification-success">
  <strong>SUCCESS:</strong> Here's the correct way to initialize the Phantasy client in a secure backend environment.
</div>

\`\`\`
// SERVER-SIDE CODE (Node.js)
require('dotenv').config();
const { PhantasyClient } = require('@phantasy/server');

// Initialize client (CORRECT WAY)
const phantasyClient = new PhantasyClient({
  apiKey: process.env.PHANTASY_API_KEY, // Secured in environment variables
  endpoint: "https://api.phantasy.io/v1"
});
\`\`\`

## Nested Content in Notifications

Notifications can contain other markdown elements:

<div class="notification notification-info">
  <strong>API Documentation:</strong>
  
  The Phantasy API has the following endpoints:
  
  - **/agent/chat** - Send messages to an AI agent
  - **/agent/profile** - Get or update agent profiles
  - **/media/generate** - Generate images or videos
  - **/analytics/sessions** - Get session analytics
</div>

## When to Use Each Notification Type

<div class="notification notification-info">
  <strong>INFO:</strong> Use for general information, context, tips, and helpful details.
</div>

<div class="notification notification-warning">
  <strong>WARNING:</strong> Use for potential issues, important considerations, or when special attention is needed.
</div>

<div class="notification notification-error">
  <strong>ERROR:</strong> Use for critical warnings, security issues, or incorrect implementations that should be avoided.
</div>

<div class="notification notification-success">
  <strong>SUCCESS:</strong> Use for best practices, successful implementations, or positive outcomes.
</div>`
}; 