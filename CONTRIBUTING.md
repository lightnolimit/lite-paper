# Contributing to Lite Paper Documentation Template

Thank you for your interest in contributing to the Lite Paper Documentation Template! We love your input and appreciate your efforts to make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [How to Contribute](#how-to-contribute)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lite-paper.git
   cd lite-paper
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your changes.

2. **Before committing**, ensure your code passes all checks:

   ```bash
   npm run lint        # Check for linting errors
   npm run format      # Format your code
   npm run type-check  # Check TypeScript types
   ```

3. **Test your changes** thoroughly across different browsers and screen sizes.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Why this enhancement would be useful
- Examples of how it would work

### Code Contributions

1. **Small fixes** (typos, small bugs): Open a PR directly
2. **Large changes**: Open an issue first to discuss the change
3. **New features**: Discuss in an issue before implementation

## Style Guidelines

Please refer to our [Style Guide](STYLE_GUIDE.md) for detailed coding standards. Key points:

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint and Prettier)
- Write meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep components small and focused

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
feat(navigation): add mobile menu toggle
fix(theme): correct dark mode colors in navigation
docs: update installation instructions
style: format code with prettier
```

## Pull Request Process

1. **Update documentation** if you've changed APIs or added features
2. **Ensure all tests pass** and no linting errors exist
3. **Update the README.md** if needed
4. **Fill out the PR template** completely
5. **Request review** from maintainers
6. **Address feedback** promptly and professionally

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Commit messages follow conventions

## Development Tips

### Working with Three.js Backgrounds

When modifying background effects:

- Test performance on lower-end devices
- Ensure reduced motion preferences are respected
- Keep animations smooth (60 FPS target)

### Adding New Documentation

1. Add your markdown files to `app/docs/content/`
2. Update `app/data/documentation.ts` with the new structure
3. Test navigation and search functionality

### Performance Considerations

- Lazy load heavy components
- Optimize images before adding them
- Use dynamic imports for code splitting
- Test with Lighthouse for performance metrics

## Questions?

Feel free to:

- Open an issue for questions
- Join our discussions on GitHub
- Contact the maintainers

Thank you for contributing to make this project better for everyone! 🎉
