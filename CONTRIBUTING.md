# Contributing to SynAI

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/your-username/SynAI.git
   cd SynAI
   npm install
   ```

2. **Start development**
   ```bash
   npm run dev
   ```

3. **Run tests**
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

## Code Standards

### TypeScript
- Strict mode enabled - no `any` types
- Proper interfaces for all props and data structures
- JSDoc comments for exported functions

### React
- Functional components with hooks
- Custom hooks for reusable logic
- Proper dependency arrays in `useEffect`

### Testing
- Write tests for new features
- Test edge cases and error scenarios
- Maintain good test coverage

### Code Style
- ESLint configuration enforced
- No `console.log` statements (use `logger` utility)
- Meaningful variable and function names

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run build
   ```

4. **Submit PR**
   - Use the PR template
   - Link any related issues
   - Request review

## Project Structure

```
SynAI/
├── src/
│   ├── components/          # UI components
│   ├── services/           # API services
│   ├── utils/              # Utilities
│   ├── types/              # Type definitions
│   └── test/               # Test setup
├── docs/                   # Documentation
└── .github/                # GitHub workflows
```

## Adding Features

### New AI Provider
1. Create service in `src/services/providers/`
2. Update provider factory
3. Add model definitions
4. Update API key storage
5. Add tests

### New Component
1. Create component file
2. Add proper TypeScript interfaces
3. Include JSDoc comments
4. Add tests
5. Export from appropriate index

## Reporting Issues

Use GitHub Issues with:
- Clear bug description
- Steps to reproduce
- Environment details
- Console errors (if any)

## Questions?

- Check existing issues and discussions
- Review documentation in `docs/`
- Ask in pull request comments

## Recognition

Contributors are acknowledged in releases and README.