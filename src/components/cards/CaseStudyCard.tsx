'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface TimelineMilestone {
  date: string
  event: string
}

interface CaseStudy {
  name: string
  years: string
  outcome: 'succeeded' | 'failed' | 'pivoted' | 'acquired'
  timeline: TimelineMilestone[]
  lesson: string
}

export interface CaseStudyCardProps {
  section: SectionName
  study: CaseStudy
}

/**
 * CaseStudyCard - Display a case study with timeline and lesson
 */
export const CaseStudyCard = ({ section, study }: CaseStudyCardProps) => {
  const variant = study.outcome === 'succeeded' || study.outcome === 'acquired' ? 'success' : study.outcome === 'failed' ? 'error' : 'warning'
  const outcomeColor = study.outcome === 'succeeded' || study.outcome === 'acquired' ? colors.green : study.outcome === 'failed' ? colors.red : colors.amber

  return (
    <BaseCard
      section={section}
      label={`Case Study: ${study.name}`}
      variant={variant}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.125rem', color: colors.textPrimary }}>
            {study.name}
          </h3>
          <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{study.years}</p>
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.875rem',
          padding: '0.25rem 0.75rem',
          backgroundColor: `${outcomeColor}33`,
          color: outcomeColor
        }}>
          {study.outcome === 'succeeded' ? '✓ Succeeded' : study.outcome === 'acquired' ? '✓ Acquired' : study.outcome === 'failed' ? '✗ Failed' : '↻ Pivoted'}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <div style={{ position: 'absolute', top: '12px', left: 0, width: '100%', height: '2px', backgroundColor: colors.border }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          {study.timeline.map((milestone, j) => {
            const isFirst = j === 0
            const isLast = j === study.timeline.length - 1
            const dotColor = isFirst ? colors.green : isLast && study.outcome === 'failed' ? colors.red : isLast ? colors.green : colors.amber

            return (
              <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: dotColor,
                  backgroundColor: dotColor
                }} />
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.5rem' }}>
                  {milestone.date}
                </p>
                <p style={{ fontSize: '0.75rem', color: colors.textPrimary, marginTop: '0.25rem', maxWidth: '100px', textAlign: 'center' }}>
                  {milestone.event}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ borderLeft: `2px solid ${study.outcome === 'succeeded' || study.outcome === 'acquired' ? colors.green : colors.amber}`, paddingLeft: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: colors.textPrimary }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary }}>LESSON: </span>
          {study.lesson}
        </p>
      </div>
    </BaseCard>
  )
}
