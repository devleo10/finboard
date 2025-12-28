import axios, { AxiosError } from 'axios'
import { APIResponse } from '@/store/types'
import { injectApiKeys } from '@/utils/apiKeyInjector'

// Cache for API responses to reduce redundant calls
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

export interface FetchOptions {
  url: string
  useCache?: boolean
  cacheKey?: string
}

export const apiService = {
  fetch: async (options: FetchOptions): Promise<APIResponse> => {
    const { url, useCache = true, cacheKey } = options

    // Check cache first
    if (useCache && cacheKey) {
      const cached = cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return {
          data: cached.data,
          fields: [],
          success: true,
        }
      }
    }

    try {
      // Inject API keys from environment variables
      const urlWithApiKey = injectApiKeys(url)
      
      // Use a CORS proxy if needed (for development)
      // In production, you might want to use a backend proxy
      const proxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY
      const targetUrl = proxyUrl ? `${proxyUrl}${urlWithApiKey}` : urlWithApiKey

      const response = await axios.get(targetUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        },
      })

      const data = response.data

      // Cache the response
      if (useCache && cacheKey) {
        cache.set(cacheKey, { data, timestamp: Date.now() })
      }

      return {
        data,
        fields: [],
        success: true,
      }
    } catch (error) {
      const axiosError = error as AxiosError

      // Handle different error types
      if (axiosError.response) {
        const status = axiosError.response.status

        if (status === 429) {
          return {
            data: null,
            fields: [],
            success: false,
            error: 'API rate limit exceeded. Please try again later.',
          }
        }

        if (status === 401 || status === 403) {
          return {
            data: null,
            fields: [],
            success: false,
            error: 'Invalid API key or unauthorized access.',
          }
        }

        return {
          data: null,
          fields: [],
          success: false,
          error: `API error: ${axiosError.response.statusText} (${status})`,
        }
      }

      if (axiosError.request) {
        return {
          data: null,
          fields: [],
          success: false,
          error: 'Network error. Please check your connection.',
        }
      }

      return {
        data: null,
        fields: [],
        success: false,
        error: axiosError.message || 'An unexpected error occurred.',
      }
    }
  },

  clearCache: (): void => {
    cache.clear()
  },

  clearCacheEntry: (key: string): void => {
    cache.delete(key)
  },
}


