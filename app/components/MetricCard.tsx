'use client'

import React from 'react'
import type { Metric } from '@/app/lib/types'
import Chart from './Chart'

interface MetricCardProps {
  metric: Metric
  baseline?: number
}

export default function MetricCard({ metric, baseline }: MetricCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
    }
  }

  const formatValue = (value: number, unit: string): string => {
    if (unit === 'Bytes' || unit === 'Bytes/Second') {
      if (value >= 1073741824) {
        return `${(value / 1073741824).toFixed(2)} GB`
      }
      if (value >= 1048576) {
        return `${(value / 1048576).toFixed(2)} MB`
      }
      if (value >= 1024) {
        return `${(value / 1024).toFixed(2)} KB`
      }
      return `${value.toFixed(2)} B`
    }
    return `${value.toFixed(2)} ${unit}`
  }

  const currentValue = metric.values[metric.values.length - 1]
  const previousValue = metric.values[metric.values.length - 2] || currentValue
  const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {metric.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.description}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(metric.priority)}`}
        >
          {metric.priority}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(currentValue, metric.unit)}
          </span>
          {trend !== 'stable' && (
            <span
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Current value</p>
      </div>

      <div className="h-[250px]">
        <Chart metric={metric} baseline={baseline} />
      </div>
      {baseline !== undefined && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Baseline: {formatValue(baseline, metric.unit)}
        </div>
      )}
    </div>
  )
}

