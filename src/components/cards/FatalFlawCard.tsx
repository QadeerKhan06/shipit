'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface FatalFlawCardProps {
  section: SectionName
  title: string
  description: string
  example: string
}

/**
 * FatalFlawCard - Display a fatal flaw analysis with example
 */
export const FatalFlawCard = ({ section, title, description, example }: FatalFlawCardProps) => (
  <BaseCard section={section} label="Fatal Flaw Analysis" variant="error">
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1.125rem', color: colors.red, marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: colors.textPrimary, fontSize: '0.875rem', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
    <div style={{ padding: '1rem', backgroundColor: `${colors.red}10`, border: `1px solid ${colors.red}40`, borderRadius: '2px' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.red, marginBottom: '0.5rem' }}>
        EXAMPLE:
      </div>
      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, margin: 0 }}>
        {example}
      </p>
    </div>
  </BaseCard>
)
