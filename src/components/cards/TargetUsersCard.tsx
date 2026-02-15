'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface UserPersona {
  name: string
  description: string
  pains: string[]
  gains: string[]
}

export interface TargetUsersCardProps {
  section: SectionName
  primary: UserPersona
  secondary: UserPersona
}

/**
 * TargetUsersCard - Two-column display of primary and secondary user personas
 */
export const TargetUsersCard = ({ section, primary, secondary }: TargetUsersCardProps) => (
  <BaseCard section={section} label="Target Users" variant="info">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {/* Primary User */}
      <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.cyan, marginBottom: '0.5rem' }}>
          PRIMARY: {primary.name}
        </div>
        <p style={{ color: colors.textSecondary, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          {primary.description}
        </p>
        <div style={{ fontSize: '0.75rem' }}>
          <div style={{ color: colors.red, marginBottom: '0.25rem' }}>Pains:</div>
          {primary.pains.map((pain, i) => (
            <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {pain}</div>
          ))}
          <div style={{ color: colors.green, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Gains:</div>
          {primary.gains.map((gain, i) => (
            <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {gain}</div>
          ))}
        </div>
      </div>
      {/* Secondary User */}
      <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.magenta, marginBottom: '0.5rem' }}>
          SECONDARY: {secondary.name}
        </div>
        <p style={{ color: colors.textSecondary, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          {secondary.description}
        </p>
        <div style={{ fontSize: '0.75rem' }}>
          <div style={{ color: colors.red, marginBottom: '0.25rem' }}>Pains:</div>
          {secondary.pains.map((pain, i) => (
            <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {pain}</div>
          ))}
          <div style={{ color: colors.green, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Gains:</div>
          {secondary.gains.map((gain, i) => (
            <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {gain}</div>
          ))}
        </div>
      </div>
    </div>
  </BaseCard>
)
