'use client'

import React, { useEffect, useState, useMemo } from 'react'
import type { MetricsData, Metric } from '@/app/lib/types'
import MetricCard from './components/MetricCard'
import SectionHeader from './components/SectionHeader'
import SummaryCard from './components/SummaryCard'
import LoadingSkeleton from './components/LoadingSkeleton'

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/metrics')
        if (!response.ok) {
          throw new Error('Failed to fetch metrics')
        }
        const data = await response.json()
        setMetricsData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const summaryMetrics = useMemo(() => {
    if (!metricsData) return null

    const overviewSection = metricsData.sections.find((s) => s.title === 'Overview')
    if (!overviewSection) return null

    const cpuMetric = overviewSection.metrics.find((m) => m.name === 'CPUUtilization')
    const memoryMetric = overviewSection.metrics.find((m) => m.name === 'FreeableMemory')
    const connectionsMetric = overviewSection.metrics.find(
      (m) => m.name === 'DatabaseConnections'
    )

    if (!cpuMetric || !memoryMetric || !connectionsMetric) return null

    const formatBytes = (bytes: number) => {
      if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`
      if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`
      return `${(bytes / 1024).toFixed(2)} KB`
    }

    const getTrend = (values: number[]): 'up' | 'down' | 'stable' => {
      if (values.length < 2) return 'stable'
      const current = values[values.length - 1]
      const previous = values[values.length - 2]
      if (current > previous * 1.05) return 'up'
      if (current < previous * 0.95) return 'down'
      return 'stable'
    }

    return {
      cpu: {
        value: `${cpuMetric.values[cpuMetric.values.length - 1].toFixed(1)}%`,
        trend: getTrend(cpuMetric.values),
      },
      memory: {
        value: formatBytes(memoryMetric.values[memoryMetric.values.length - 1]),
        trend: getTrend(memoryMetric.values),
      },
      connections: {
        value: connectionsMetric.values[connectionsMetric.values.length - 1].toString(),
        trend: getTrend(connectionsMetric.values),
      },
    }
  }, [metricsData])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Metrics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Loading metrics...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!metricsData) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Database Metrics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: {new Date(metricsData.lastUpdated).toLocaleString()}
        </p>
      </div>

      {summaryMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Average CPU Utilization"
            value={summaryMetrics.cpu.value}
            trend={summaryMetrics.cpu.trend}
            subtitle="Current CPU usage"
          />
          <SummaryCard
            title="Available Memory"
            value={summaryMetrics.memory.value}
            trend={summaryMetrics.memory.trend}
            subtitle="Freeable memory"
          />
          <SummaryCard
            title="Active Connections"
            value={summaryMetrics.connections.value}
            trend={summaryMetrics.connections.trend}
            subtitle="Database connections"
          />
        </div>
      )}

      {metricsData.sections.map((section) => (
        <div key={section.title} className="mb-12">
          <SectionHeader title={section.title} description={section.description} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.metrics.map((metric) => (
              <MetricCard key={metric.name} metric={metric} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

