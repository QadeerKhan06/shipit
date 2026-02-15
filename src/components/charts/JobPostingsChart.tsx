'use client'

import type { SectionName } from '@/types/simulation'

import React from 'react'
import { BaseChart, colors } from './BaseChart'

interface PostingsDataPoint {
  year: string
  postings: number
}

export interface JobPostingsChartProps {
  section: SectionName
  data: PostingsDataPoint[]
  currentPostings: number
}

// Calculate insight from data
const getInsight = (data: PostingsDataPoint[], currentPostings: number): string => {
  if (data.length < 2) return `${currentPostings.toLocaleString()} active job postings in this space`

  const first = data[0]
  const last = data[data.length - 1]
  const growthPct = Math.round(((last.postings - first.postings) / first.postings) * 100)

  if (growthPct > 20) {
    return `Hiring up ${growthPct}% since ${first.year} — companies are investing heavily in this space`
  } else if (growthPct > 0) {
    return `Hiring grew ${growthPct}% since ${first.year} — steady but not explosive growth`
  } else if (growthPct === 0) {
    return `Hiring flat since ${first.year} — market may be maturing`
  } else {
    return `Hiring down ${Math.abs(growthPct)}% since ${first.year} — industry may be contracting`
  }
}

/**
 * JobPostingsChart - Bar chart showing job postings trend over time
 */
export const JobPostingsChart = ({ section, data, currentPostings }: JobPostingsChartProps) => {
  // Use latest trend value if available, fall back to currentPostings prop
  const displayPostings = data.length > 0 ? data[data.length - 1].postings : currentPostings
  const insight = getInsight(data, displayPostings)

  return (
    <BaseChart
      section={section}
      label="Job Postings Trend"
      variant="success"
      insight={insight}
      deepDive
      deepDiveContext={{ data, currentPostings: displayPostings }}
      deepDiveQuestion="What do hiring trends reveal?"
    >
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: colors.green, fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace' }}>
            {displayPostings.toLocaleString()} current postings
          </div>
        </div>
        <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
          <defs>
            <linearGradient id="jobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: colors.green, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: colors.green, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {(() => {
            const maxPostings = Math.max(...data.map(p => p.postings), 1)
            const spacing = data.length > 1 ? 400 / (data.length - 1) : 0
            return data.map((point, i) => {
              const x = 50 + (i * spacing)
              const barHeight = (point.postings / maxPostings) * 140
              const y = 175 - barHeight
              return (
                <g key={i}>
                  <rect x={x - 15} y={y} width="30" height={barHeight} fill="url(#jobGradient)" stroke={colors.green} strokeWidth="1" rx="2" />
                  <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">{point.year}</text>
                  <text x={x} y={y - 5} textAnchor="middle" fill={colors.green} fontSize="12" fontWeight="bold">{point.postings.toLocaleString()}</text>
                </g>
              )
            })
          })()}
        </svg>
      </div>
    </BaseChart>
  )
}
