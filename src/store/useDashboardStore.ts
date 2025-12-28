import { create } from 'zustand'
import { Widget, DashboardState } from './types'
import { storageService } from '@/services/storageService'

interface DashboardStore extends DashboardState {
  addWidget: (widget: Omit<Widget, 'id' | 'data' | 'lastUpdated' | 'isLoading' | 'error'>) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  removeWidget: (id: string) => void
  reorderWidgets: (startIndex: number, endIndex: number) => void
  setWidgetData: (id: string, data: any) => void
  setWidgetLoading: (id: string, isLoading: boolean) => void
  setWidgetError: (id: string, error: string | null) => void
  setIsAddingWidget: (isAdding: boolean) => void
  setEditingWidgetId: (id: string | null) => void
  hydrate: () => void
  clearWidgets: () => void
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  widgets: [],
  isAddingWidget: false,
  editingWidgetId: null,

  addWidget: (widgetConfig) => {
    const newWidget: Widget = {
      ...widgetConfig,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isLoading: false,
      error: null,
    }
    set((state) => {
      const newWidgets = [...state.widgets, newWidget]
      storageService.saveWidgets(newWidgets)
      return { widgets: newWidgets }
    })
  },

  updateWidget: (id, updates) => {
    set((state) => {
      const newWidgets = state.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...updates } : widget
      )
      storageService.saveWidgets(newWidgets)
      return { widgets: newWidgets }
    })
  },

  removeWidget: (id) => {
    set((state) => {
      const newWidgets = state.widgets.filter((widget) => widget.id !== id)
      storageService.saveWidgets(newWidgets)
      return { widgets: newWidgets }
    })
  },

  reorderWidgets: (startIndex, endIndex) => {
    set((state) => {
      const newWidgets = [...state.widgets]
      const [removed] = newWidgets.splice(startIndex, 1)
      newWidgets.splice(endIndex, 0, removed)
      storageService.saveWidgets(newWidgets)
      return { widgets: newWidgets }
    })
  },

  setWidgetData: (id, data) => {
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id
          ? { ...widget, data, lastUpdated: new Date(), error: null }
          : widget
      ),
    }))
  },

  setWidgetLoading: (id, isLoading) => {
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, isLoading } : widget
      ),
    }))
  },

  setWidgetError: (id, error) => {
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, error, isLoading: false } : widget
      ),
    }))
  },

  setIsAddingWidget: (isAdding) => {
    set({ isAddingWidget: isAdding })
  },

  setEditingWidgetId: (id) => {
    set({ editingWidgetId: id })
  },

  hydrate: () => {
    const savedWidgets = storageService.loadWidgets()
    if (savedWidgets && savedWidgets.length > 0) {
      set({ widgets: savedWidgets })
    }
  },
  clearWidgets: () => {
    set(() => {
      storageService.clearWidgets()
      return { widgets: [] }
    })
  },
}))


