'use client'

import React, { useMemo } from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Line,
} from 'recharts'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { useThemeStore } from '@/store/useThemeStore'
import { formatCurrency } from '@/utils/formatters'

interface CandlestickWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
  onRefresh?: () => void
}

// Custom candlestick shape
const CandlestickBar = (props: any) => {
  const { x, y, width, height, open, close, high, low, payload } = props
  
  const isGain = close >= open
  const color = isGain ? '#10b981' : '#ef4444'
  const wickColor = color
  
  // Calculate positions
  const candleX = x
  const candleWidth = width
  const wickX = x + width / 2
  
  const openY = open
  const closeY = close
  const highY = high
  const lowY = low
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={wickX}
        y1={Math.min(openY, closeY)}
        x2={wickX}
        y2={highY}
        stroke={wickColor}
        strokeWidth={1}
      />
      {/* Lower wick */}
      <line
        x1={wickX}
        y1={Math.max(openY, closeY)}
        x2={wickX}
        y2={lowY}
        stroke={wickColor}
        strokeWidth={1}
      />
      {/* Candle body */}
      <rect
        x={candleX}
        y={Math.min(openY, closeY)}
        width={candleWidth}
        height={Math.abs(closeY - openY) || 1}
        fill={isGain ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  )
}

export const CandlestickWidget: React.FC<CandlestickWidgetProps> = ({
  widget,
  onSettingsClick,
  onRefresh,
}) => {
  const { theme } = useThemeStore()
  
  const chartData = useMemo(() => {
    if (!widget.data) return []
    
    // Check if this is a single quote object (has c, o, h, l as direct properties, not arrays)
    if (
      typeof widget.data === 'object' &&
      widget.data !== null &&
      !Array.isArray(widget.data) &&
      typeof widget.data.c === 'number' &&
      typeof widget.data.o === 'number' &&
      typeof widget.data.h === 'number' &&
      typeof widget.data.l === 'number' &&
      !Array.isArray(widget.data.o) &&
      !Array.isArray(widget.data.h)
    ) {
      // Single quote data - create a single candlestick
      const open = Number(widget.data.o) || 0
      const high = Number(widget.data.h) || 0
      const low = Number(widget.data.l) || 0
      const close = Number(widget.data.c) || 0
      const timestamp = widget.data.t || Date.now() / 1000
      
      const date = new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      
      return [{
        date: 'Today',
        open,
        high,
        low,
        close,
        range: [Math.min(open, close), Math.max(open, close)],
        isGain: close >= open,
        timestamp,
      }]
    }
    
    // Check if data is in Finnhub format (separate arrays: o, h, l, c, t)
    if (
      typeof widget.data === 'object' &&
      widget.data !== null &&
      !Array.isArray(widget.data) &&
      Array.isArray(widget.data.o) &&
      Array.isArray(widget.data.h) &&
      Array.isArray(widget.data.l) &&
      Array.isArray(widget.data.c)
    ) {
      // Finnhub format: { o: [100, 101], h: [105, 106], l: [98, 99], c: [103, 104], t: [timestamp1, timestamp2] }
      const opens = widget.data.o || []
      const highs = widget.data.h || []
      const lows = widget.data.l || []
      const closes = widget.data.c || []
      const timestamps = widget.data.t || []
      
      const maxLength = Math.max(opens.length, highs.length, lows.length, closes.length)
      
      return Array.from({ length: maxLength }, (_, index) => {
        const open = Number(opens[index]) || 0
        const high = Number(highs[index]) || 0
        const low = Number(lows[index]) || 0
        const close = Number(closes[index]) || 0
        const timestamp = timestamps[index] || Date.now() / 1000
        
        // Convert timestamp to date string
        const date = timestamp
          ? new Date(timestamp * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : `Day ${index + 1}`
        
        return {
          date,
          open,
          high,
          low,
          close,
          range: [Math.min(open, close), Math.max(open, close)],
          isGain: close >= open,
        }
      }).filter(item => {
        // Filter out items where all OHLC values are 0 or invalid
        return item.open > 0 || item.high > 0 || item.low > 0 || item.close > 0
      })
    }
    
    // If data is directly an array (like mock-ohlc-data.json), use it directly
    let rawData: any[] = []
    if (Array.isArray(widget.data)) {
      rawData = widget.data
    } else if (widget.selectedFields.length > 0) {
      // Use dataMapper if fields are selected
      rawData = dataMapper.extractChartData(widget.data, widget.selectedFields)
    } else {
      // Try to find array in the data structure
      if (typeof widget.data === 'object' && widget.data !== null) {
        for (const key in widget.data) {
          if (Array.isArray(widget.data[key])) {
            rawData = widget.data[key]
            break
          }
        }
      }
    }
    
    // Try to find OHLC fields
    const processed = rawData.map((item, index) => {
      // Check all possible field name variations
      const open = item.open || item.Open || item.o || item['1. open'] || 0
      const high = item.high || item.High || item.h || item['2. high'] || 0
      const low = item.low || item.Low || item.l || item['3. low'] || 0
      const close = item.close || item.Close || item.c || item['4. close'] || 0
      const date = item.date || item.Date || item.time || item.timestamp || item['0. date'] || `Day ${index + 1}`
      
      return {
        date,
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        // For bar chart representation
        range: [Math.min(Number(open), Number(close)), Math.max(Number(open), Number(close))],
        isGain: Number(close) >= Number(open),
      }
    }).filter(item => {
      // Filter out items where all OHLC values are 0 or invalid
      return item.open > 0 || item.high > 0 || item.low > 0 || item.close > 0
    })
    
    return processed
  }, [widget.data, widget.selectedFields])

  // Check if we have valid OHLC data
  const hasValidData = chartData.length > 0 && chartData.some(item => 
    item.open > 0 || item.high > 0 || item.low > 0 || item.close > 0
  )

  if (!hasValidData) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-muted">
          <p className="mb-2">No OHLC data available</p>
          <p className="text-xs text-center">
            For candlestick charts, select fields for open, high, low, close prices
          </p>
        </div>
      </Widget>
    )
  }

  // For single candlestick (quote data), use a custom SVG visualization
  const isSingleCandle = chartData.length === 1

  const isDark = theme === 'dark'
  const gridColor = isDark ? '#262626' : '#e4e4e7'
  const textColor = isDark ? '#a1a1aa' : '#71717a'
  const bgColor = isDark ? '#141414' : '#f4f4f5'

  // Calculate domain with padding
  const allValues = chartData.flatMap(d => [d.open, d.high, d.low, d.close]).filter(v => v > 0)
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.99 : 0
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.01 : 100

  // Single candlestick view for quote data
  if (isSingleCandle) {
    const candle = chartData[0]
    const { open, high, low, close } = candle
    const isGain = close >= open
    const candleColor = isGain ? '#10b981' : '#ef4444'
    const wickColor = isGain ? '#10b981' : '#ef4444'
    
    // Calculate dimensions for SVG
    const svgHeight = 300
    const svgWidth = 200
    const padding = 40
    const candleWidth = 60
    const candleX = (svgWidth - candleWidth) / 2
    
    const priceRange = high - low
    const scale = priceRange > 0 ? (svgHeight - 2 * padding) / priceRange : 1
    
    const highY = padding
    const lowY = svgHeight - padding
    const openY = svgHeight - padding - (open - low) * scale
    const closeY = svgHeight - padding - (close - low) * scale
    
    const candleTop = Math.min(openY, closeY)
    const candleBottom = Math.max(openY, closeY)
    const candleHeight = Math.max(candleBottom - candleTop, 2)
    const wickX = svgWidth / 2
    
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 p-6">
          <div className="w-full max-w-md">
            {/* Current Price Display */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatCurrency(close, 'USD', 2)}
              </div>
              <div className={`text-sm font-semibold flex items-center justify-center gap-2 ${
                isGain ? 'text-green-500' : 'text-red-500'
              }`}>
                <span>{isGain ? '↑' : '↓'}</span>
                <span>{formatCurrency(Math.abs(close - open), 'USD', 2)}</span>
                <span>({((close - open) / open * 100).toFixed(2)}%)</span>
              </div>
            </div>
            
            {/* Candlestick SVG */}
            <div className="flex justify-center mb-6">
              <svg width={svgWidth} height={svgHeight} className="overflow-visible">
                {/* Grid lines */}
                <line x1={0} y1={highY} x2={svgWidth} y2={highY} stroke={gridColor} strokeWidth={1} strokeDasharray="2,2" />
                <line x1={0} y1={lowY} x2={svgWidth} y2={lowY} stroke={gridColor} strokeWidth={1} strokeDasharray="2,2" />
                <line x1={0} y1={(highY + lowY) / 2} x2={svgWidth} y2={(highY + lowY) / 2} stroke={gridColor} strokeWidth={1} strokeDasharray="2,2" />
                
                {/* Upper wick */}
                <line
                  x1={wickX}
                  y1={highY}
                  x2={wickX}
                  y2={candleTop}
                  stroke={wickColor}
                  strokeWidth={2}
                />
                
                {/* Lower wick */}
                <line
                  x1={wickX}
                  y1={candleBottom}
                  x2={wickX}
                  y2={lowY}
                  stroke={wickColor}
                  strokeWidth={2}
                />
                
                {/* Candle body */}
                <rect
                  x={candleX}
                  y={candleTop}
                  width={candleWidth}
                  height={candleHeight}
                  fill={candleColor}
                  stroke={candleColor}
                  strokeWidth={1}
                  rx={2}
                />
                
                {/* Price labels */}
                <text x={svgWidth + 10} y={highY + 4} fill={textColor} fontSize="11" className="font-mono">
                  {formatCurrency(high, 'USD', 2)}
                </text>
                <text x={svgWidth + 10} y={lowY + 4} fill={textColor} fontSize="11" className="font-mono">
                  {formatCurrency(low, 'USD', 2)}
                </text>
                <text x={svgWidth + 10} y={openY + 4} fill={textColor} fontSize="11" className="font-mono">
                  O: {formatCurrency(open, 'USD', 2)}
                </text>
                <text x={svgWidth + 10} y={closeY + 4} fill={textColor} fontSize="11" className="font-mono">
                  C: {formatCurrency(close, 'USD', 2)}
                </text>
              </svg>
            </div>
            
            {/* OHLC Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted mb-1">Open</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(open, 'USD', 2)}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted mb-1">High</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(high, 'USD', 2)}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted mb-1">Low</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(low, 'USD', 2)}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted mb-1">Close</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(close, 'USD', 2)}</div>
              </div>
            </div>
          </div>
        </div>
      </Widget>
    )
  }

  // Multiple candles view (for historical data)
  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-[280px] max-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 11 }}
              tickLine={{ stroke: textColor }}
            />
            <YAxis
              domain={[minValue, maxValue]}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 11 }}
              tickLine={{ stroke: textColor }}
              tickFormatter={(value) => formatCurrency(value, 'USD', 0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: bgColor,
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: isDark ? '#fafafa' : '#18181b',
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(value, 'USD', 2),
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            
            {/* Simplified candlestick representation using bars */}
            <Bar
              dataKey="range"
              fill="#10b981"
              stroke="#10b981"
              name="Price Range"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isGain ? '#10b981' : '#ef4444'}
                  stroke={entry.isGain ? '#10b981' : '#ef4444'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-1 pt-1 text-xs text-muted flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Gain</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>Loss</span>
          </div>
        </div>
      </div>
    </Widget>
  )
}

