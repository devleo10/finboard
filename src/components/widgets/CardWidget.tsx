'use client'

import React from 'react'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { formatValue } from '@/utils/formatters'

interface CardWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
}

export const CardWidget: React.FC<CardWidgetProps> = ({
  widget,
  onSettingsClick,
}) => {
  const mappedData = widget.data
    ? dataMapper.extractFields(widget.data, widget.selectedFields)
    : {}

  if (Object.keys(mappedData).length === 0) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick}>
        <div className="flex items-center justify-center h-full p-8 text-dark-muted">
          <p>No data available</p>
        </div>
      </Widget>
    )
  }

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick}>
      <div className="space-y-3">
        {Object.entries(mappedData).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 bg-dark-bg rounded border border-dark-border"
          >
            <span className="text-sm font-medium text-dark-muted capitalize">
              {key.replace(/_/g, ' ')}
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


