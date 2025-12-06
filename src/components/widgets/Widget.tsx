'use client'

import React from 'react'
import { RefreshCw, Settings, Trash2 } from 'lucide-react'
import { Widget as WidgetType } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'

interface WidgetProps {
  widget: WidgetType
  children: React.ReactNode
  onSettingsClick?: () => void
  onRefresh?: () => void
}

export const Widget: React.FC<WidgetProps> = ({
  widget,
  children,
  onSettingsClick,
  onRefresh,
}) => {
  const { removeWidget } = useDashboardStore()

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${widget.name}"?`)) {
      removeWidget(widget.id)
    }
  }

  const formatLastUpdated = (date?: Date) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleTimeString()
  }

  return (
    <div className="bg-dark-surface rounded-lg border border-dark-border p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-dark-text">{widget.name}</h3>
          {widget.refreshInterval && (
            <span className="text-xs px-2 py-0.5 bg-dark-bg rounded text-dark-muted">
              {widget.refreshInterval}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            disabled={widget.isLoading}
            className="p-1.5 text-dark-muted hover:text-dark-text hover:bg-dark-bg rounded transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={cn(widget.isLoading && 'animate-spin')}
            />
          </button>
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-1.5 text-dark-muted hover:text-dark-text hover:bg-dark-bg rounded transition-colors"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 text-dark-muted hover:text-red-500 hover:bg-dark-bg rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {widget.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-surface/50 rounded z-10">
            <LoadingSpinner size="md" />
          </div>
        )}

        {widget.error ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-red-500 text-sm mb-2">{widget.error}</p>
            <button
              onClick={handleRefresh}
              className="text-xs text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {widget.lastUpdated && (
        <div className="mt-4 pt-3 border-t border-dark-border">
          <p className="text-xs text-dark-muted">
            Last updated: {formatLastUpdated(widget.lastUpdated)}
          </p>
        </div>
      )}
    </div>
  )
}


