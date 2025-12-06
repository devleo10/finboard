import { Widget, StorageData } from '@/store/types'

const STORAGE_KEY = 'finboard-dashboard'
const STORAGE_VERSION = '1.0.0'

export const storageService = {
  saveWidgets: (widgets: Widget[]): void => {
    try {
      const data: StorageData = {
        widgets,
        version: STORAGE_VERSION,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save widgets to localStorage:', error)
    }
  },

  loadWidgets: (): Widget[] | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const data: StorageData = JSON.parse(stored)
      
      // Validate version compatibility
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, clearing old data')
        localStorage.removeItem(STORAGE_KEY)
        return null
      }

      // Convert lastUpdated strings back to Date objects
      const widgets = data.widgets.map((widget) => ({
        ...widget,
        lastUpdated: widget.lastUpdated
          ? new Date(widget.lastUpdated)
          : undefined,
      }))

      return widgets
    } catch (error) {
      console.error('Failed to load widgets from localStorage:', error)
      return null
    }
  },

  clearWidgets: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear widgets from localStorage:', error)
    }
  },

  exportConfig: (): string | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored
    } catch (error) {
      console.error('Failed to export config:', error)
      return null
    }
  },

  importConfig: (config: string): boolean => {
    try {
      const data: StorageData = JSON.parse(config)
      if (data.widgets && Array.isArray(data.widgets)) {
        localStorage.setItem(STORAGE_KEY, config)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import config:', error)
      return false
    }
  },
}


