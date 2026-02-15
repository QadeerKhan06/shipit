'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface SaturationScoreCardProps {
  section: SectionName
  score: number
  label: string
  description: string
}

/**
 * SaturationScoreCard - Display market saturation score with description
 */
export const SaturationScoreCard = ({ section, score, label, description }: SaturationScoreCardProps) => (
  <BaseCard section={section} label="Market Saturation Score" variant="warning">
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '4rem', color: colors.amber, fontWeight: 'bold' }}>
          {score}
        </div>
        <div style={{ fontSize: '1.25rem', color: colors.textPrimary, marginTop: '0.5rem' }}>
          {label}
        </div>
      </div>
      <div style={{ flex: 2 }}>
        <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
          {description}
        </p>
      </div>
    </div>
  </BaseCard>
)
