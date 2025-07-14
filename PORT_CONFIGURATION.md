# Port Configuration

## Development Server Port

This project is configured to run on port **3333** during development to avoid conflicts with other projects that commonly use port 3000.

## Configuration

### Package.json Scripts

The development server is configured in `package.json`:

```json
{
  "scripts": {
    "dev": "npm run generate:docs && next dev -p 3333"
  }
}
```

### Usage

Start the development server:

```bash
npm run dev
```

The server will be available at:

- **Local**: http://localhost:3333
- **Network**: http://[your-ip]:3333

## Port Selection Rationale

Port 3333 was chosen because:

1. **Avoids conflicts**: Port 3000 is commonly used by many React/Next.js projects
2. **Not reserved**: Port 3333 is not commonly used by system services
3. **Easy to remember**: Simple repeating pattern
4. **Development only**: Production deployments use standard ports (80/443)

## Alternative Ports

If port 3333 is already in use, you can temporarily use a different port:

```bash
# Use a different port temporarily
npm run generate:docs && next dev -p 3334

# Or set the PORT environment variable
PORT=3334 npm run dev
```

## Common Port Conflicts

These ports are commonly used and should be avoided:

- **3000**: Default Next.js/React development server
- **3001**: Common alternative for React apps
- **8000**: Python/Django development server
- **8080**: Common HTTP alternative port
- **5000**: Flask development server
- **4000**: Jekyll development server

## Checking Port Availability

To check if port 3333 is available:

**macOS/Linux:**

```bash
lsof -i :3333
```

**Windows:**

```bash
netstat -ano | findstr :3333
```

## Documentation References

All documentation has been updated to reflect the new port:

- `DOCUMENTATION_API.md` - Updated test URLs
- `README.md` - Updated getting started instructions
- Any example URLs in markdown files

## Network Access

The development server is accessible on the local network:

1. Find your local IP address:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig | find "IPv4"
   ```

2. Access from other devices on the same network:
   ```
   http://[your-ip]:3333
   ```

## Production Considerations

This port configuration only affects development. Production deployments:

- Use standard HTTP (80) and HTTPS (443) ports
- Are handled by the hosting platform (Cloudflare Pages, Vercel, etc.)
- Don't require port specifications in URLs
