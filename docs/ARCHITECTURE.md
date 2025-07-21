# SynAI Architecture

## Overview

SynAI is a client-side React application that provides a unified interface for multiple AI providers. The architecture emphasizes privacy, extensibility, and maintainability.

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │────│  Service Layer   │────│  AI Providers   │
│                 │    │                  │    │                 │
│ • Components    │    │ • AI Service     │    │ • OpenAI        │
│ • Hooks         │    │ • Storage Utils  │    │ • Anthropic     │
│ • Contexts      │    │ • Provider Mgmt  │    │ • Perplexity    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Local Storage   │    │   File System    │    │   External APIs │
│                 │    │                  │    │                 │
│ • Conversations │    │ • PDF Reader     │    │ • Provider APIs │
│ • API Keys      │    │ • Image Handler  │    │ • Usage Analytics│
│ • Settings      │    │ • Attachments    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Core Principles

### 1. Privacy First
- All data stored locally in browser
- API keys never leave the client
- No server-side data collection
- Direct communication with AI providers

### 2. Provider Abstraction
- Unified interface for all AI providers
- Easy to add new providers
- Consistent error handling
- Standardized message format

### 3. Component-Based Design
- Modular React components
- Reusable UI elements with Shadcn/UI
- Clean separation of concerns
- TypeScript for type safety

## Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (Shadcn)
│   └── [feature]/      # Feature-specific components
├── services/           # Business logic layer
│   └── providers/      # AI provider implementations
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── pages/              # Page components
└── test/               # Test utilities and setup
```

## Key Components

### Service Layer (`src/services/`)

**AI Service (`aiService.ts`)**
- Main interface for AI interactions
- Provider selection and routing
- API key validation
- Error handling and fallbacks

**Provider Services (`providers/`)**
- Individual provider implementations
- Standardized interface via `BaseProviderService`
- Request/response transformation
- Provider-specific error handling

**Storage Utils (`utils/`)**
- Local storage management
- Conversation persistence
- Settings management
- File attachment handling

### Component Layer (`src/components/`)

**Chat Interface**
- Main chat UI (`ChatInterface.tsx`)
- Message rendering (`MessageItem.tsx`)
- Input handling (`ChatInput.tsx`)
- Sidebar navigation (`ChatSidebar.tsx`)

**Provider Management**
- Model selection (`ModelSelector.tsx`)
- API key configuration (`ApiKeysDialog.tsx`)
- Provider switching (`ProviderSelector.tsx`)

**File Handling**
- Attachment display (`AttachmentDisplay.tsx`)
- File upload (`AttachmentButton.tsx`)
- PDF processing (`FileAttachment.tsx`)

## Data Flow

### Message Sending Flow

```
1. User types message in ChatInput
2. ChatInput validates input and attachments  
3. Message sent to aiService.sendAiMessage()
4. aiService routes to appropriate provider
5. Provider formats request for external API
6. Response received and formatted
7. Message stored in local conversation
8. UI updated with new message
```

### Provider Registration

```
1. Implement BaseProviderService abstract class
2. Add provider to ProviderFactory
3. Update model definitions in data/models.ts
4. Add API key handling in utils/apiKeyStorage.ts
5. Provider available in UI automatically
```

## Security Model

### API Key Management
- Keys stored in browser localStorage only
- Never transmitted except to intended provider
- Basic format validation without API calls
- User controls all key lifecycle

### File Processing
- All file processing happens client-side
- PDF text extraction via pdf.js
- Image processing for AI vision models
- No files uploaded to intermediate servers

### Network Security
- Direct HTTPS connections to AI providers
- No proxy servers or intermediaries
- CORS handled by browser security model
- No authentication tokens stored

## Performance Considerations

### Bundle Size
- Tree shaking for unused code
- Dynamic imports for large dependencies
- Minimal external dependencies
- Efficient component rendering

### Memory Management
- Conversation pagination
- Image compression for attachments
- Cleanup of event listeners
- Efficient re-renders with React.memo

### Network Optimization
- Request deduplication
- Streaming responses where supported
- Retry logic with backoff
- Connection pooling via fetch

## Testing Strategy

### Unit Tests
- Service layer business logic
- Utility function behavior
- Component rendering logic
- Error handling paths

### Integration Tests  
- Provider service interactions
- Storage layer persistence
- File upload and processing
- End-to-end user flows

### Quality Gates
- 70% code coverage minimum
- TypeScript strict mode
- ESLint rule compliance
- Security scanning with CodeQL

## Deployment Architecture

### Build Process
- Vite for fast builds
- TypeScript compilation
- Asset optimization
- Static file generation

### Hosting
- Vercel for static hosting
- CDN for global distribution
- Automatic deployments from GitHub
- Preview deployments for PRs

### Monitoring
- Error boundaries for React errors
- Console logging in development
- Performance metrics via browser APIs
- User analytics opt-in only

## Extension Points

### Adding New Providers
1. Extend `BaseProviderService`
2. Implement required methods
3. Register in `ProviderFactory`
4. Add model definitions
5. Update documentation

### Custom Components
1. Follow existing component patterns
2. Use TypeScript interfaces
3. Implement proper error boundaries
4. Add comprehensive tests
5. Document props and usage

### New File Types
1. Add type definitions
2. Implement processing logic
3. Update attachment handlers
4. Add UI components
5. Test with various files

This architecture enables SynAI to be both powerful and maintainable while respecting user privacy and providing a seamless experience across multiple AI providers.