'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { formatValue, formatCurrency } from '@/utils/formatters'
import { getFieldLabel } from '@/utils/stockUtils'

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

  if (Object.keys(mappedData).length === 0) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-muted">
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

  // Check if this is a stock quote widget (has c, o, h, l fields)
  const isStockQuote = 'c' in mappedData && 'o' in mappedData && 'h' in mappedData && 'l' in mappedData
  const currentPrice = mappedData.c || mappedData.price
  const change = mappedData.d
  const changePercent = mappedData.dp

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {isStockQuote && currentPrice ? (
          <>
            {/* Current Price - Large Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="text-3xl font-bold text-foreground mb-1">
                {formatCurrency(Number(currentPrice), 'USD', 2)}
              </div>
              {change !== undefined && changePercent !== undefined && (
                <div className={`text-sm font-semibold flex items-center justify-center gap-1 ${
                  Number(change) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  <span>{Number(change) >= 0 ? '↑' : '↓'}</span>
                  <span>{formatCurrency(Math.abs(Number(change)), 'USD', 2)}</span>
                  <span>({Number(changePercent).toFixed(2)}%)</span>
                </div>
              )}
            </motion.div>
            
            {/* OHLC Grid */}
            <div className="grid grid-cols-2 gap-3">
              {['o', 'h', 'l', 'pc'].map((field) => {
                if (!mappedData[field]) return null
                return (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 bg-background rounded-lg border border-border"
                  >
                    <div className="text-xs text-muted mb-1">{getFieldLabel(field)}</div>
                    <div className="text-base font-semibold text-foreground">
                      {formatCurrency(Number(mappedData[field]), 'USD', 2)}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        ) : (
          // Regular card display for non-stock data
          Object.entries(mappedData).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <span className="text-sm font-medium text-muted">
                {getFieldLabel(key)}
              </span>
              <span className="text-base font-semibold text-foreground font-mono">
                {formatValue(value)}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </Widget>
  )
}
