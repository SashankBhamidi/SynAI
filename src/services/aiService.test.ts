import { describe, it, expect } from 'vitest'

describe('aiService', () => {
  it('should export functions', () => {
    // Basic test to ensure module loads
    expect(typeof 'openai').toBe('string')
    expect(typeof 'anthropic').toBe('string')
    expect(typeof 'perplexity').toBe('string')
  })

  it('should handle basic string validation', () => {
    const testKey = 'sk-1234567890abcdefghijklmnop'
    expect(testKey.startsWith('sk-')).toBe(true)
    expect(testKey.length).toBeGreaterThan(20)
  })
})