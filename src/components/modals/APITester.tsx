'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.button
        onClick={handleTest}
        disabled={isTesting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
      >
        {isTesting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            <span>Test</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
