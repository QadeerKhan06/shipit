'use client'

import type { SectionName } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

interface CityData {
  city: string
  count: number
}

export interface WorkforceCapacityChartProps {
  section: SectionName
  data: CityData[]
  subtitle?: string
}

// Analyze workforce capacity
const analyzeWorkforce = (data: CityData[]): string => {
  const totalStudents = data.reduce((sum, c) => sum + c.count, 0)
  const topCity = data.reduce((max, c) => c.count > max.count ? c : max, data[0])

  if (totalStudents > 500000) {
    return `${(totalStudents / 1000).toFixed(0)}K+ potential workforce across ${data.length} cities — strong labor supply`
  }
  return `${topCity.city} leads with ${(topCity.count / 1000).toFixed(0)}K workers — consider as launch market`
}

/**
 * WorkforceCapacityChart - Bar chart showing workforce capacity by city
 */
export const WorkforceCapacityChart = ({ section, data, subtitle }: WorkforceCapacityChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const insight = analyzeWorkforce(data)

  const handleMouseEnter = (city: CityData, x: number, y: number) => {
    setTooltip({
      data: {
        label: city.city,
        value: `${(city.count / 1000).toFixed(0)}K`,
        subLabel: 'Available Workforce',
        color: colors.green
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
    label="Workforce Capacity"
    variant="success"
    deepDive
    deepDiveContext={{ data }}
    insight={insight}
    deepDiveQuestion="Best city to launch first?"
  >
    <div data-chart-container style={{ padding: '1rem', width: '100%', position: 'relative' }}>
      <ChartTooltip {...tooltip} />
      {(() => {
        const maxCount = Math.max(...data.map(c => c.count))
        // Round up to a nice ceiling (nearest 50K above max)
        const ceiling = Math.ceil(maxCount / 50000) * 50000
        const yLabels = [0, 1, 2, 3, 4].map(i => {
          const val = ceiling - (i * ceiling / 4)
          return val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}K`
        })

        return (
          <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="80"
                y1={20 + i * 35}
                x2="560"
                y2={20 + i * 35}
                stroke={colors.border}
                strokeOpacity="0.3"
              />
            ))}

            {/* Y-axis labels (dynamic) */}
            {yLabels.map((label, i) => (
              <text
                key={i}
                x="30"
                y={25 + i * 35}
                fill={colors.textDim}
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
              >
                {label}
              </text>
            ))}

            {/* Bars */}
            {data.map((city, i) => {
              const barWidth = Math.min(70, 400 / data.length)
              const gap = (480 - barWidth * data.length) / (data.length + 1)
              const bx = 80 + gap + i * (barWidth + gap)
              const barHeight = Math.min((city.count / ceiling) * 140, 140)
              const by = 160 - barHeight
              // Tooltip position in SVG viewBox coords → approximate percentage
              const tooltipX = bx + barWidth / 2
              const tooltipY = Math.max(by - 10, 5)
              return (
                <g key={i}>
                  <rect
                    x={bx}
                    y={by}
                    width={barWidth}
                    height={barHeight}
                    fill={colors.green}
                    fillOpacity="0.8"
                    stroke={colors.green}
                    strokeWidth="1"
                    rx="2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                      if (container) {
                        const barRect = e.currentTarget.getBoundingClientRect()
                        const containerRect = container.getBoundingClientRect()
                        const px = barRect.left + barRect.width / 2 - containerRect.left
                        const py = barRect.top - containerRect.top
                        handleMouseEnter(city, px, py)
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  />
                  <text
                    x={bx + barWidth / 2}
                    y="175"
                    fill={colors.textSecondary}
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {city.city}
                  </text>
                  <text
                    x={bx + barWidth / 2}
                    y={Math.max(by - 5, 15)}
                    fill={colors.green}
                    fontSize="12"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {city.count >= 1000000 ? `${(city.count / 1000000).toFixed(1)}M` : `${(city.count / 1000).toFixed(0)}K`}
                  </text>
                </g>
              )
            })}
          </svg>
        )
      })()}

      {subtitle && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: `${colors.green}10`,
          border: `1px solid ${colors.green}40`,
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
