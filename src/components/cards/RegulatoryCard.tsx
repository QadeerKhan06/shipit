'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface RegulatoryItem {
  state: string
  complexity: 'Low' | 'Medium' | 'High'
  licensing: string
  notes: string
}

export interface RegulatoryCardProps {
  section: SectionName
  items: RegulatoryItem[]
}

/**
 * RegulatoryCard - Grid display of regulatory requirements by state
 */
export const RegulatoryCard = ({ section, items }: RegulatoryCardProps) => (
  <BaseCard section={section} label="Regulatory Landscape" variant="warning">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      {items.map((reg, i) => {
        const complexityColor = reg.complexity === 'High' ? colors.red : reg.complexity === 'Medium' ? colors.amber : colors.green
        return (
          <div key={i} style={{ padding: '0.75rem', backgroundColor: colors.background, border: `1px solid ${complexityColor}40` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{reg.state}</span>
              <span style={{ color: complexityColor, fontSize: '0.75rem' }}>{reg.complexity}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
              License: {reg.licensing}
            </div>
            <div style={{ fontSize: '0.7rem', color: colors.textDim }}>{reg.notes}</div>
          </div>
        )
      })}
    </div>
  </BaseCard>
)
