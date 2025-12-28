'use client'

import React, { useState, useMemo } from 'react'
import { Plus, X, Grid, Table as TableIcon, BarChart3, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
    { mode: 'chart', icon: <BarChart3 size={16} />, label: 'Line Chart' },
    { mode: 'candlestick', icon: <TrendingUp size={16} />, label: 'Candlestick' },
  ]

  return (
    <div className="space-y-4">
      {/* Display Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Fields to Display
        </label>
        <p className="text-xs text-muted mb-3">Display Mode</p>
        <div className="flex flex-wrap gap-2">
          {displayModes.map(({ mode, icon, label }) => (
            <motion.button
              key={mode}
              onClick={() => onDisplayModeChange(mode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                displayMode === mode
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-background border-border text-foreground hover:border-primary/50'
              )}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <p className="text-xs text-muted">Search Fields</p>
        <Input
          placeholder="Search for fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {(displayMode === 'table' || displayMode === 'chart' || displayMode === 'candlestick') && (
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showArraysOnly}
              onChange={(e) => setShowArraysOnly(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
            />
            <span>Show arrays only (for table view)</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Fields */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Available Fields
          </h3>
          <div className="border border-border rounded-lg max-h-72 overflow-y-auto bg-background">
            {filteredFields.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm">
                No fields found
              </div>
            ) : (
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {filteredFields.slice(0, 50).map((field) => {
                    const isSelected = selectedFields.some(
                      (f) => f.path === field.path
                    )
                    return (
                      <motion.div
                        key={field.path}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3 hover:bg-surface transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <code className="text-xs text-primary font-mono break-all">
                                {field.path}
                              </code>
                              <span className="text-xs px-1.5 py-0.5 bg-surface rounded text-muted">
                                {field.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted truncate">
                              {getSampleValue(field.value)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddField(field)}
                            disabled={isSelected}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={isSelected ? 'Already selected' : 'Add field'}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Selected Fields */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Selected Fields ({selectedFields.length})
          </h3>
          <div className="border border-border rounded-lg max-h-72 overflow-y-auto bg-background">
            {selectedFields.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm">
                No fields selected
              </div>
            ) : (
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {selectedFields.map((field, index) => (
                    <motion.div
                      key={field.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 hover:bg-surface transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <code className="text-xs text-primary font-mono break-all">
                            {field.path}
                          </code>
                          {field.displayName && (
                            <p className="text-xs text-muted mt-1">
                              Display: {field.displayName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveField(field.path)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove field"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
