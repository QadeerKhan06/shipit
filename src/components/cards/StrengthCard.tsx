'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface StrengthCardProps {
  section: SectionName
  title: string
  description: string
  source: string
}

/**
 * StrengthCard - Display a strength item with source
 */
export const StrengthCard = ({ section, title, description, source }: StrengthCardProps) => (
  <BaseCard section={section} label={title} variant="success">
    <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
      {description}
    </p>
    <p style={{ fontSize: '0.75rem', color: colors.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
      Source: {source}
    </p>
  </BaseCard>
)
