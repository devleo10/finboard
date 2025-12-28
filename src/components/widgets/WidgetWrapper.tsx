'use client'

import React from 'react'
import { Widget as WidgetType } from '@/store/types'
import { useWidgetData } from '@/hooks/useWidgetData'
import { CardWidget } from './CardWidget'
import { TableWidget } from './TableWidget'
import { ChartWidget } from './ChartWidget'
import { CandlestickWidget } from './CandlestickWidget'

interface WidgetWrapperProps {
  widget: WidgetType
  onSettingsClick?: () => void
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widget,
  onSettingsClick,
}) => {
  const { refetch } = useWidgetData(widget)

  switch (widget.displayMode) {
    case 'table':
      return (
        <TableWidget
          widget={widget}
          onSettingsClick={onSettingsClick}
          onRefresh={refetch}
        />
      )
    case 'chart':
      return (
        <ChartWidget
          widget={widget}
          onSettingsClick={onSettingsClick}
          onRefresh={refetch}
        />
      )
    case 'candlestick':
      return (
        <CandlestickWidget
          widget={widget}
          onSettingsClick={onSettingsClick}
          onRefresh={refetch}
        />
      )
    case 'card':
    default:
      return (
        <CardWidget
          widget={widget}
          onSettingsClick={onSettingsClick}
          onRefresh={refetch}
        />
      )
  }
}
