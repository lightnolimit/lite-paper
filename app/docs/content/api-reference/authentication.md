# Authentication

Learn how to authenticate API requests to access protected resources.

## Overview

The API uses token-based authentication to secure endpoints and protect user data. All authenticated requests must include a valid API token in the request headers.

## Getting Started

### 1. Obtain an API Token

To get started with API authentication:

1. Create an account or log in to your existing account
2. Navigate to the API settings in your dashboard
3. Generate a new API token
4. Store the token securely - you won't be able to see it again

### 2. Include Token in Requests

Include your API token in the `Authorization` header of all API requests:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.example.com/v1/resource
```

## Authentication Methods

### Bearer Token

The recommended authentication method using the Authorization header:

```javascript
const response = await fetch('https://api.example.com/v1/resource', {
  headers: {
    Authorization: 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json',
  },
});
```

### API Key Parameter

For certain endpoints, you can also pass the API key as a query parameter:

```
GET https://api.example.com/v1/resource?api_key=YOUR_API_TOKEN
```

� **Note**: This method is less secure and should only be used when header-based authentication is not possible.

## Token Management

### Token Expiration

- API tokens are valid for 90 days by default
- You can configure custom expiration periods in your account settings
- Expired tokens will return a `401 Unauthorized` error

### Regenerating Tokens

To regenerate a token:

1. Go to your API settings
2. Find the token you want to regenerate
3. Click "Regenerate"
4. Update your applications with the new token

### Revoking Tokens

You can revoke a token at any time:

1. Navigate to API settings
2. Find the token to revoke
3. Click "Revoke"
4. The token will immediately become invalid

## Security Best Practices

### Token Storage

- **Never** commit tokens to version control
- Store tokens in environment variables
- Use secret management services in production
- Rotate tokens regularly

### HTTPS Only

All API requests must be made over HTTPS. Requests over HTTP will be rejected.

### Rate Limiting

Authenticated requests have higher rate limits than unauthenticated requests:

- **Authenticated**: 1000 requests per hour
- **Unauthenticated**: 60 requests per hour

## Error Handling

### Common Authentication Errors

| Status Code | Error             | Description                      |
| ----------- | ----------------- | -------------------------------- |
| 401         | Unauthorized      | Invalid or missing token         |
| 403         | Forbidden         | Token lacks required permissions |
| 429         | Too Many Requests | Rate limit exceeded              |

### Error Response Format

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token",
    "details": "The provided token has expired or is invalid"
  }
}
```

## OAuth 2.0 (Coming Soon)

We're working on OAuth 2.0 support for third-party integrations. This will enable:

- User authorization flows
- Scoped permissions
- Refresh tokens
- Third-party app integration

## Need Help?

If you're experiencing authentication issues:

1. Verify your token is correct and hasn't expired
2. Check you're using HTTPS
3. Ensure you're not exceeding rate limits
4. Contact support if issues persist
