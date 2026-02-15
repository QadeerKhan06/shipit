'use client'

import type { SectionName, CompetitorFundingPoint } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

export interface FundingVelocityChartProps {
  section: SectionName
  data: CompetitorFundingPoint[]
}

// Color palette for competitors (cycles if more than available)
const COMPETITOR_COLORS = [colors.magenta, colors.cyan, colors.amber, colors.green, '#b392f0']

const getCompetitorColor = (index: number): string =>
  COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]

// Analyze funding trends
const analyzeFunding = (data: CompetitorFundingPoint[]): string => {
  if (data.length < 2) return ''

  const latest = data[data.length - 1]
  const totalFunding = latest.competitors.reduce((sum, c) => sum + c.value, 0)
  const leader = latest.competitors.reduce((max, c) => c.value > max.value ? c : max, latest.competitors[0])

  if (totalFunding > 400) {
    return `$${totalFunding}M+ raised by competitors — heavily funded market, compete on differentiation not capital`
  } else if (leader && leader.value > 200) {
    return `${leader.name} leads with $${leader.value}M — dominant player, find niches they underserve`
  }
  return `Total competitor funding: $${totalFunding}M — room for well-positioned newcomers`
}

/**
 * FundingVelocityChart - Multi-line chart showing competitor funding over time
 * Supports any number of dynamically-named competitors.
 */
export const FundingVelocityChart = ({ section, data }: FundingVelocityChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const insight = analyzeFunding(data)

  // Get competitor names from first data point
  const competitorNames = data.length > 0 ? data[0].competitors.map(c => c.name) : []

  // Calculate max funding across all data points for scaling
  const maxFunding = Math.max(
    ...data.flatMap(point => point.competitors.map(c => c.value)),
    1
  ) * 1.1 // 10% headroom

  const handleMouseEnter = (
    point: CompetitorFundingPoint,
    x: number,
    y: number,
    compIndex: number
  ) => {
    const comp = point.competitors[compIndex]
    if (!comp) return
    setTooltip({
      data: {
        label: `${comp.name} (${point.date})`,
        value: `$${comp.value}M`,
        subLabel: 'Total Funding',
        color: getCompetitorColor(compIndex)
      },
      x,
      y,
      visible: true
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  // Calculate x positions with padding for labels
  const chartWidth = 500
  const chartLeft = 50
  const chartRight = chartWidth - 80 // room for legend
  const xSpacing = data.length > 1 ? (chartRight - chartLeft) / (data.length - 1) : 0

  return (
  <BaseChart
    section={section}
    label="Competitor Funding Velocity"
    variant="warning"
    deepDive
    deepDiveContext={{ data }}
    insight={insight}
    deepDiveQuestion="How to compete against these?"
  >
    <div data-chart-container style={{ position: 'relative', padding: '1rem', width: '100%' }}>
      <ChartTooltip {...tooltip} />
      <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
      {data.map((point, i) => {
        const x = chartLeft + (i * xSpacing)
        const nextPoint = data[i + 1]

        return (
          <g key={i}>
            {/* Lines to next point */}
            {nextPoint && competitorNames.map((_, compIndex) => {
              const currentValue = point.competitors[compIndex]?.value ?? 0
              const nextValue = nextPoint.competitors[compIndex]?.value ?? 0
              return (
                <line
                  key={`line-${compIndex}`}
                  x1={x}
                  y1={180 - (currentValue / maxFunding * 150)}
                  x2={chartLeft + ((i + 1) * xSpacing)}
                  y2={180 - (nextValue / maxFunding * 150)}
                  stroke={getCompetitorColor(compIndex)}
                  strokeWidth="2"
                />
              )
            })}

            {/* Data points for each competitor */}
            {competitorNames.map((_, compIndex) => {
              const value = point.competitors[compIndex]?.value ?? 0
              const cy = 180 - (value / maxFunding * 150)
              return (
                <g key={`point-${compIndex}`}>
                  {/* Invisible larger hit area */}
                  <circle
                    cx={x}
                    cy={cy}
                    r="12"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                      if (container) {
                        const circleRect = e.currentTarget.getBoundingClientRect()
                        const containerRect = container.getBoundingClientRect()
                        const px = circleRect.left + circleRect.width / 2 - containerRect.left
                        const py = circleRect.top + circleRect.height / 2 - containerRect.top
                        handleMouseEnter(point, px, py, compIndex)
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  />
                  {/* Visible dot */}
                  <circle
                    cx={x}
                    cy={cy}
                    r="4"
                    fill={getCompetitorColor(compIndex)}
                    style={{ pointerEvents: 'none' }}
                  />
                </g>
              )
            })}

            {/* Date label */}
            <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">
              {point.date}
            </text>
          </g>
        )
      })}

      {/* Legend */}
      {competitorNames.map((name, i) => (
        <text key={name} x="420" y={30 + i * 20} fill={getCompetitorColor(i)} fontSize="12">
          {name}
        </text>
      ))}
    </svg>
    </div>
  </BaseChart>
  )
}
