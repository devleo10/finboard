'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { APITester } from './APITester'
import { FieldSelector } from './FieldSelector'
import { DisplayMode, SelectedField, APIResponse, FieldInfo } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'

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

  useEffect(() => {
    if (editingWidget) {
      setWidgetName(editingWidget.name)
      setApiUrl(editingWidget.apiUrl)
      setRefreshInterval(editingWidget.refreshInterval)
      setDisplayMode(editingWidget.displayMode)
      setSelectedFields(editingWidget.selectedFields)
    } else {
      // Reset form
      setWidgetName('')
      setApiUrl('')
      setRefreshInterval(30)
      setDisplayMode('card')
      setSelectedFields([])
      setApiResponse(null)
    }
  }, [editingWidget, isOpen])

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
          <FieldSelector
            fields={availableFields}
            selectedFields={selectedFields}
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
            onFieldsChange={setSelectedFields}
          />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
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


