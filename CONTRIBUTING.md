# Contributing to Lite Paper

Thank you for your interest in contributing to Lite Paper! We welcome contributions from the community to make this documentation template even better.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (see CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide clear descriptions** including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. **Open a discussion** before creating a feature request
2. **Explain the use case** and why it would benefit others
3. **Consider implementation complexity** and maintenance burden

### Pull Requests

1. **Fork the repository** and create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**:

   ```bash
   npm run dev          # Test in development
   npm run build        # Ensure production build works
   npm run lint         # Check for linting errors
   npm run type-check   # Verify TypeScript types
   ```

4. **Commit your changes** using conventional commits:

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with..."
   git commit -m "docs: update README"
   ```

5. **Push to your fork** and create a pull request

### Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Maintenance tasks

### Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/lite-paper.git
   cd lite-paper
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Copy environment variables**:

   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Code Style

- **TypeScript**: Use proper types, avoid `any`
- **React**: Functional components with hooks
- **Styling**: Use CSS variables for theming
- **Components**: Keep them small and focused
- **Imports**: Use absolute imports from `@/` when possible

### Testing

While we don't have formal tests yet, please:

- Test your changes thoroughly in development
- Verify the production build works
- Check responsive design on different screen sizes
- Test with both light and dark themes

### Documentation

- Update README.md if you change setup instructions
- Document new features in the appropriate docs section
- Add JSDoc comments for complex functions
- Update .env.example if adding new environment variables

## Project Structure

```
lite-paper/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── providers/        # React context providers
│   └── docs/             # Documentation content
├── public/               # Static assets
├── scripts/              # Build scripts
└── types/                # TypeScript types
```

## Need Help?

- Join our [Discussions](https://github.com/lightnolimit/lite-paper/discussions)
- Check the [Documentation](https://lite-paper.pages.dev)
- Ask questions in issues (tag with "question")

## Recognition

Contributors will be recognized in:

- The README.md contributors section
- Release notes for significant contributions
- Special thanks in the documentation

Thank you for helping make Lite Paper better for everyone!
