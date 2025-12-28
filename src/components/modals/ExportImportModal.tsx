'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, FileJson, CheckCircle2, XCircle, AlertCircle, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDashboardStore } from '@/store/useDashboardStore'
import { storageService } from '@/services/storageService'
import { cn } from '@/utils/cn'

interface ExportImportModalProps {
  isOpen: boolean
  onClose: () => void
}

type ImportStatus = 'idle' | 'success' | 'error'

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { widgets, hydrate } = useDashboardStore()
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle')
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const config = storageService.exportConfig()
    if (!config) {
      alert('No configuration to export')
      return
    }

    // Create and download the file
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finboard-dashboard-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      try {
        // Validate JSON
        const parsed = JSON.parse(content)
        if (!parsed.widgets || !Array.isArray(parsed.widgets)) {
          throw new Error('Invalid configuration format')
        }

        const success = storageService.importConfig(content)
        if (success) {
          hydrate() // Reload widgets from storage
          setImportStatus('success')
          setImportMessage(`Successfully imported ${parsed.widgets.length} widget(s)`)
        } else {
          throw new Error('Failed to import configuration')
        }
      } catch (error) {
        setImportStatus('error')
        setImportMessage(error instanceof Error ? error.message : 'Invalid file format')
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all widgets? This cannot be undone.')) {
      storageService.clearWidgets()
      hydrate()
      setImportStatus('success')
      setImportMessage('All widgets have been cleared')
    }
  }

  const resetStatus = () => {
    setImportStatus('idle')
    setImportMessage('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export / Import Dashboard"
      size="md"
    >
      <div className="space-y-6">
        {/* Export Section */}
        <div className="bg-background border border-border rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Download className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Export Dashboard
              </h3>
              <p className="text-sm text-muted mb-3">
                Download your dashboard configuration as a JSON file. This includes all widgets and their settings.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="primary" onClick={handleExport} disabled={widgets.length === 0}>
                  <span className="flex items-center gap-2">
                    <FileJson size={16} />
                    Export ({widgets.length} widget{widgets.length !== 1 ? 's' : ''})
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-background border border-border rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Upload className="text-blue-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Import Dashboard
              </h3>
              <p className="text-sm text-muted mb-3">
                Upload a previously exported JSON file to restore your dashboard configuration.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="secondary" onClick={handleImportClick}>
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  Choose File
                </span>
              </Button>
            </div>
          </div>

          {/* Import Status */}
          <AnimatePresence>
            {importStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'mt-4 p-3 rounded-lg flex items-center gap-2',
                  importStatus === 'success'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                )}
              >
                {importStatus === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                <span className="text-sm">{importMessage}</span>
                <button
                  onClick={resetStatus}
                  className="ml-auto text-current hover:opacity-70"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Danger Zone
              </h3>
              <p className="text-sm text-muted mb-3">
                Clear all widgets from your dashboard. This action cannot be undone.
              </p>
              <Button variant="danger" onClick={handleClearAll}>
                <span className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Clear All Widgets
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

