'use client'

import type { SectionName } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

interface HypeDataPoint {
  year: string
  hype: number
  reality: number
}

export interface HypeRealityChartProps {
  section: SectionName
  data: HypeDataPoint[]
}

// Analyze hype vs reality gap
const analyzeGap = (data: HypeDataPoint[]): string => {
  if (data.length === 0) return ''

  const latest = data[data.length - 1]
  const gap = latest.hype - latest.reality

  if (gap > 20) {
    return `Hype exceeds reality by ${gap}pts — market expectations may be inflated, proceed with caution`
  } else if (gap > 10) {
    return `Moderate hype-reality gap (${gap}pts) — market is maturing but still some froth`
  } else if (gap < 5) {
    return `Hype and reality converging (${gap}pt gap) — market entering maturity phase, execution matters more than buzz`
  }
  return `Current gap: ${gap}pts between market expectations and actual adoption`
}

/**
 * HypeRealityChart - Dual line chart comparing hype vs reality metrics
 */
export const HypeRealityChart = ({ section, data }: HypeRealityChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const insight = analyzeGap(data)

  const handleMouseEnter = (point: HypeDataPoint, x: number, y: number, type: 'hype' | 'reality') => {
    setTooltip({
      data: {
        label: point.year,
        value: type === 'hype' ? point.hype : point.reality,
        subLabel: type === 'hype' ? 'Search Interest (Google Trends)' : 'Market Adoption Est.',
        color: type === 'hype' ? colors.magenta : colors.cyan
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
    label="Hype vs Reality Check"
    variant="info"
    deepDive
    deepDiveContext={{ data }}
    insight={insight}
    deepDiveQuestion="Is this market overhyped?"
  >
    <div data-chart-container style={{ position: 'relative', padding: '1rem', width: '100%' }}>
      <ChartTooltip {...tooltip} />
      <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
      {data.map((point, i) => {
        const spacing = data.length > 1 ? 400 / (data.length - 1) : 0
        const x = 50 + (i * spacing)
        const hypeY = 180 - (point.hype / 100 * 150)
        const realityY = 180 - (point.reality / 100 * 150)
        const nextPoint = data[i + 1]

        return (
          <g key={i}>
            {nextPoint && (
              <>
                <line
                  x1={x}
                  y1={hypeY}
                  x2={50 + ((i + 1) * spacing)}
                  y2={180 - (nextPoint.hype / 100 * 150)}
                  stroke={colors.magenta}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1={x}
                  y1={realityY}
                  x2={50 + ((i + 1) * spacing)}
                  y2={180 - (nextPoint.reality / 100 * 150)}
                  stroke={colors.cyan}
                  strokeWidth="2"
                />
              </>
            )}
            {/* Hype point */}
            <circle
              cx={x}
              cy={hypeY}
              r="15"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                if (container) {
                  const circleRect = e.currentTarget.getBoundingClientRect()
                  const containerRect = container.getBoundingClientRect()
                  const px = circleRect.left + circleRect.width / 2 - containerRect.left
                  const py = circleRect.top + circleRect.height / 2 - containerRect.top
                  handleMouseEnter(point, px, py, 'hype')
                }
              }}
              onMouseLeave={handleMouseLeave}
            />
            <circle cx={x} cy={hypeY} r="4" fill={colors.magenta} style={{ pointerEvents: 'none' }} />

            {/* Reality point */}
            <circle
              cx={x}
              cy={realityY}
              r="15"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                if (container) {
                  const circleRect = e.currentTarget.getBoundingClientRect()
                  const containerRect = container.getBoundingClientRect()
                  const px = circleRect.left + circleRect.width / 2 - containerRect.left
                  const py = circleRect.top + circleRect.height / 2 - containerRect.top
                  handleMouseEnter(point, px, py, 'reality')
                }
              }}
              onMouseLeave={handleMouseLeave}
            />
            <circle cx={x} cy={realityY} r="4" fill={colors.cyan} style={{ pointerEvents: 'none' }} />

            <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">{point.year}</text>
          </g>
        )
      })}
      <text x="20" y="30" fill={colors.magenta} fontSize="11">- - Search Interest</text>
      <text x="20" y="50" fill={colors.cyan} fontSize="11">— Adoption</text>
    </svg>
    </div>
  </BaseChart>
  )
}
