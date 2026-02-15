'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface VerdictUnitEconomicsCardProps {
  section: SectionName
}

/**
 * VerdictUnitEconomicsCard - Unit economics display with LTV/CAC
 */
export const VerdictUnitEconomicsCard = ({ section }: VerdictUnitEconomicsCardProps) => (
  <BaseCard section={section} label="Unit Economics" variant="info">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
          LTV (Lifetime Value)
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.green, fontWeight: 700 }}>
          $50
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
          Per seat/month × 12 months
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
          CAC (Customer Acquisition)
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.amber, fontWeight: 700 }}>
          $15
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
          Blended cost per acquisition
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
          LTV/CAC Ratio
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, fontWeight: 700 }}>
          3.33x
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.green, marginTop: '0.25rem' }}>
          ✓ Above 3x threshold
        </div>
      </div>
    </div>
    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: `${colors.green}20`, border: `1px solid ${colors.green}`, borderRadius: '2px' }}>
      <p style={{ fontSize: '0.875rem', color: colors.textPrimary, margin: 0 }}>
        <span style={{ color: colors.green, fontWeight: 700 }}>Strong unit economics:</span> The 3.33x ratio exceeds the standard 3x benchmark for sustainable SaaS businesses. At scale, this translates to healthy margins and efficient growth.
      </p>
    </div>
  </BaseCard>
)
