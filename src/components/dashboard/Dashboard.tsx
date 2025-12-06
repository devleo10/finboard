'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { useDashboardStore } from '@/store/useDashboardStore'
import { WidgetGrid } from './WidgetGrid'
import { AddWidgetPlaceholder } from './AddWidgetPlaceholder'
import { AddWidgetModal } from '@/components/modals/AddWidgetModal'
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper'
import { Button } from '@/components/ui/Button'

export const Dashboard: React.FC = () => {
  const {
    widgets,
    isAddingWidget,
    editingWidgetId,
    setIsAddingWidget,
    setEditingWidgetId,
  } = useDashboardStore()

  const handleAddWidget = () => {
    setIsAddingWidget(true)
  }

  const handleCloseModal = () => {
    setIsAddingWidget(false)
    setEditingWidgetId(null)
  }

  const handleEditWidget = (widgetId: string) => {
    setEditingWidgetId(widgetId)
    setIsAddingWidget(true)
  }

  const renderWidget = (widget: any) => {
    return (
      <WidgetWrapper
        widget={widget}
        onSettingsClick={() => handleEditWidget(widget.id)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark-text">
                Finance Dashboard
              </h1>
              <p className="text-sm text-dark-muted">
                {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={handleAddWidget}>
            <span className="flex items-center gap-2">
              <span>+</span>
              <span>Add Widget</span>
            </span>
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-dark-text mb-2">
              Build Your Finance Dashboard
            </h2>
            <p className="text-dark-muted max-w-md">
              Create custom widgets by connecting to any finance API. Track
              stocks, crypto, forex, or economic indicators - all in real-time.
            </p>
          </div>
          <AddWidgetPlaceholder onClick={handleAddWidget} />
        </div>
      ) : (
        <WidgetGrid widgets={widgets} renderWidget={renderWidget} />
      )}

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={isAddingWidget}
        onClose={handleCloseModal}
        editingWidgetId={editingWidgetId}
      />
    </div>
  )
}

