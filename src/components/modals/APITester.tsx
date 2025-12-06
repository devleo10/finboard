'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { apiService } from '@/services/apiService'
import { exploreFields } from '@/utils/fieldExplorer'
import { APIResponse } from '@/store/types'
import { cn } from '@/utils/cn'

interface APITesterProps {
  apiUrl: string
  onTestComplete: (response: APIResponse) => void
}

export const APITester: React.FC<APITesterProps> = ({
  apiUrl,
  onTestComplete,
}) => {
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<APIResponse | null>(null)

  const handleTest = async () => {
    if (!apiUrl.trim()) {
      setTestResult({
        data: null,
        fields: [],
        success: false,
        error: 'Please enter an API URL',
      })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await apiService.fetch({
        url: apiUrl,
        useCache: false,
      })

      if (response.success && response.data) {
        const fields = exploreFields(response.data)
        const result: APIResponse = {
          ...response,
          fields,
          fieldCount: fields.length,
        }
        setTestResult(result)
        onTestComplete(result)
      } else {
        setTestResult(response)
        onTestComplete(response)
      }
    } catch (error) {
      const result: APIResponse = {
        data: null,
        fields: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
      setTestResult(result)
      onTestComplete(result)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleTest}
        disabled={isTesting}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isTesting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <span>Test</span>
          </>
        )}
      </button>

      {testResult && (
        <div
          className={cn(
            'p-3 rounded-lg border',
            testResult.success
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          )}
        >
          <div className="flex items-start gap-2">
            {testResult.success ? (
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {testResult.success
                  ? `API connection successful! ${testResult.fieldCount || 0} top-level fields found.`
                  : testResult.error || 'API connection failed'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


