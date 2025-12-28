'use client'

import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { Widget } from './Widget'
import { Widget as WidgetType } from '@/store/types'
import { dataMapper } from '@/services/dataMapper'
import { formatValue } from '@/utils/formatters'
import { cn } from '@/utils/cn'

interface TableWidgetProps {
  widget: WidgetType
  onSettingsClick?: () => void
  onRefresh?: () => void
}

type SortDirection = 'asc' | 'desc' | null
type SortConfig = { column: string; direction: SortDirection }

const ITEMS_PER_PAGE = 10

export const TableWidget: React.FC<TableWidgetProps> = ({
  widget,
  onSettingsClick,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: '',
    direction: null,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const tableData = useMemo(() => {
    if (!widget.data) return []
    return dataMapper.extractTableData(widget.data, widget.selectedFields)
  }, [widget.data, widget.selectedFields])

  const filteredAndSortedData = useMemo(() => {
    let filtered = tableData

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(query)
        )
      )
    }

    if (sortConfig.column && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.column]
        const bVal = b[sortConfig.column]

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc'
            ? aVal - bVal
            : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return filtered
  }, [tableData, searchQuery, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredAndSortedData.slice(start, end)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)

  const handleSort = (column: string) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' }
        } else {
          return { column: '', direction: null }
        }
      } else {
        return { column, direction: 'asc' }
      }
    })
    setCurrentPage(1)
  }

  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return Object.keys(tableData[0])
  }, [tableData])

  if (tableData.length === 0) {
    return (
      <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
        <div className="flex items-center justify-center h-full p-8 text-muted">
          <p>No data available</p>
        </div>
      </Widget>
    )
  }

  return (
    <Widget widget={widget} onSettingsClick={onSettingsClick} onRefresh={onRefresh}>
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-lg border border-border">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-surface z-10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-sm font-semibold text-muted border-b border-border cursor-pointer hover:bg-background transition-colors"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="capitalize">
                        {column.replace(/_/g, ' ')}
                      </span>
                      {sortConfig.column === column && (
                        <span className="text-primary">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border hover:bg-background transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-3 text-sm text-foreground font-mono"
                    >
                      {formatValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
          <p className="text-xs text-muted">
            {paginatedData.length > 0
              ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredAndSortedData.length
                )} of ${filteredAndSortedData.length} items`
              : '0 items'}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-background border border-border rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-background border border-border rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Widget>
  )
}
