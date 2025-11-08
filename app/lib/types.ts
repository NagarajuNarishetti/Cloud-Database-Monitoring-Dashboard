export interface MetricDataPoint {
  timestamp: string
  value: number
}

export interface Metric {
  name: string
  description: string
  unit: string
  category: string
  priority: 'high' | 'medium' | 'low'
  timestamps: string[]
  values: number[]
}

export interface MetricSection {
  title: string
  description?: string
  metrics: Metric[]
}

export interface MetricsData {
  sections: MetricSection[]
  lastUpdated: string
}

