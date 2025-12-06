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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget as WidgetType } from '@/store/types'
import { useDashboardStore } from '@/store/useDashboardStore'
import { GripVertical } from 'lucide-react'
import { cn } from '@/utils/cn'

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
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'z-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-4 cursor-grab active:cursor-grabbing text-dark-muted hover:text-dark-text transition-colors z-10"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
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
  const { reorderWidgets } = useDashboardStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget}>
              {renderWidget(widget)}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}


