'use client'

import React from 'react'
import { RefreshCw, Settings, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Widget as WidgetType } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import { formatStockTitle } from '@/utils/stockUtils'

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
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-surface rounded-xl border border-border p-4 flex flex-col h-full min-h-[400px] shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {formatStockTitle(widget.name)}
          </h3>
          {widget.refreshInterval && (
            <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-background rounded-full text-muted font-mono">
              {widget.refreshInterval}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            disabled={widget.isLoading}
            className="p-1.5 text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-50"
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
              className="p-1.5 text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 text-muted hover:text-red-500 hover:bg-background rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative min-h-0">
        {widget.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-lg z-10">
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
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              Last updated: {formatLastUpdated(widget.lastUpdated)}
            </p>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Live" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
