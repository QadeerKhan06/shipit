'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface RiskItemCardProps {
  section: SectionName
  title: string
  description: string
  source: string
}

/**
 * RiskItemCard - Display a risk item with source
 */
export const RiskItemCard = ({ section, title, description, source }: RiskItemCardProps) => (
  <BaseCard section={section} label={title} variant="warning">
    <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
      {description}
    </p>
    <p style={{ fontSize: '0.75rem', color: colors.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
      Source: {source}
    </p>
  </BaseCard>
)
