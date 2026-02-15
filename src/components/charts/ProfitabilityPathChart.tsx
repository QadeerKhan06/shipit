'use client'

import type { SectionName } from '@/types/simulation'

import React from 'react'
import { BaseChart, colors } from './BaseChart'

interface ProfitabilityDataPoint {
  milestone: string
  mrr: number
}

export interface ProfitabilityPathChartProps {
  section: SectionName
  data: ProfitabilityDataPoint[]
}

/**
 * ProfitabilityPathChart - Line chart showing path to profitability
 */
export const ProfitabilityPathChart = ({ section, data }: ProfitabilityPathChartProps) => (
  <BaseChart
    section={section}
    label="Path to Profitability"
    variant="success"
    deepDive
    deepDiveContext={{ data }}
    deepDiveQuestion="Is this timeline realistic?"
  >
    <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
      {data.map((point, i) => {
        const x = 50 + (i * 90)
        const nextPoint = data[i + 1]
        const maxMRR = 300000
        const mrrY = 180 - (point.mrr / maxMRR * 150)

        return (
          <g key={i}>
            {nextPoint && (
              <line
                x1={x}
                y1={mrrY}
                x2={50 + ((i + 1) * 90)}
                y2={180 - (nextPoint.mrr / maxMRR * 150)}
                stroke={colors.green}
                strokeWidth="2"
              />
            )}
            <circle cx={x} cy={mrrY} r="4" fill={colors.green} />
            <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="10">
              {point.milestone}
            </text>
            <text x={x} y={mrrY - 10} textAnchor="middle" fill={colors.green} fontSize="10">
              ${(point.mrr / 1000).toFixed(0)}K
            </text>
          </g>
        )
      })}
      <line x1="50" y1="120" x2="450" y2="120" stroke={colors.amber} strokeWidth="1" strokeDasharray="5,5" />
      <text x="455" y="125" fill={colors.amber} fontSize="10">Break Even</text>
    </svg>
  </BaseChart>
)
