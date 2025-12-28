'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Layout, TrendingUp, DollarSign, Zap } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { DASHBOARD_TEMPLATES, DashboardTemplate } from '@/config/dashboardTemplates'
import { useDashboardStore } from '@/store/useDashboardStore'
import { cn } from '@/utils/cn'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
}

const getCategoryIcon = (category: DashboardTemplate['category']) => {
  switch (category) {
    case 'crypto':
      return <TrendingUp size={20} />
    case 'forex':
      return <DollarSign size={20} />
    case 'stocks':
      return <Layout size={20} />
    default:
      return <Zap size={20} />
  }
}

const getCategoryColor = (category: DashboardTemplate['category']) => {
  switch (category) {
    case 'crypto':
      return 'from-orange-500 to-yellow-500'
    case 'forex':
      return 'from-green-500 to-emerald-500'
    case 'stocks':
      return 'from-blue-500 to-cyan-500'
    default:
      return 'from-purple-500 to-pink-500'
  }
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addWidget, widgets } = useDashboardStore()

  const handleApplyTemplate = (template: DashboardTemplate) => {
    // Add all widgets from the template
    template.widgets.forEach((widgetConfig) => {
      addWidget(widgetConfig)
    })
    onClose()
  }

  const handleApplyTemplateReplace = (template: DashboardTemplate) => {
    // Clear existing widgets first via store action would be needed
    // For now, just add the template widgets
    template.widgets.forEach((widgetConfig) => {
      addWidget(widgetConfig)
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dashboard Templates"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-muted text-sm">
          Choose a pre-built template to quickly set up your dashboard. Templates include pre-configured widgets with popular financial data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DASHBOARD_TEMPLATES.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => handleApplyTemplate(template)}
            >
              {/* Gradient overlay on hover */}
              <div className={cn(
                'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br',
                getCategoryColor(template.category)
              )} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br',
                    getCategoryColor(template.category)
                  )}>
                    <span className="text-xl">{template.icon}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-surface rounded-full text-muted capitalize">
                    {template.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-muted mb-3">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {template.widgets.length} widget{template.widgets.length !== 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

