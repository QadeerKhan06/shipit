'use client'

import type { SectionName } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

interface DataPoint {
  year: string
  value: number
}

export interface DemandTrendChartProps {
  section: SectionName
  data: DataPoint[]
  subtitle?: string
}

// Calculate trend percentage from data
const calculateTrend = (data: DataPoint[]): string => {
  if (data.length < 2) return ''
  const first = data[0].value
  const last = data[data.length - 1].value
  const change = ((last - first) / first) * 100
  const direction = change >= 0 ? '↑' : '↓'
  return `${direction} ${Math.abs(change).toFixed(0)}% since ${data[0].year}`
}

/**
 * DemandTrendChart - Line chart showing trend over time
 */
export const DemandTrendChart = ({ section, data, subtitle }: DemandTrendChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const trendText = calculateTrend(data)
  const insight = trendText
    ? `Search interest ${trendText} — indicates ${data[data.length - 1].value > 70 ? 'strong and growing' : 'moderate'} market demand`
    : undefined

  const handleMouseEnter = (point: DataPoint, x: number, y: number) => {
    setTooltip({
      data: {
        label: point.year,
        value: point.value,
        subLabel: 'Search Interest Index',
        color: colors.cyan
      },
      x,
      y,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  return (
  <BaseChart
    section={section}
    label="Demand Trend"
    variant="info"
    deepDive
    deepDiveContext={{ data, trendPercentage: trendText }}
    insight={insight}
    deepDiveQuestion="What's driving this trend?"
  >
    <div data-chart-container style={{ padding: '1rem', width: '100%', position: 'relative' }}>
      <ChartTooltip {...tooltip} />
      <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="60"
            y1={20 + i * 35}
            x2="560"
            y2={20 + i * 35}
            stroke={colors.border}
            strokeOpacity="0.3"
          />
        ))}

        {/* Y-axis labels */}
        {['100', '75', '50', '25', '0'].map((label, i) => (
          <text
            key={i}
            x="20"
            y={25 + i * 35}
            fill={colors.textDim}
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
          >
            {label}
          </text>
        ))}

        {/* Line path */}
        <path
          d={data.map((point, i) => {
            const x = 80 + (i * 480 / (data.length - 1 || 1))
            const y = 160 - (point.value * 1.4)
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          fill="none"
          stroke={colors.cyan}
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Data points */}
        {data.map((point, i) => {
          const x = 80 + (i * 480 / (data.length - 1 || 1))
          const y = 160 - (point.value * 1.4)
          // Calculate pixel position for tooltip (accounting for SVG viewBox scaling)
          const tooltipX = (x / 600) * 100 // Convert to percentage
          const tooltipY = (y / 200) * 100
          return (
            <g key={i}>
              {/* Invisible larger hit area for easier hover */}
              <circle
                cx={x}
                cy={y}
                r="15"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                  if (container) {
                    // Get actual rendered position of the circle element
                    const circleRect = e.currentTarget.getBoundingClientRect()
                    const containerRect = container.getBoundingClientRect()
                    const px = circleRect.left + circleRect.width / 2 - containerRect.left
                    const py = circleRect.top + circleRect.height / 2 - containerRect.top
                    handleMouseEnter(point, px, py)
                  }
                }}
                onMouseLeave={handleMouseLeave}
              />
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={colors.cyan}
                stroke={colors.background}
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
              <text
                x={x}
                y="190"
                fill={colors.textSecondary}
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {point.year.slice(2)}
              </text>
            </g>
          )
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {subtitle && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: `${colors.cyan}10`,
          border: `1px solid ${colors.cyan}40`,
          borderRadius: '2px'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: colors.textSecondary,
            margin: 0,
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  </BaseChart>
  )
}
