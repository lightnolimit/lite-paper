# Code Examples

This page showcases various code examples using our new monospace font styling.

## JavaScript Example

```
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
      return `
        Agent Name: ${this.name}
        Personality: ${this.personality}
        Traits: ${this.traits.join(', ')}
        Skills: ${[...this.skills.entries()]
          .map(([skill, level]) => `${skill} (Level ${level})`)
          .join(', ')}
      `;
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
```

## Python Example

```
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
```

## Solidity Smart Contract

```
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
```

## Inline Code Example

This is an example of `inline code` within a sentence, highlighting how our monospace font looks for smaller code references.

## Terminal Commands

```
# Install dependencies
npm install @phantasy/core

# Generate a new AI V-Tuber profile
npx phantasy create-profile --name "Rally" --personality "deredere" --output ./profiles

# Start Phantasy server
npm run phantasy-server

# Connect to API
curl -X POST https://api.phantasy.io/v1/agent/chat   -H "Content-Type: application/json"   -H "Authorization: Bearer $PHANTASY_API_KEY"   -d '{"agent_id": "rally-001", "message": "Hey Rally, how are you today?"}'
```

That's it for our code examples!