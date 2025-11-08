import { NextResponse } from 'next/server'
import metricsData from '@/app/data/metrics.json'
import type { MetricsData } from '@/app/lib/types'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const data: MetricsData = {
      ...metricsData,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}

