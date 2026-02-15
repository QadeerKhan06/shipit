'use client'

import type { SectionName } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

interface GapDataPoint {
  year: string
  demand: number
  supply: number
}

export interface OpportunityGapChartProps {
  section: SectionName
  data: GapDataPoint[]
}

// Analyze the opportunity gap
const analyzeGap = (data: GapDataPoint[]): string => {
  if (data.length < 2) return ''
  const latest = data[data.length - 1]
  const gap = latest.demand - latest.supply
  if (gap > 30) {
    return `${gap}pt gap between problem and supply — significant unmet market need`
  } else if (gap > 15) {
    return `${gap}pt gap — moderate opportunity, market partially addressed`
  }
  return `${gap}pt gap — market is being served, differentiation needed`
}

/**
 * OpportunityGapChart - Area chart showing gap between two metrics
 */
export const OpportunityGapChart = ({ section, data }: OpportunityGapChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const insight = analyzeGap(data)

  const handleMouseEnter = (point: GapDataPoint, x: number, y: number, type: 'demand' | 'supply') => {
    setTooltip({
      data: {
        label: point.year,
        value: type === 'demand' ? point.demand : point.supply,
        subLabel: type === 'demand' ? 'Demand Index' : 'Supply Index',
        color: type === 'demand' ? colors.red : colors.green
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
    label="Market Opportunity Gap"
    variant="warning"
    deepDive
    deepDiveContext={{ data }}
    insight={insight}
    deepDiveQuestion="How to capture this gap?"
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

        {/* Area fill (gap between lines) */}
        <path
          d={
            // Top line (demand)
            data.map((point, i) => {
              const x = 80 + (i * 480 / (data.length - 1 || 1))
              const y = 160 - (point.demand * 1.4)
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ') +
            // Bottom line (supply) - reversed for area fill
            data.slice().reverse().map((point, i) => {
              const x = 560 - (i * 480 / (data.length - 1 || 1))
              const y = 160 - (point.supply * 1.4)
              return `L ${x} ${y}`
            }).join(' ') +
            ' Z'
          }
          fill={colors.amber}
          fillOpacity="0.3"
          stroke="none"
        />

        {/* Loneliness line */}
        <path
          d={data.map((point, i) => {
            const x = 80 + (i * 480 / (data.length - 1 || 1))
            const y = 160 - (point.demand * 1.4)
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          fill="none"
          stroke={colors.red}
          strokeWidth="3"
        />

        {/* Solutions line */}
        <path
          d={data.map((point, i) => {
            const x = 80 + (i * 480 / (data.length - 1 || 1))
            const y = 160 - (point.supply * 1.4)
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          fill="none"
          stroke={colors.green}
          strokeWidth="3"
        />

        {/* Interactive data points */}
        {data.map((point, i) => {
          const x = 80 + (i * 480 / (data.length - 1 || 1))
          const demandY = 160 - (point.demand * 1.4)
          const supplyY = 160 - (point.supply * 1.4)
          return (
            <g key={i}>
              {/* Loneliness point */}
              <circle
                cx={x}
                cy={demandY}
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
                    handleMouseEnter(point, px, py, 'demand')
                  }
                }}
                onMouseLeave={handleMouseLeave}
              />
              <circle cx={x} cy={demandY} r="4" fill={colors.red} style={{ pointerEvents: 'none' }} />

              {/* Solutions point */}
              <circle
                cx={x}
                cy={supplyY}
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
                    handleMouseEnter(point, px, py, 'supply')
                  }
                }}
                onMouseLeave={handleMouseLeave}
              />
              <circle cx={x} cy={supplyY} r="4" fill={colors.green} style={{ pointerEvents: 'none' }} />

              {/* X-axis label */}
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
      </svg>

      <div style={{
        marginTop: '0.5rem',
        padding: '0.5rem',
        backgroundColor: `${colors.amber}10`,
        border: `1px solid ${colors.amber}40`,
        borderRadius: '2px',
        display: 'flex',
        gap: '0.75rem',
        fontSize: '0.7rem',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '12px', height: '2px', backgroundColor: colors.red }} />
          <span style={{ color: colors.textSecondary }}>Demand</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '12px', height: '2px', backgroundColor: colors.green }} />
          <span style={{ color: colors.textSecondary }}>Supply</span>
        </div>
      </div>
    </div>
  </BaseChart>
  )
}
