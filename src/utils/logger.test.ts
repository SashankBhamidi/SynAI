import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from './logger'

// Mock console methods
const consoleSpy = {
  debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
  info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
}

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should log debug messages in development', () => {
    logger.debug('Test debug message', { data: 'test' })
    
    expect(consoleSpy.debug).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[DEBUG\]/),
      'Test debug message',
      { data: 'test' }
    )
  })

  it('should log info messages', () => {
    logger.info('Test info message')
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[INFO\]/),
      'Test info message'
    )
  })

  it('should log warning messages', () => {
    logger.warn('Test warning message')
    
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[WARN\]/),
      'Test warning message'
    )
  })

  it('should log error messages', () => {
    logger.error('Test error message')
    
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[ERROR\]/),
      'Test error message'
    )
  })

  it('should include timestamp in log messages', () => {
    logger.info('Test message')
    
    const logCall = consoleSpy.info.mock.calls[0]
    const timestamp = logCall[0]
    
    expect(timestamp).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
  })
})