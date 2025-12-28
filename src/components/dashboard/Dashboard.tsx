'use client'

import React, { useState } from 'react'
import { BarChart3, Download, Layout, Menu, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from '@/store/useDashboardStore'
import { WidgetGrid } from './WidgetGrid'
import { AddWidgetPlaceholder } from './AddWidgetPlaceholder'
import { AddWidgetModal } from '@/components/modals/AddWidgetModal'
import { TemplateModal } from '@/components/modals/TemplateModal'
import { ExportImportModal } from '@/components/modals/ExportImportModal'
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export const Dashboard: React.FC = () => {
  const {
    widgets,
    isAddingWidget,
    editingWidgetId,
    setIsAddingWidget,
    setEditingWidgetId,
    clearWidgets,
  } = useDashboardStore()

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isExportImportModalOpen, setIsExportImportModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAddWidget = () => {
    setIsAddingWidget(true)
    setIsMobileMenuOpen(false)
  }

  const handleClearDemo = () => {
    const confirmed = window.confirm(
      'Remove all widgets and reset the dashboard? This cannot be undone.'
    )
    if (!confirmed) return
    clearWidgets()
  }

  const handleCloseModal = () => {
    setIsAddingWidget(false)
    setEditingWidgetId(null)
  }

  const handleEditWidget = (widgetId: string) => {
    setEditingWidgetId(widgetId)
    setIsAddingWidget(true)
  }

  const renderWidget = (widget: any) => {
    return (
      <WidgetWrapper
        widget={widget}
        onSettingsClick={() => handleEditWidget(widget.id)}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                FinBoard
              </h1>
              <p className="text-sm text-muted hidden sm:block">
                {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsTemplateModalOpen(true)}
              title="Templates"
            >
              <Layout size={18} />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsExportImportModalOpen(true)}
              title="Export/Import"
            >
              <Download size={18} />
            </Button>
            <Button
              variant="ghost"
              onClick={handleClearDemo}
              title="Clear dashboard"
            >
              <Trash2 size={18} />
            </Button>
            <ThemeToggle />
            <Button variant="primary" onClick={handleAddWidget}>
              <span className="flex items-center gap-2">
                <span>+</span>
                <span>Add Widget</span>
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-surface border border-border rounded-xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setIsTemplateModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-background rounded-lg transition-colors"
                >
                  <Layout size={18} />
                  <span>Templates</span>
                </button>
                <button
                  onClick={() => {
                    setIsExportImportModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-background rounded-lg transition-colors"
                >
                  <Download size={18} />
                  <span>Export / Import</span>
                </button>
                <button
                  onClick={() => {
                    handleClearDemo()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-background rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Reset Dashboard</span>
                </button>
                <Button variant="primary" onClick={handleAddWidget} className="w-full">
                  <span className="flex items-center gap-2 justify-center">
                    <span>+</span>
                    <span>Add Widget</span>
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Widget Grid */}
      <AnimatePresence mode="wait">
        {widgets.length === 0 ? (
          <motion.div 
            key="empty"
            className="flex flex-col items-center justify-center min-h-[60vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-surface rounded-2xl flex items-center justify-center border border-border">
                  <BarChart3 className="text-primary" size={40} />
                </div>
              </motion.div>
              <motion.h2 
                className="text-2xl font-semibold text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Build Your Finance Dashboard
              </motion.h2>
              <motion.p 
                className="text-muted max-w-md mx-auto mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create custom widgets by connecting to any finance API. Track
                stocks, crypto, forex, or economic indicators - all in real-time.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Button variant="secondary" onClick={() => setIsTemplateModalOpen(true)}>
                  <span className="flex items-center gap-2">
                    <Layout size={18} />
                    Start from Template
                  </span>
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AddWidgetPlaceholder onClick={handleAddWidget} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WidgetGrid widgets={widgets} renderWidget={renderWidget} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddWidgetModal
        isOpen={isAddingWidget}
        onClose={handleCloseModal}
        editingWidgetId={editingWidgetId}
      />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
      <ExportImportModal
        isOpen={isExportImportModalOpen}
        onClose={() => setIsExportImportModalOpen(false)}
      />
    </div>
  )
}
