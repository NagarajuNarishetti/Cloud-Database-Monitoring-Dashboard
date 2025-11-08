import type { Metric } from './types'
import type { TimeRange, AggregateType } from '@/app/components/ChartControls'

export function getTimeRangeInMinutes(range: TimeRange): number {
  const rangeMap: Record<TimeRange, number> = {
    '5m': 5,
    '10m': 10,
    '15m': 15,
    '1h': 60,
    '6h': 360,
    '1d': 1440,
    '7d': 10080,
    '30d': 43200,
  }
  return rangeMap[range]
}

export function filterMetricByTimeRange(
  metric: Metric,
  timeRange: TimeRange
): { timestamps: string[]; values: number[] } {
  const now = new Date()
  const minutesAgo = getTimeRangeInMinutes(timeRange)
  const cutoffTime = new Date(now.getTime() - minutesAgo * 60 * 1000)

  const filtered: { timestamps: string[]; values: number[] } = {
    timestamps: [],
    values: [],
  }

  for (let i = 0; i < metric.timestamps.length; i++) {
    const timestamp = new Date(metric.timestamps[i])
    if (timestamp >= cutoffTime) {
      filtered.timestamps.push(metric.timestamps[i])
      filtered.values.push(metric.values[i])
    }
  }

  // If no data in range, return all data
  if (filtered.timestamps.length === 0) {
    return {
      timestamps: metric.timestamps,
      values: metric.values,
    }
  }

  return filtered
}

export function aggregateMetricValues(
  values: number[],
  aggregate: AggregateType
): number[] {
  if (aggregate === 'none' || values.length === 0) {
    return values
  }

  // For aggregation, we'll group values into buckets
  // This is a simplified version - in production, you'd want more sophisticated aggregation
  const bucketSize = Math.max(1, Math.floor(values.length / 20)) // Max 20 points
  const aggregated: number[] = []

  for (let i = 0; i < values.length; i += bucketSize) {
    const bucket = values.slice(i, i + bucketSize)
    let aggregatedValue: number

    switch (aggregate) {
      case 'average':
        aggregatedValue = bucket.reduce((sum, val) => sum + val, 0) / bucket.length
        break
      case 'sum':
        aggregatedValue = bucket.reduce((sum, val) => sum + val, 0)
        break
      case 'min':
        aggregatedValue = Math.min(...bucket)
        break
      case 'max':
        aggregatedValue = Math.max(...bucket)
        break
      default:
        aggregatedValue = bucket[0]
    }

    aggregated.push(aggregatedValue)
  }

  return aggregated.length > 0 ? aggregated : values
}

export function processMetric(
  metric: Metric,
  timeRange: TimeRange,
  aggregate: AggregateType
): Metric {
  const filtered = filterMetricByTimeRange(metric, timeRange)
  const aggregatedValues = aggregateMetricValues(filtered.values, aggregate)

  // Adjust timestamps to match aggregated values
  let aggregatedTimestamps = filtered.timestamps
  if (aggregate !== 'none' && aggregatedValues.length < filtered.timestamps.length) {
    const bucketSize = Math.max(1, Math.floor(filtered.timestamps.length / aggregatedValues.length))
    aggregatedTimestamps = []
    for (let i = 0; i < filtered.timestamps.length; i += bucketSize) {
      aggregatedTimestamps.push(filtered.timestamps[i])
    }
  }

  return {
    ...metric,
    timestamps: aggregatedTimestamps,
    values: aggregatedValues,
  }
}

