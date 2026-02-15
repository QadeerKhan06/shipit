'use client'

import type { SectionName } from '@/types/simulation'

import React, { useState } from 'react'
import { BaseChart, colors } from './BaseChart'
import { ChartTooltip, type TooltipData } from '@/components/ui/ChartTooltip'

interface Competitor {
  name: string
  x: number
  y: number
  funding?: string
}

export interface CompetitorMapChartProps {
  section: SectionName
  label: string
  competitors: Competitor[]
}

// Analyze competitive landscape
const analyzeCompetition = (competitors: Competitor[]): string => {
  const totalFunding = competitors
    .filter(c => c.name !== 'YOU' && c.funding)
    .map(c => {
      const match = c.funding?.match(/\$(\d+)M/)
      return match ? parseInt(match[1]) : 0
    })
    .reduce((a, b) => a + b, 0)

  const competitorCount = competitors.filter(c => c.name !== 'YOU').length

  if (totalFunding > 200) {
    return `${competitorCount} competitors with $${totalFunding}M+ combined funding — expect well-resourced competition`
  } else if (competitorCount > 3) {
    return `${competitorCount} players in market — crowded space, differentiation critical`
  } else {
    return `${competitorCount} competitors identified — early market with room to establish position`
  }
}

/**
 * CompetitorMapChart - Scatter plot showing competitor positioning
 */
export const CompetitorMapChart = ({ section, label, competitors }: CompetitorMapChartProps) => {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({ data: null, x: 0, y: 0, visible: false })

  const insight = analyzeCompetition(competitors)

  const handleMouseEnter = (comp: Competitor, x: number, y: number) => {
    const isYou = comp.name === 'YOU'
    setTooltip({
      data: {
        label: comp.name,
        value: isYou ? 'Your Position' : (comp.funding && comp.funding !== '$0' ? comp.funding : 'Undisclosed'),
        subLabel: `Service: ${comp.x}% | Price: ${comp.y}%`,
        color: isYou ? colors.magenta : colors.cyan
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
    label={label}
    variant="info"
    deepDive
    deepDiveContext={{ competitors }}
    insight={insight}
    deepDiveQuestion="How should I position myself?"
  >
    <div data-chart-container style={{ width: '100%', padding: '0.5rem 0', position: 'relative' }}>
      <ChartTooltip {...tooltip} />
      <svg viewBox="0 0 700 450" style={{ width: '100%', height: '26rem' }}>
        <defs>
          <filter id="cyan-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={`grid-${i}`}>
            <line
              x1={150 + i * 83}
              y1="60"
              x2={150 + i * 83}
              y2="360"
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1="150"
              y1={60 + i * 60}
              x2="650"
              y2={60 + i * 60}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </g>
        ))}

        {/* Axes */}
        <line x1="150" y1="360" x2="650" y2="360" stroke={colors.textSecondary} strokeWidth="2"/>
        <line x1="150" y1="60" x2="150" y2="360" stroke={colors.textSecondary} strokeWidth="2"/>

        {/* Axis titles */}
        <text x="400" y="410" fill={colors.textSecondary} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
          Service Model →
        </text>
        <text x="50" y="210" fill={colors.textSecondary} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono" transform="rotate(-90, 50, 210)">
          ← Price
        </text>

        {/* X-axis labels */}
        <text x="150" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
          Group
        </text>
        <text x="400" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
          Remote 1:1
        </text>
        <text x="650" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
          In-Home
        </text>

        {/* Y-axis labels */}
        <text x="130" y="365" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
          Free
        </text>
        <text x="130" y="210" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
          Mid
        </text>
        <text x="130" y="65" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
          Premium
        </text>

        {/* Plot competitors */}
        {competitors?.map((comp, i) => {
          const cx = 150 + (comp.x / 100) * 500
          const cy = 360 - (comp.y / 100) * 300
          const isYou = comp.name === 'YOU'

          return (
            <g key={i}>
              {/* Invisible hit area for tooltip */}
              <circle
                cx={cx}
                cy={cy}
                r="20"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const container = e.currentTarget.closest('[data-chart-container]') as HTMLElement
                  if (container) {
                    const circleRect = e.currentTarget.getBoundingClientRect()
                    const containerRect = container.getBoundingClientRect()
                    const px = circleRect.left + circleRect.width / 2 - containerRect.left
                    const py = circleRect.top + circleRect.height / 2 - containerRect.top
                    handleMouseEnter(comp, px, py)
                  }
                }}
                onMouseLeave={handleMouseLeave}
              />
              {isYou ? (
                <>
                  {/* Subtle neon pink ring with pulse animation */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="none"
                    stroke={colors.magenta}
                    strokeWidth="2"
                    className="pulse-ring"
                    style={{ pointerEvents: 'none' }}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="7"
                    fill={colors.magenta}
                    opacity="0.3"
                    style={{ pointerEvents: 'none' }}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill={colors.magenta}
                    style={{ pointerEvents: 'none' }}
                  />
                  <text
                    x={cx}
                    y={cy - 20}
                    fill={colors.magenta}
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono"
                    style={{ pointerEvents: 'none' }}
                  >
                    YOU
                  </text>
                </>
              ) : (
                <>
                  <circle cx={cx} cy={cy} r="6" fill={colors.cyan} stroke={colors.cyan} strokeWidth="1" filter="url(#cyan-glow)" style={{ pointerEvents: 'none' }} />
                  <text x={cx} y={cy - 13} fill={colors.cyan} fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono" style={{ pointerEvents: 'none' }}>
                    {comp.name}
                  </text>
                  {comp.funding && (
                    <text x={cx} y={cy + 22} fill={colors.textDim} fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono" style={{ pointerEvents: 'none' }}>
                      {comp.funding}
                    </text>
                  )}
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  </BaseChart>
  )
}
