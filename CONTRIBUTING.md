# Contributing to SynAI

First off, thank you for considering contributing to SynAI! It's people like you that make SynAI such a great tool for the AI community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Labels](#issue-labels)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [SynAI Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License Agreement

SynAI is licensed under the **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International) license. By contributing to this project, you agree that your contributions will be licensed under the same terms. This means:

- ✅ **Personal and educational use** is encouraged
- ❌ **Commercial use** is restricted (except official hosting at synai.site)
- 🔄 **Derivative works** must use the same license
- 📝 **Attribution** is required

Please ensure your contributions align with these license terms.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SynAI.git
   cd SynAI
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SashankBhamidi/SynAI.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Run tests**
   ```bash
   npm test
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please use the bug report template and include as many details as possible.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Use the feature request template and provide:

- **Clear title and description**
- **Explain why this enhancement would be useful**
- **Provide examples or mockups if applicable**

### Contributing Code

1. **Find an issue to work on**
   - Look for issues labeled `good first issue` for beginners
   - Check issues labeled `help wanted` for contributions needed
   - Comment on the issue to let others know you're working on it

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

3. **Make your changes**
   - Follow the style guidelines
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run typecheck
   npm run lint:check
   npm test
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use the PR template
   - Link to related issues
   - Add screenshots for UI changes

## Pull Request Process

1. **Ensure your PR passes all checks**
   - All tests pass
   - Linting passes
   - TypeScript compilation succeeds
   - Build completes successfully

2. **Update documentation**
   - Update README if needed
   - Add/update JSDoc comments
   - Update relevant documentation

3. **Follow the PR template**
   - Fill out all relevant sections
   - Link to related issues
   - Describe changes made

4. **Be responsive to feedback**
   - Address review comments promptly
   - Push additional commits as needed
   - Keep the conversation professional

## Style Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive names for variables, functions, and components

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract custom hooks for reusable logic
- Use proper TypeScript types

### File Organization

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── ...
```

## Testing Guidelines

### Test Requirements

- Write tests for all new features
- Maintain or improve test coverage
- Test both happy path and error cases
- Include integration tests for complex features

### Test Types

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should handle expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
  
  it('should handle edge cases', () => {
    // Test edge cases and error scenarios
  });
});
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(chat): add message templates functionality
fix(ui): resolve button alignment issue on mobile
docs: update API integration guide
test(utils): add tests for conversation storage
```

## Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: medium`: Medium priority issue
- `priority: low`: Low priority issue

## AI Provider Integration

When adding new AI provider integrations:

1. **Follow the existing pattern**
   - Extend `BaseProviderService`
   - Implement required methods
   - Add proper error handling

2. **Add configuration**
   - Update `src/data/models.ts`
   - Add provider-specific settings
   - Include proper TypeScript types

3. **Testing**
   - Add unit tests for the service
   - Test error scenarios
   - Add integration tests if possible

## Community

### Getting Help

- **Documentation**: Check the [docs](docs/) folder
- **Discussions**: Use [GitHub Discussions](https://github.com/SashankBhamidi/SynAI/discussions)
- **Issues**: Search existing issues before creating new ones

### Communication

- Be respectful and constructive
- Provide context and examples
- Help others when possible
- Follow the Code of Conduct

## Recognition

Contributors will be recognized in:

- The project README
- Release notes for significant contributions
- Special thanks in documentation

## Development Tips

### Debugging

- Use browser DevTools for frontend debugging
- Check console for errors and warnings
- Use React DevTools for component debugging

### Performance

- Monitor bundle size impacts
- Test on different devices and browsers
- Use React DevTools Profiler for performance analysis

### Security

- Never commit API keys or sensitive data
- Follow security best practices
- Report security issues privately

## Questions?

Don't hesitate to ask questions! You can:

- Open a [Discussion](https://github.com/SashankBhamidi/SynAI/discussions)
- Comment on an existing issue
- Reach out to maintainers

Thank you for contributing to SynAI! 🚀