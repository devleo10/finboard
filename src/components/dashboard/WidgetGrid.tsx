'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Widget as WidgetType } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'
import { GripVertical } from 'lucide-react'
import { cn } from '@/utils/cn'
import { AddWidgetPlaceholder } from './AddWidgetPlaceholder'

interface SortableWidgetProps {
  widget: WidgetType
  children: React.ReactNode
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className={cn(
        'relative',
        isDragging && 'z-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-4 cursor-grab active:cursor-grabbing text-muted hover:text-foreground p-1 rounded-lg hover:bg-surface transition-colors z-10"
      >
        <GripVertical size={18} />
      </div>
      {children}
    </motion.div>
  )
}

interface WidgetGridProps {
  widgets: WidgetType[]
  renderWidget: (widget: WidgetType) => React.ReactNode
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  renderWidget,
}) => {
  const { reorderWidgets, setIsAddingWidget } = useDashboardStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id)
      const newIndex = widgets.findIndex((w) => w.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderWidgets(oldIndex, newIndex)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pl-6 auto-rows-fr">
          {widgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col min-h-[400px]"
            >
              <SortableWidget widget={widget}>
                {renderWidget(widget)}
              </SortableWidget>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: widgets.length * 0.1 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <AddWidgetPlaceholder onClick={() => setIsAddingWidget(true)} />
          </motion.div>
        </div>
      </SortableContext>
    </DndContext>
  )
}
