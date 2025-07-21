import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendAiMessage, validateApiKey } from './aiService'
import { ProviderFactory } from './providers/providerFactory'

// Mock the provider factory
vi.mock('./providers/providerFactory', () => ({
  ProviderFactory: {
    getProvider: vi.fn()
  }
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendAiMessage', () => {
    it('should send message to correct provider', async () => {
      const mockProvider = {
        sendRequest: vi.fn().mockResolvedValue('Test response')
      }
      
      vi.mocked(ProviderFactory.getProvider).mockReturnValue(mockProvider)

      const options = {
        message: 'Hello',
        model: 'test-model',
        temperature: 0.7
      }

      const result = await sendAiMessage('openai', options)

      expect(ProviderFactory.getProvider).toHaveBeenCalledWith('openai')
      expect(mockProvider.sendRequest).toHaveBeenCalledWith(options)
      expect(result).toBe('Test response')
    })

    it('should throw error for unsupported provider', async () => {
      await expect(sendAiMessage('unsupported', { message: 'test' }))
        .rejects.toThrow('Unsupported AI provider: unsupported')
    })

    it('should handle provider errors gracefully', async () => {
      const mockProvider = {
        sendRequest: vi.fn().mockRejectedValue(new Error('Provider error'))
      }
      
      vi.mocked(ProviderFactory.getProvider).mockReturnValue(mockProvider)

      await expect(sendAiMessage('openai', { message: 'test' }))
        .rejects.toThrow('Provider error')
    })
  })

  describe('validateApiKey', () => {
    it('should return true for valid OpenAI key format', async () => {
      const result = await validateApiKey('openai', 'sk-1234567890abcdefghijklmnop')
      expect(result).toBe(true)
    })

    it('should return true for valid Anthropic key format', async () => {
      const result = await validateApiKey('anthropic', 'sk-ant-1234567890abcdefghijklmnop')
      expect(result).toBe(true)
    })

    it('should return true for valid Perplexity key format', async () => {
      const result = await validateApiKey('perplexity', 'pplx-1234567890abcdefghijklmnop')
      expect(result).toBe(true)
    })

    it('should return false for unsupported provider', async () => {
      const result = await validateApiKey('unsupported', 'any-key')
      expect(result).toBe(false)
    })

    it('should handle validation errors gracefully', async () => {
      const result = await validateApiKey('openai', '')
      expect(result).toBe(true) // Still allows saving
    })
  })
})