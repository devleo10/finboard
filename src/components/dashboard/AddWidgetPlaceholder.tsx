'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AddWidgetPlaceholderProps {
  onClick: () => void
}

export const AddWidgetPlaceholder: React.FC<AddWidgetPlaceholderProps> = ({
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors min-h-[200px]"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Plus size={32} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-dark-text mb-2">Add Widget</h3>
      <p className="text-sm text-dark-muted text-center">
        Connect to a finance API and create a custom widget
      </p>
    </div>
  )
}


