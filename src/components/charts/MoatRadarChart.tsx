'use client'

import type { SectionName, MoatAnalysis } from '@/types/simulation'

import React from 'react'
import { BaseChart, colors } from './BaseChart'

export interface MoatRadarChartProps {
  section: SectionName
  data: MoatAnalysis
}

/**
 * MoatRadarChart - Radar chart for moat/trust analysis
 */
export const MoatRadarChart = ({ section, data }: MoatRadarChartProps) => {
  const keys = Object.keys(data)
  const values = Object.values(data)

  return (
    <BaseChart
      section={section}
      label="Trust/Moat Analysis"
      variant="info"
      deepDive
      deepDiveContext={{ data }}
      deepDiveQuestion="How to strengthen my moat?"
    >
      <svg viewBox="0 0 500 500" style={{ width: '100%', height: 'auto' }}>
        {/* Radar chart */}
        <g transform="translate(250, 250)">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((r, i) => (
            <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={colors.border} strokeWidth="1" opacity="0.3" />
          ))}
          {/* Axes */}
          {keys.map((key, i) => {
            const angle = (i / keys.length) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(angle) * 120
            const y = Math.sin(angle) * 120
            return (
              <g key={i}>
                <line x1="0" y1="0" x2={x} y2={y} stroke={colors.border} strokeWidth="1" opacity="0.5" />
                <text x={x * 1.6} y={y * 1.6} textAnchor="middle" fill={colors.textSecondary} fontSize="12">
                  {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                </text>
              </g>
            )
          })}
          {/* Data polygon */}
          <polygon
            points={values.map((value, i) => {
              const angle = (i / values.length) * 2 * Math.PI - Math.PI / 2
              const x = Math.cos(angle) * value
              const y = Math.sin(angle) * value
              return `${x},${y}`
            }).join(' ')}
            fill={colors.cyan}
            fillOpacity="0.2"
            stroke={colors.cyan}
            strokeWidth="2"
          />
          {/* Data points */}
          {values.map((value, i) => {
            const angle = (i / values.length) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(angle) * value
            const y = Math.sin(angle) * value
            return <circle key={i} cx={x} cy={y} r="4" fill={colors.cyan} />
          })}
        </g>
      </svg>
    </BaseChart>
  )
}
