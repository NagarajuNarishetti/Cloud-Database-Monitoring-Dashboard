'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useTheme } from 'next-themes'
import ReactECharts from 'echarts-for-react'
import type { Metric } from '@/app/lib/types'
import type { EChartsOption } from 'echarts'

interface ChartProps {
  metric: Metric
}

export default function Chart({ metric }: ChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const isDark = mounted && theme === 'dark'
  const textColor = isDark ? '#9CA3AF' : '#6B7280'
  const splitLineColor = isDark ? '#374151' : '#E5E7EB'
  const tooltipBg = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)'
  const backgroundColor = isDark ? 'transparent' : 'transparent'

  // Memoize the ECharts option for better performance
  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: tooltipBg,
          },
        },
        backgroundColor: tooltipBg,
        borderColor: '#4A90E2',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        formatter: (params: any) => {
          if (Array.isArray(params)) {
            const param = params[0]
            const dataIndex = param.dataIndex
            const dateStr =
              dataIndex >= 0 && dataIndex < metric.timestamps.length
                ? new Date(metric.timestamps[dataIndex]).toLocaleString()
                : param.axisValue
            return `${dateStr}<br/>${param.marker}${param.seriesName}: ${formatValue(param.value, metric.unit)}`
          }
          return ''
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: metric.timestamps.map((ts) => {
          const date = new Date(ts)
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }),
        axisLine: {
          lineStyle: {
            color: textColor,
            width: 1,
          },
        },
        axisLabel: {
          color: textColor,
          fontSize: 11,
          rotate: 0,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (value: number) => formatValue(value, metric.unit),
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
            type: 'dashed',
            width: 1,
          },
        },
      },
      series: [
        {
          name: metric.name,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          data: metric.values,
          lineStyle: {
            color: '#4A90E2',
            width: 2,
          },
          itemStyle: {
            color: '#4A90E2',
            borderWidth: 1,
            borderColor: '#fff',
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: '#4A90E2',
              borderWidth: 2,
              borderColor: '#fff',
              shadowBlur: 10,
              shadowColor: 'rgba(74, 144, 226, 0.5)',
            },
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(74, 144, 226, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(74, 144, 226, 0.05)',
                },
              ],
            },
          },
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
        },
      ],
    }),
    [metric, isDark, textColor, splitLineColor, tooltipBg, backgroundColor]
  )

  return (
    <div className="w-full h-full" role="img" aria-label={`Chart showing ${metric.name} over time`}>
      <ReactECharts
        option={option}
        style={{ height: '250px', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={false}
        theme={isDark ? 'dark' : undefined}
      />
    </div>
  )
}

