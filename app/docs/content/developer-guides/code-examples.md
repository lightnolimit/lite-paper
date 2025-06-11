# Code Examples

Welcome to the comprehensive code examples section! Here you'll find practical examples of how to integrate with the Phantasy platform using various programming languages and frameworks.

## Getting Started

Let's start with a simple API call example:

```javascript
// Basic API call to get user information
const response = await fetch('https://api.phantasy.io/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
});

const userData = await response.json();
console.log('User data:', userData);
```

## Multi-Language SDK Examples

Here's how to authenticate with our API using different programming languages:

```javascript|python|bash
// JavaScript/Node.js
import { PhantasyClient } from '@phantasy/sdk';

const client = new PhantasyClient({
  apiKey: process.env.PHANTASY_API_KEY,
  environment: 'production'
});

async function authenticateUser() {
  try {
    const auth = await client.auth.login({
      email: 'user@example.com',
      password: 'secure_password'
    });
    
    console.log('Authentication successful:', auth.token);
    return auth;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}
---
# Python
import os
from phantasy_sdk import PhantasyClient

client = PhantasyClient(
    api_key=os.getenv('PHANTASY_API_KEY'),
    environment='production'
)

def authenticate_user():
    try:
        auth = client.auth.login(
            email='user@example.com',
            password='secure_password'
        )
        
        print(f'Authentication successful: {auth.token}')
        return auth
    except Exception as error:
        print(f'Authentication failed: {error}')
        raise
---
# Bash/cURL
#!/bin/bash

API_KEY="${PHANTASY_API_KEY}"
API_URL="https://api.phantasy.io/v1"

# Authenticate user
response=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }')

token=$(echo $response | jq -r '.token')
echo "Authentication successful: $token"
```

## Smart Contract Integration

Working with smart contracts on the Phantasy platform:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@phantasy/contracts/interfaces/IPhantasyNFT.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhantasyGameItem is ERC721, Ownable, IPhantasyNFT {
    uint256 private _tokenIdCounter;
    mapping(uint256 => ItemMetadata) public itemMetadata;
    
    struct ItemMetadata {
        string name;
        uint256 level;
        uint256 rarity;
        uint256 gameId;
    }
    
    constructor() ERC721("PhantasyGameItem", "PGI") {}
    
    function mintItem(
        address to,
        string memory name,
        uint256 level,
        uint256 rarity,
        uint256 gameId
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        
        itemMetadata[tokenId] = ItemMetadata({
            name: name,
            level: level,
            rarity: rarity,
            gameId: gameId
        });
        
        _safeMint(to, tokenId);
        
        emit ItemMinted(to, tokenId, name, level);
        return tokenId;
    }
    
    function getItemMetadata(uint256 tokenId) 
        public 
        view 
        returns (ItemMetadata memory) {
        require(_exists(tokenId), "Item does not exist");
        return itemMetadata[tokenId];
    }
    
    event ItemMinted(
        address indexed to, 
        uint256 indexed tokenId, 
        string name, 
        uint256 level
    );
}
```

## React Integration

Building a React component that integrates with Phantasy services:

```tsx
import React, { useState, useEffect } from 'react';
import { usePhantasy } from '@phantasy/react-hooks';
import { Button, Card, Loader } from '@phantasy/ui-components';

interface GameStats {
  level: number;
  experience: number;
  items: number;
  achievements: number;
}

const PlayerDashboard: React.FC = () => {
  const { user, isConnected, connect } = usePhantasy();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isConnected && user) {
      fetchPlayerStats();
    }
  }, [isConnected, user]);
  
  const fetchPlayerStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/players/${user.id}/stats`);
      const playerStats = await response.json();
      setStats(playerStats);
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to view your gaming stats and achievements.
        </p>
        <Button onClick={connect} variant="primary">
          Connect Wallet
        </Button>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className="text-center p-8">
        <Loader />
        <p className="mt-4">Loading your stats...</p>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold text-gray-600">Level</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.level || 0}</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold text-gray-600">Experience</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats?.experience?.toLocaleString() || 0}
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold text-gray-600">Items</h3>
        <p className="text-3xl font-bold text-purple-600">{stats?.items || 0}</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold text-gray-600">Achievements</h3>
        <p className="text-3xl font-bold text-orange-600">
          {stats?.achievements || 0}
        </p>
      </Card>
    </div>
  );
};

export default PlayerDashboard;
```

## Configuration Examples

### Environment Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  phantasy-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PHANTASY_API_KEY=${PHANTASY_API_KEY}
      - PHANTASY_ENVIRONMENT=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - database
      
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=phantasy
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      
volumes:
  pgdata:
```

### Package Configuration

```json
{
  "name": "my-phantasy-app",
  "version": "1.0.0",
  "description": "A gaming application built with Phantasy platform",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
  },
  "dependencies": {
    "@phantasy/sdk": "^2.1.0",
    "@phantasy/react-hooks": "^1.5.0",
    "@phantasy/ui-components": "^3.2.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Testing Examples

### Unit Tests

```javascript
// tests/auth.test.js
import { PhantasyClient } from '@phantasy/sdk';
import { jest } from '@jest/globals';

describe('Authentication', () => {
  let client;
  
  beforeEach(() => {
    client = new PhantasyClient({
      apiKey: 'test-api-key',
      environment: 'testing'
    });
  });
  
  test('should authenticate user with valid credentials', async () => {
    const mockResponse = {
      token: 'mock-jwt-token',
      user: { id: '123', email: 'test@example.com' }
    };
    
    // Mock the API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    const result = await client.auth.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@example.com');
  });
  
  test('should throw error with invalid credentials', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' })
    });
    
    await expect(client.auth.login({
      email: 'test@example.com',
      password: 'wrong-password'
    })).rejects.toThrow('Invalid credentials');
  });
});
```

### Integration Tests

```python
# tests/test_integration.py
import pytest
import os
from phantasy_sdk import PhantasyClient

@pytest.fixture
def client():
    return PhantasyClient(
        api_key=os.getenv('PHANTASY_TEST_API_KEY'),
        environment='testing'
    )

@pytest.fixture
def authenticated_client(client):
    # Login with test credentials
    auth = client.auth.login(
        email='test@phantasy.io',
        password='test_password'
    )
    client.set_auth_token(auth.token)
    return client

class TestGameIntegration:
    def test_create_game_session(self, authenticated_client):
        """Test creating a new game session."""
        session = authenticated_client.games.create_session(
            game_id='test-game-123',
            player_count=2
        )
        
        assert session.id is not None
        assert session.status == 'waiting'
        assert session.player_count == 2
    
    def test_join_game_session(self, authenticated_client):
        """Test joining an existing game session."""
        # First create a session
        session = authenticated_client.games.create_session(
            game_id='test-game-123',
            player_count=2
        )
        
        # Then join it
        result = authenticated_client.games.join_session(session.id)
        
        assert result.status == 'joined'
        assert result.session_id == session.id
    
    def test_submit_score(self, authenticated_client):
        """Test submitting a game score."""
        score_data = {
            'game_id': 'test-game-123',
            'score': 1500,
            'level': 5,
            'achievements': ['first_win', 'combo_master']
        }
        
        result = authenticated_client.scores.submit(score_data)
        
        assert result.success is True
        assert result.score == 1500
        assert 'leaderboard_position' in result
```

## Best Practices

### Error Handling

```typescript
// utils/api-client.ts
import { PhantasyClient, PhantasyError } from '@phantasy/sdk';

export class ApiClient {
  private client: PhantasyClient;
  
  constructor(apiKey: string) {
    this.client = new PhantasyClient({ apiKey });
  }
  
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on authentication errors
        if (error instanceof PhantasyError && error.code === 'AUTH_FAILED') {
          throw error;
        }
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, attempt - 1))
        );
      }
    }
    
    throw lastError!;
  }
  
  async getUserData(userId: string) {
    return this.withRetry(() => 
      this.client.users.get(userId)
    );
  }
}
```

## Next Steps

Now that you've seen these examples, you can:

1. **Explore the [API Reference](/docs/api-reference/overview)** for detailed endpoint documentation
2. **Check out [Best Practices](/docs/developer-guides/best-practices)** for production-ready code
3. **Visit [Deployment Guides](/docs/deployment/overview)** to learn about hosting your application
4. **Join our [Discord community](https://discord.gg/phantasy)** for support and discussions

Happy coding! 🚀