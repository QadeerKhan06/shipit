'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface FundingRound {
  company: string
  amount: string
  stage: string
  date: string
}

export interface VCFundingCardProps {
  section: SectionName
  total: string
  recentRounds: FundingRound[]
}

/**
 * VCFundingCard - Display VC funding activity with recent rounds
 */
export const VCFundingCard = ({ section, total, recentRounds }: VCFundingCardProps) => (
  <BaseCard section={section} label="VC Funding Activity" variant="info">
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '2rem', color: colors.cyan, fontWeight: 'bold' }}>
        {total}
      </div>
      <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Total funding in space (2021-2024)</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {recentRounds.map((round, i) => (
        <div
          key={i}
          style={{
            padding: '0.75rem',
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{round.company}</div>
            <div style={{ fontSize: '0.75rem', color: colors.textDim }}>{round.stage} • {round.date}</div>
          </div>
          <div style={{ color: colors.green, fontSize: '1.25rem', fontWeight: 'bold' }}>{round.amount}</div>
        </div>
      ))}
    </div>
  </BaseCard>
)
