# API Integration Guide

## Overview

SynAI supports multiple AI providers through a unified interface. Each provider is implemented as a service that extends the base provider interface.

## Adding a New Provider

### 1. Create Provider Service

Create a new file in `src/services/providers/`:

```typescript
// src/services/providers/newProviderService.ts
import { BaseProviderService, ApiMessage, StreamOptions } from './baseProviderService';

export class NewProviderService extends BaseProviderService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async sendMessage(options: StreamOptions): Promise<string> {
    // Implement API call logic
    // Return the response text
  }

  async streamMessage(options: StreamOptions): Promise<AsyncIterable<string>> {
    // Implement streaming logic (optional)
    // Yield response chunks
  }
}
```

### 2. Update Provider Factory

Add your provider to `src/services/providers/providerFactory.ts`:

```typescript
import { NewProviderService } from './newProviderService';

export const createProviderService = (provider: string, apiKey: string) => {
  switch (provider.toLowerCase()) {
    case 'newprovider':
      return new NewProviderService(apiKey);
    // ... existing cases
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
```

### 3. Add Model Definitions

Update `src/data/models.ts`:

```typescript
export const newProviderModels: AIModel[] = [
  {
    id: 'new-model-1',
    name: 'New Model 1',
    provider: 'newprovider',
    contextLength: 8192,
    supportsImages: false,
    description: 'Description of the model'
  }
];

// Add to availableModels array
export const availableModels: AIModel[] = [
  ...newProviderModels,
  // ... existing models
];
```

### 4. Update API Key Storage

Add the provider to `src/utils/apiKeyStorage.ts`:

```typescript
export type ProviderType = 'openai' | 'anthropic' | 'perplexity' | 'newprovider';
```

## Provider Interface

### BaseProviderService

All providers must implement:

```typescript
interface BaseProviderService {
  sendMessage(options: StreamOptions): Promise<string>;
  streamMessage?(options: StreamOptions): Promise<AsyncIterable<string>>;
}

interface StreamOptions {
  message: string;
  model: string;
  temperature: number;
  stream: boolean;
  messages: ApiMessage[];
  attachments?: FileAttachment[];
  simulateResponse?: boolean;
}
```

### Message Format

```typescript
interface ApiMessage {
  role: 'user' | 'assistant';
  content: string | MultimodalContent[];
  attachments?: FileAttachment[];
}

interface MultimodalContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}
```

## File Attachment Support

### Handling File Attachments

```typescript
// In your provider service
async sendMessage(options: StreamOptions): Promise<string> {
  const { attachments } = options;
  
  if (attachments?.length) {
    // Process image attachments for vision models
    const images = attachments.filter(att => att.type.startsWith('image/'));
    
    // Process text attachments
    const textFiles = attachments.filter(att => !att.type.startsWith('image/'));
    
    // Include in your API request as needed
  }
}
```

### File Types

Supported attachment types:
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Documents: `application/pdf`, `text/plain`, `text/markdown`
- Code: `text/javascript`, `text/python`, etc.

## Error Handling

### Standard Error Response

```typescript
export class ProviderError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public provider?: string
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}
```

### Error Types

- **Authentication**: Invalid API key
- **Rate Limit**: API quota exceeded
- **Model**: Unsupported model or parameters
- **Network**: Connection issues
- **Content**: Content policy violations

## Testing Your Provider

### Manual Testing

1. Add API key in Settings
2. Select your provider and model
3. Send test messages
4. Test file uploads (if supported)
5. Test error scenarios

### Provider Checklist

- [ ] Basic text messages work
- [ ] Streaming responses work (if implemented)
- [ ] File attachments handled correctly
- [ ] Error messages are user-friendly
- [ ] Rate limiting handled gracefully
- [ ] Model parameters respected

## Examples

### Simple Text Provider

```typescript
export class SimpleProviderService extends BaseProviderService {
  constructor(private apiKey: string) {
    super();
  }

  async sendMessage(options: StreamOptions): Promise<string> {
    const response = await fetch('https://api.example.com/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: options.messages,
        model: options.model,
        temperature: options.temperature
      })
    });

    if (!response.ok) {
      throw new ProviderError(
        `API request failed: ${response.statusText}`,
        response.status,
        'simple'
      );
    }

    const data = await response.json();
    return data.response;
  }
}
```

### Streaming Provider

```typescript
async *streamMessage(options: StreamOptions): Promise<AsyncIterable<string>> {
  const response = await fetch('https://api.example.com/stream', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: options.messages,
      model: options.model,
      stream: true
    })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        yield data.content;
      }
    }
  }
}
```