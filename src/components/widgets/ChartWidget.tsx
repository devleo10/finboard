'use client'

import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { useThemeStore } from '@/store/useThemeStore'

interface ChartWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
  onRefresh?: () => void
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  onSettingsClick,
  onRefresh,
}) => {
  const { theme } = useThemeStore()
  
  const chartData = useMemo(() => {
    if (!widget.data) return []
    return dataMapper.extractChartData(widget.data, widget.selectedFields)
  }, [widget.data, widget.selectedFields])

  const columns = useMemo(() => {
    if (chartData.length === 0) return []
    return Object.keys(chartData[0])
  }, [chartData])

  const xAxisColumn = useMemo(() => {
    const timeColumns = columns.filter((col) =>
      /time|date|timestamp|day|month|year/i.test(col)
    )
    if (timeColumns.length > 0) return timeColumns[0]
    return columns[0] || 'index'
  }, [columns])

  const dataColumns = useMemo(() => {
    return columns.filter((col) => col !== xAxisColumn)
  }, [columns, xAxisColumn])

  if (chartData.length === 0) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex items-center justify-center h-full p-8 text-muted">
          <p>No data available</p>
        </div>
      </Widget>
    )
  }

  const colors = [
    '#10b981', // primary green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
  ]

  const isDark = theme === 'dark'
  const gridColor = isDark ? '#262626' : '#e4e4e7'
  const textColor = isDark ? '#a1a1aa' : '#71717a'
  const bgColor = isDark ? '#141414' : '#f4f4f5'

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
      <div className="flex-1 min-h-[300px] max-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey={xAxisColumn}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: bgColor,
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: isDark ? '#fafafa' : '#18181b',
              }}
            />
            <Legend
              wrapperStyle={{ color: textColor }}
              iconType="line"
            />
            {dataColumns.map((column, index) => (
              <Line
                key={column}
                type="monotone"
                dataKey={column}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={column.replace(/_/g, ' ')}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  )
}
