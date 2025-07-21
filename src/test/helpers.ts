import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { vi } from 'vitest'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return React.createElement(QueryClientProvider, { client: queryClient },
    React.createElement(ThemeProvider, { defaultTheme: "light", storageKey: "test-theme" },
      children
    )
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const mockConversation = {
  id: 'test-conversation',
  title: 'Test Conversation',
  messages: [
    {
      id: 'msg-1',
      role: 'user' as const,
      content: 'Hello, world!',
      timestamp: Date.now()
    }
  ],
  createdAt: Date.now(),
  updatedAt: Date.now()
}

export const mockApiKey = 'test-api-key-12345'

// Test utilities
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const mockFetch = (response: unknown, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  })
}

// Local storage mock helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => store[key] || null)
  vi.mocked(window.localStorage.setItem).mockImplementation((key: string, value: string) => {
    store[key] = value
  })
  vi.mocked(window.localStorage.removeItem).mockImplementation((key: string) => {
    delete store[key]
  })
  vi.mocked(window.localStorage.clear).mockImplementation(() => {
    Object.keys(store).forEach(key => delete store[key])
  })
  
  return store
}