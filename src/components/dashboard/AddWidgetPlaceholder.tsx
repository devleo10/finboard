'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface AddWidgetPlaceholderProps {
  onClick: () => void
}

export const AddWidgetPlaceholder: React.FC<AddWidgetPlaceholderProps> = ({
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-64 h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 text-muted hover:border-primary hover:text-primary transition-all duration-300 bg-surface/50 hover:bg-surface group"
    >
      <motion.div 
        className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors"
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        <Plus size={24} />
      </motion.div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">Add Widget</h3>
        <p className="text-sm text-muted max-w-[180px]">
          Connect to a finance API and create a custom widget
        </p>
      </div>
    </motion.button>
  )
}
