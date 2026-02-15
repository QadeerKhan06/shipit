'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface GapRiskCardProps {
  section: SectionName
  label: string
  variant: 'success' | 'warning'
  text: string
}

/**
 * GapRiskCard - Simple text card for gap/risk display
 */
export const GapRiskCard = ({ section, label, variant, text }: GapRiskCardProps) => (
  <BaseCard section={section} label={label} variant={variant}>
    <p style={{ fontSize: '0.875rem', color: colors.textPrimary }}>
      {text}
    </p>
  </BaseCard>
)
