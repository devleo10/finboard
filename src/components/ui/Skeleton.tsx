'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'shimmer' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-surface via-border to-surface bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-border',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  )
}

interface SkeletonCardProps {
  className?: string
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div className={cn('bg-surface border border-border rounded-xl p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width={120} height={24} />
          <Skeleton variant="text" width={40} height={20} />
        </div>
        <div className="flex gap-1">
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="rectangular" height={48} className="w-full" />
        <Skeleton variant="rectangular" height={48} className="w-full" />
        <Skeleton variant="rectangular" height={48} className="w-full" />
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <Skeleton variant="text" width={120} height={16} />
      </div>
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('bg-surface border border-border rounded-xl p-4', className)}>
      {/* Header */}
      <div className="flex gap-4 mb-4 pb-2 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height={20} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height={18} className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

