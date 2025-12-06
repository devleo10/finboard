'use client'

import React, { useState, useMemo } from 'react'
import { Plus, X, Grid, Table as TableIcon, BarChart3 } from 'lucide-react'
import { DisplayMode, FieldInfo, SelectedField } from '@/store/types'
import { filterFields, getSampleValue } from '@/utils/fieldExplorer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

interface FieldSelectorProps {
  fields: FieldInfo[]
  selectedFields: SelectedField[]
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  onFieldsChange: (fields: SelectedField[]) => void
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selectedFields,
  displayMode,
  onDisplayModeChange,
  onFieldsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArraysOnly, setShowArraysOnly] = useState(false)

  const filteredFields = useMemo(() => {
    return filterFields(fields, searchQuery, showArraysOnly)
  }, [fields, searchQuery, showArraysOnly])

  const handleAddField = (field: FieldInfo) => {
    const newField: SelectedField = {
      path: field.path,
      displayName: field.path.split('.').pop(),
    }
    onFieldsChange([...selectedFields, newField])
  }

  const handleRemoveField = (path: string) => {
    onFieldsChange(selectedFields.filter((f) => f.path !== path))
  }

  const displayModes: { mode: DisplayMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'card', icon: <Grid size={16} />, label: 'Card' },
    { mode: 'table', icon: <TableIcon size={16} />, label: 'Table' },
    { mode: 'chart', icon: <BarChart3 size={16} />, label: 'Chart' },
  ]

  return (
    <div className="space-y-4">
      {/* Display Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">
          Display Mode
        </label>
        <div className="flex gap-2">
          {displayModes.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => onDisplayModeChange(mode)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                displayMode === mode
                  ? 'bg-primary border-primary text-white'
                  : 'bg-dark-bg border-dark-border text-dark-text hover:bg-dark-surface'
              )}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <Input
          placeholder="Search for fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {displayMode === 'table' && (
          <label className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
            <input
              type="checkbox"
              checked={showArraysOnly}
              onChange={(e) => setShowArraysOnly(e.target.checked)}
              className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary"
            />
            <span>Show arrays only (for table view)</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Available Fields */}
        <div>
          <h3 className="text-sm font-semibold text-dark-text mb-2">
            Available Fields
          </h3>
          <div className="border border-dark-border rounded-lg max-h-96 overflow-y-auto">
            {filteredFields.length === 0 ? (
              <div className="p-4 text-center text-dark-muted text-sm">
                No fields found
              </div>
            ) : (
              <div className="divide-y divide-dark-border">
                {filteredFields.map((field) => {
                  const isSelected = selectedFields.some(
                    (f) => f.path === field.path
                  )
                  return (
                    <div
                      key={field.path}
                      className="p-3 hover:bg-dark-bg transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs text-primary font-mono break-all">
                              {field.path}
                            </code>
                            <span className="text-xs px-1.5 py-0.5 bg-dark-bg rounded text-dark-muted">
                              {field.type}
                            </span>
                          </div>
                          <p className="text-xs text-dark-muted truncate">
                            {getSampleValue(field.value)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddField(field)}
                          disabled={isSelected}
                          className="p-1 text-primary hover:text-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={isSelected ? 'Already selected' : 'Add field'}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Fields */}
        <div>
          <h3 className="text-sm font-semibold text-dark-text mb-2">
            Selected Fields
          </h3>
          <div className="border border-dark-border rounded-lg max-h-96 overflow-y-auto">
            {selectedFields.length === 0 ? (
              <div className="p-4 text-center text-dark-muted text-sm">
                No fields selected
              </div>
            ) : (
              <div className="divide-y divide-dark-border">
                {selectedFields.map((field) => (
                  <div
                    key={field.path}
                    className="p-3 hover:bg-dark-bg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <code className="text-xs text-primary font-mono break-all">
                          {field.path}
                        </code>
                        {field.displayName && (
                          <p className="text-xs text-dark-muted mt-1">
                            Display: {field.displayName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveField(field.path)}
                        className="p-1 text-red-500 hover:text-red-400 transition-colors"
                        title="Remove field"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


