'use client'

import React from 'react'

export type TimeRange = '5m' | '10m' | '15m' | '1h' | '6h' | '1d' | '7d' | '30d'
export type AggregateType = 'average' | 'sum' | 'min' | 'max' | 'none'

interface ChartControlsProps {
  timeRange: TimeRange
  aggregate: AggregateType
  onTimeRangeChange: (range: TimeRange) => void
  onAggregateChange: (aggregate: AggregateType) => void
}

export default function ChartControls({
  timeRange,
  aggregate,
  onTimeRangeChange,
  onAggregateChange,
}: ChartControlsProps) {
  const timeRanges: TimeRange[] = ['5m', '10m', '15m', '1h', '6h', '1d', '7d', '30d']
  const aggregates: { value: AggregateType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'average', label: 'Average' },
    { value: 'sum', label: 'Sum' },
    { value: 'min', label: 'Min' },
    { value: 'max', label: 'Max' },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Time Range:
        </span>
        <div className="flex gap-1 flex-wrap">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-2.5 py-1 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                timeRange === range
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={`Select ${range} time range`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="aggregate-select"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
        >
          Aggregate:
        </label>
        <select
          id="aggregate-select"
          value={aggregate}
          onChange={(e) => onAggregateChange(e.target.value as AggregateType)}
          className="px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {aggregates.map((agg) => (
            <option key={agg.value} value={agg.value}>
              {agg.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

