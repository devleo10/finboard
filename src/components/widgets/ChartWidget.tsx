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
import { formatValue } from '@/utils/formatters'

interface ChartWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  onSettingsClick,
}) => {
  const chartData = useMemo(() => {
    if (!widget.data) return []
    return dataMapper.extractChartData(widget.data, widget.selectedFields)
  }, [widget.data, widget.selectedFields])

  const columns = useMemo(() => {
    if (chartData.length === 0) return []
    return Object.keys(chartData[0])
  }, [chartData])

  // Find a suitable X-axis column (prefer time/date fields)
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
      <Widget widget={widget} onSettingsClick={onSettingsClick}>
        <div className="flex items-center justify-center h-full p-8 text-dark-muted">
          <p>No data available</p>
        </div>
      </Widget>
    )
  }

  // Generate colors for multiple lines
  const colors = [
    '#10b981', // primary green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
  ]

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick}>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey={xAxisColumn}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Legend
              wrapperStyle={{ color: '#f1f5f9' }}
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


