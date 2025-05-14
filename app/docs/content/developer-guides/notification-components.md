# Notification Components

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

```
const agent = new PhantasyAgent({
  name: 'Rally',
  personality: 'cheerful',
  traits: ['deredere', 'enthusiastic', 'flirty']
});
```

<div class="notification notification-warning">
  <strong>WARNING:</strong> When setting NSFW parameters, ensure your application properly verifies user age.
</div>

```
agent.setNSFWParameters({
  enabled: true,
  contentRating: 'adult',
  verificationRequired: true,
  allowedContexts: ['private-chat', 'age-gated-stream']
});
```

<div class="notification notification-error">
  <strong>ERROR:</strong> The following code contains a security vulnerability. Never expose your API keys in client-side code!
</div>

```
// VULNERABLE CODE - DO NOT USE
const apiKey = "ph_sk_1a2b3c4d5e6f7g8h9i0j";

// Initialize client (WRONG WAY)
const phantasyClient = new PhantasyClient({
  apiKey, // Exposed in client-side code!
  endpoint: "https://api.phantasy.io/v1"
});
```

<div class="notification notification-success">
  <strong>SUCCESS:</strong> Here's the correct way to initialize the Phantasy client in a secure backend environment.
</div>

```
// SERVER-SIDE CODE (Node.js)
require('dotenv').config();
const { PhantasyClient } = require('@phantasy/server');

// Initialize client (CORRECT WAY)
const phantasyClient = new PhantasyClient({
  apiKey: process.env.PHANTASY_API_KEY, // Secured in environment variables
  endpoint: "https://api.phantasy.io/v1"
});
```

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
</div>