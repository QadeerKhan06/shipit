'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName, FeatureMatrix } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface FeatureMatrixCardProps {
  section: SectionName
  matrix: FeatureMatrix
}

// Calculate feature coverage
const analyzeFeatures = (matrix: FeatureMatrix): string => {
  const you = matrix.competitors.find(c => c.name === 'You')
  const leader = matrix.competitors.find(c => c.name !== 'You')

  if (!you) return ''

  const yourFeatures = you.values.filter(Boolean).length
  const totalFeatures = matrix.features.length

  if (leader) {
    const leaderFeatures = leader.values.filter(Boolean).length
    const uniqueAdvantages = matrix.features.filter((_, i) =>
      you.values[i] && !leader.values[i]
    ).length

    if (uniqueAdvantages > 0) {
      return `You have ${uniqueAdvantages} feature${uniqueAdvantages > 1 ? 's' : ''} competitors lack — potential differentiation opportunity`
    } else if (yourFeatures >= leaderFeatures) {
      return `Feature parity with market leader (${yourFeatures}/${totalFeatures}) — compete on execution and price`
    }
  }

  return `${yourFeatures}/${totalFeatures} features covered — consider prioritizing gaps`
}

export const FeatureMatrixCard = ({ section, matrix }: FeatureMatrixCardProps) => {
  const insight = analyzeFeatures(matrix)

  return (
    <BaseCard
      section={section}
      label="Feature Comparison Matrix"
      variant="info"
      insight={insight}
    >
      <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: colors.textDim }}>Feature</th>
            {matrix.competitors.map((comp) => (
              <th key={comp.name} style={{
                textAlign: 'center',
                padding: '0.5rem',
                color: comp.name === 'You' ? colors.cyan : colors.textSecondary
              }}>
                {comp.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.features.map((feature, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${colors.border}20` }}>
              <td style={{ padding: '0.5rem', color: colors.textPrimary }}>{feature}</td>
              {matrix.competitors.map((comp) => (
                <td key={comp.name} style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  color: comp.values[i] ? colors.green : colors.textDim
                }}>
                  {comp.values[i] ? '✓' : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </BaseCard>
  )
}
