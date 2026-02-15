'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface FeaturesCardProps {
  section: SectionName
  label: string
  features: string[]
}

/**
 * FeaturesCard - Grid of feature items with checkmarks
 * Used for: Key Features
 */
export const FeaturesCard = ({ section, label, features }: FeaturesCardProps) => (
  <BaseCard section={section} label={label} variant="success">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      {features.map((feature, i) => (
        <div
          key={i}
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            padding: '0.75rem',
          }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.green, fontSize: '0.75rem' }}>✓</span>{' '}
          {feature}
        </div>
      ))}
    </div>
  </BaseCard>
)
