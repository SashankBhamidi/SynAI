# Testing Guide

## Testing Philosophy

SynAI follows a comprehensive testing strategy to ensure reliability, maintainability, and user experience quality.

## Testing Stack

- **Framework**: Vitest (fast, modern alternative to Jest)
- **React Testing**: React Testing Library
- **Coverage**: V8 coverage provider
- **Mocking**: Vitest built-in mocking
- **Environment**: jsdom for browser simulation

## Test Structure

### Test Files Organization

```
src/
├── components/
│   ├── ChatInput.tsx
│   └── ChatInput.test.tsx       # Component tests
├── services/
│   ├── aiService.ts
│   └── aiService.test.ts        # Service tests  
├── utils/
│   ├── storage.ts
│   └── storage.test.ts          # Utility tests
└── test/
    ├── setup.ts                 # Test setup and globals
    └── helpers.ts               # Test utilities
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Coverage Requirements

- **Minimum Coverage**: 70% for branches, functions, lines, statements
- **Exclusions**: UI components (Shadcn), config files, type definitions
- **Reports**: HTML, LCOV, and text formats generated

## Testing Patterns

### Component Testing

```typescript
import { render, screen, fireEvent } from '@/test/helpers'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('should handle message submission', async () => {
    const onSubmit = vi.fn()
    render(<ChatInput onSubmit={onSubmit} />)
    
    const input = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('Send'))
    
    expect(onSubmit).toHaveBeenCalledWith('Hello')
  })
})
```

### Service Testing

```typescript
import { sendAiMessage } from './aiService'
import { ProviderFactory } from './providers/providerFactory'

vi.mock('./providers/providerFactory')

describe('aiService', () => {
  it('should route messages to correct provider', async () => {
    const mockProvider = { sendRequest: vi.fn().mockResolvedValue('response') }
    vi.mocked(ProviderFactory.getProvider).mockReturnValue(mockProvider)
    
    await sendAiMessage('openai', { message: 'test' })
    
    expect(ProviderFactory.getProvider).toHaveBeenCalledWith('openai')
    expect(mockProvider.sendRequest).toHaveBeenCalled()
  })
})
```

### Storage Testing

```typescript
import { mockLocalStorage } from '@/test/helpers'
import { saveConversation, loadConversations } from './conversationStorage'

describe('conversationStorage', () => {
  beforeEach(() => {
    mockLocalStorage()
  })
  
  it('should save and load conversations', () => {
    const conversation = { id: '1', title: 'Test', messages: [] }
    
    saveConversation(conversation)
    const loaded = loadConversations()
    
    expect(loaded).toContainEqual(conversation)
  })
})
```

## Test Categories

### Unit Tests
- Individual function behavior
- Component rendering logic  
- Utility function correctness
- Error handling paths

**Example Coverage:**
- ✅ All service functions
- ✅ Utility functions
- ✅ Custom hooks
- ✅ Error boundaries

### Integration Tests
- Component interaction flows
- Service integration points
- Storage layer persistence
- Provider communication

**Example Scenarios:**
- ✅ Message sending end-to-end
- ✅ File upload and processing
- ✅ API key management
- ✅ Conversation persistence

### Visual Tests
- Component rendering
- UI state changes
- Responsive behavior
- Theme switching

**Example Coverage:**
- ✅ All major components render
- ✅ Loading states display
- ✅ Error states handled
- ✅ Mobile responsiveness

## Mocking Strategies

### API Mocking

```typescript
// Mock fetch for API calls
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ response: 'mock data' })
})
```

### localStorage Mocking

```typescript
// Already set up in test/setup.ts
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
})
```

### Provider Mocking

```typescript
// Mock entire provider modules
vi.mock('./providers/openaiService', () => ({
  OpenAIService: vi.fn().mockImplementation(() => ({
    sendRequest: vi.fn().mockResolvedValue('mocked response')
  }))
}))
```

## CI/CD Integration

### GitHub Actions Testing

Tests run automatically on:
- ✅ All pull requests
- ✅ Pushes to master branch
- ✅ Manual workflow dispatch

### Quality Gates

Before deployment, all must pass:
- ✅ Unit tests (100% pass rate)
- ✅ Integration tests
- ✅ Coverage thresholds (70%)
- ✅ TypeScript compilation
- ✅ ESLint rules
- ✅ Build verification

### Test Matrix

Tests run on multiple Node.js versions:
- ✅ Node.js 18 (LTS)
- ✅ Node.js 20 (Current)

## Best Practices

### Writing Good Tests

1. **Descriptive Names**: Test names should describe behavior
2. **Single Responsibility**: One test per behavior
3. **Arrange-Act-Assert**: Clear test structure
4. **Independent**: Tests shouldn't depend on each other
5. **Fast**: Keep tests quick to run

### Component Testing

```typescript
// ✅ Good: Tests behavior, not implementation
it('should show error message when API fails', async () => {
  mockFetch(null, false)
  render(<ChatInput onSubmit={vi.fn()} />)
  
  fireEvent.click(screen.getByText('Send'))
  
  await waitFor(() => {
    expect(screen.getByText('Failed to send message')).toBeInTheDocument()
  })
})

// ❌ Bad: Tests implementation details
it('should call setState when button clicked', () => {
  // Don't test internal React state changes
})
```

### Service Testing

```typescript
// ✅ Good: Tests public interface
it('should handle provider errors gracefully', async () => {
  const mockProvider = {
    sendRequest: vi.fn().mockRejectedValue(new Error('API Error'))
  }
  
  await expect(sendAiMessage('openai', { message: 'test' }))
    .rejects.toThrow('API Error')
})

// ❌ Bad: Tests internal implementation
it('should call private method correctly', () => {
  // Don't test private methods directly
})
```

## Debugging Tests

### Common Issues

1. **Async/Await**: Use proper async handling
```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ❌ Bad - missing await
waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

2. **Cleanup**: Ensure tests don't leak state
```typescript
afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
```

3. **Mock Timing**: Reset mocks between tests
```typescript
beforeEach(() => {
  vi.resetAllMocks()
})
```

### Test Debugging Tools

- **Vitest UI**: Visual test runner with debugging
- **React Testing Library**: Debug utilities
- **Console Logs**: Strategic logging in tests
- **Coverage Reports**: Identify untested code paths

## Performance Testing

### Bundle Size Testing

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Memory Leak Testing

```typescript
// Test for memory leaks in components
it('should cleanup event listeners', () => {
  const { unmount } = render(<ComponentWithListeners />)
  
  // Verify cleanup
  unmount()
  expect(cleanupFn).toHaveBeenCalled()
})
```

## Contributing to Tests

### Adding New Tests

1. **Identify Test Type**: Unit, integration, or visual
2. **Follow Naming**: `ComponentName.test.tsx` pattern  
3. **Use Helpers**: Leverage existing test utilities
4. **Add Coverage**: Ensure new code is tested
5. **Document Complex Tests**: Add comments for complex logic

### Test Review Checklist

- [ ] Tests cover happy path and edge cases
- [ ] Error scenarios are tested
- [ ] Mocks are appropriate and realistic
- [ ] Tests are fast and reliable
- [ ] Coverage meets minimum thresholds
- [ ] No flaky or intermittent failures

This testing strategy ensures SynAI remains reliable, maintainable, and delivers a high-quality user experience.