'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { APITester } from './APITester'
import { FieldSelector } from './FieldSelector'
import { DisplayMode, SelectedField, APIResponse, FieldInfo } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'
import { API_TEMPLATES } from '@/config/apiTemplates'
import { getTemplateUrl } from '@/utils/apiKeyInjector'

interface AddWidgetModalProps {
  isOpen: boolean
  onClose: () => void
  editingWidgetId?: string | null
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  editingWidgetId,
}) => {
  const { widgets, addWidget, updateWidget } = useDashboardStore()
  const editingWidget = editingWidgetId
    ? widgets.find((w) => w.id === editingWidgetId)
    : null

  const [widgetName, setWidgetName] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('card')
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([])
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    if (editingWidget) {
      setWidgetName(editingWidget.name)
      setApiUrl(editingWidget.apiUrl)
      setRefreshInterval(editingWidget.refreshInterval)
      setDisplayMode(editingWidget.displayMode)
      setSelectedFields(editingWidget.selectedFields)
    } else {
      setWidgetName('')
      setApiUrl('')
      setRefreshInterval(30)
      setDisplayMode('card')
      setSelectedFields([])
      setApiResponse(null)
      setSelectedTemplate('')
    }
  }, [editingWidget, isOpen])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = API_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      // Inject API keys from environment variables
      const urlWithApiKey = getTemplateUrl(template.url)
      setApiUrl(urlWithApiKey)
      setWidgetName(template.name)
    }
  }

  const handleTestComplete = (response: APIResponse) => {
    setApiResponse(response)
  }

  const handleSubmit = () => {
    if (!widgetName.trim()) {
      alert('Please enter a widget name')
      return
    }

    if (!apiUrl.trim()) {
      alert('Please enter an API URL')
      return
    }

    if (!apiResponse?.success) {
      alert('Please test the API connection first')
      return
    }

    if (selectedFields.length === 0) {
      alert('Please select at least one field to display')
      return
    }

    if (editingWidget) {
      updateWidget(editingWidget.id, {
        name: widgetName,
        apiUrl,
        refreshInterval,
        displayMode,
        selectedFields,
      })
    } else {
      addWidget({
        name: widgetName,
        apiUrl,
        refreshInterval,
        displayMode,
        selectedFields,
      })
    }

    onClose()
  }

  const availableFields: FieldInfo[] = apiResponse?.fields || []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWidget ? 'Edit Widget' : 'Add New Widget'}
      size="xl"
    >
      <div className="space-y-6">
        {/* API Template Selector */}
        {!editingWidget && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Quick Start (Optional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a template...</option>
              {API_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Widget Name"
          placeholder="e.g., Bitcoin Price Tracker"
          value={widgetName}
          onChange={(e) => setWidgetName(e.target.value)}
        />

        <div>
          <Input
            label="API URL"
            placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <div className="mt-2">
            <APITester apiUrl={apiUrl} onTestComplete={handleTestComplete} />
          </div>
        </div>

        <Input
          label="Refresh Interval (seconds)"
          type="number"
          min="10"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 30)}
        />

        {apiResponse?.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FieldSelector
              fields={availableFields}
              selectedFields={selectedFields}
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
              onFieldsChange={setSelectedFields}
            />
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!apiResponse?.success || selectedFields.length === 0}
          >
            {editingWidget ? 'Update Widget' : 'Add Widget'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
