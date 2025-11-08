'use client'

import React from 'react'
import ChartControls, { type TimeRange, type AggregateType } from './ChartControls'

interface SectionHeaderProps {
  title: string
  description?: string
  timeRange?: TimeRange
  aggregate?: AggregateType
  onTimeRangeChange?: (range: TimeRange) => void
  onAggregateChange?: (aggregate: AggregateType) => void
  showControls?: boolean
}

export default function SectionHeader({
  title,
  description,
  timeRange,
  aggregate,
  onTimeRangeChange,
  onAggregateChange,
  showControls = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {showControls && timeRange && aggregate && onTimeRangeChange && onAggregateChange && (
          <div className="lg:flex-shrink-0">
            <ChartControls
              timeRange={timeRange}
              aggregate={aggregate}
              onTimeRangeChange={onTimeRangeChange}
              onAggregateChange={onAggregateChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

