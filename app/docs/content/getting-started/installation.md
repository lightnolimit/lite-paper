# Installation

Detailed installation instructions for different environments.

## System Requirements

- **Node.js**: Version 18.0 or later
- **Memory**: 2GB RAM minimum
- **Storage**: 500MB free space
- **OS**: Windows, macOS, or Linux

## Package Managers

We support multiple package managers:

### npm (Recommended)
```bash
npm install your-project-name
npm run setup
```

### Yarn
```bash
yarn add your-project-name
yarn setup
```

### pnpm
```bash
pnpm add your-project-name
pnpm setup
```

## Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure variables**
   ```bash
   # .env.local
   DATABASE_URL=your_database_url
   API_KEY=your_api_key
   ```

3. **Initialize database**
   ```bash
   npm run db:migrate
   ```

## Verification

Verify your installation:

```bash
npm run test
npm run build
```

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in config |
| Permission errors | Run with sudo (Linux/Mac) |
| Module not found | Clear cache and reinstall |

---

*Next: [Quick Start Guide](./quick-start)* 