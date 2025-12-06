'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Widget } from '@/store/types'
import { apiService } from '@/services/apiService'
import { useDashboardStore } from '@/store/useDashboardStore'

export const useWidgetData = (widget: Widget) => {
  const { setWidgetData, setWidgetLoading, setWidgetError } =
    useDashboardStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async (skipCache: boolean = false) => {
    setWidgetLoading(widget.id, true)
    setWidgetError(widget.id, null)

    try {
      // Clear cache if manual refresh
      if (skipCache) {
        apiService.clearCacheEntry(widget.id)
      }

      const response = await apiService.fetch({
        url: widget.apiUrl,
        useCache: !skipCache,
        cacheKey: widget.id,
      })

      if (response.success && response.data) {
        setWidgetData(widget.id, response.data)
      } else {
        setWidgetError(widget.id, response.error || 'Failed to fetch data')
      }
    } catch (error) {
      setWidgetError(
        widget.id,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    } finally {
      setWidgetLoading(widget.id, false)
    }
  }, [widget.id, widget.apiUrl, setWidgetData, setWidgetLoading, setWidgetError])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up interval for refresh
    if (widget.refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, widget.refreshInterval * 1000)
    }

    // Cleanup on unmount or when widget changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, widget.refreshInterval])

  return {
    refetch: () => fetchData(true), // Skip cache on manual refresh
  }
}

