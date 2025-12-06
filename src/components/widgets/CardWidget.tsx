'use client'

import React from 'react'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { formatValue } from '@/utils/formatters'

interface CardWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
  onRefresh?: () => void
}

export const CardWidget: React.FC<CardWidgetProps> = ({
  widget,
  onSettingsClick,
  onRefresh,
}) => {
  const mappedData = widget.data
    ? dataMapper.extractFields(widget.data, widget.selectedFields)
    : {}

  // Debug: Log if no data or if fields are missing
  if (Object.keys(mappedData).length === 0) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-dark-muted">
          <p className="mb-2">No data available</p>
          {widget.selectedFields.length > 0 && (
            <p className="text-xs text-center">
              Selected fields: {widget.selectedFields.map(f => f.path).join(', ')}
            </p>
          )}
        </div>
      </Widget>
    )
  }

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
      <div className="space-y-3">
        {Object.entries(mappedData).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 bg-dark-bg rounded border border-dark-border"
          >
            <span className="text-sm font-medium text-dark-muted capitalize">
              {key.replace(/_/g, ' ').replace(/\./g, ' ')}
            </span>
            <span className="text-base font-semibold text-dark-text">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </Widget>
  )
}


