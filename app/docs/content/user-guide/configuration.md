# Configuration

Customize your project settings and behavior.

## Configuration Files

### Main Config
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "config": {
    "environment": "development",
    "debug": true,
    "features": {
      "analytics": true,
      "notifications": false
    }
  }
}
```

### Environment Variables
```bash
# .env.local
NODE_ENV=development
API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:pass@localhost:5432/db
SECRET_KEY=your-secret-key
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `debug` | boolean | `false` | Enable debug mode |
| `port` | number | `3000` | Server port |
| `timeout` | number | `5000` | Request timeout (ms) |
| `cache` | boolean | `true` | Enable caching |

## Advanced Options

### Custom Middleware
```javascript
// middleware.js
export default function customMiddleware(options) {
  return (req, res, next) => {
    // Custom logic here
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  };
}
```

### Plugin Configuration
```javascript
// plugins.config.js
export default {
  plugins: [
    'essential-plugin',
    ['advanced-plugin', { option: 'value' }],
    {
      name: 'custom-plugin',
      config: { enabled: true }
    }
  ]
};
```

---

*Having issues? See our [troubleshooting guide](./troubleshooting).* 