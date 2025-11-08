'use client'

import React from 'react'

interface SummaryCardProps {
  title: string
  value: string
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
}

export default function SummaryCard({ title, value, trend, subtitle }: SummaryCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-600 dark:text-red-400'
      case 'down':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {trend && trend !== 'stable' && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  )
}

