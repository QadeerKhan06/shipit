'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface CaseScenario {
  scenario: string
  outcome: string
  probability: string
}

export interface BullBearCardProps {
  section: SectionName
  bull: CaseScenario
  bear: CaseScenario
}

// Map outcomes to founder-life descriptions
const getFounderLifeTitle = (isGood: boolean): { title: string; subtitle: string } => {
  if (isGood) {
    return {
      title: 'The Market Leader',
      subtitle: 'You define the category'
    }
  }
  return {
    title: 'The Commodity Trap',
    subtitle: 'Racing to the bottom'
  }
}

/**
 * BullBearCard - Side-by-side best vs worst case with founder-focused language
 */
export const BullBearCard = ({ section, bull, bear }: BullBearCardProps) => {
  const bullLife = getFounderLifeTitle(true)
  const bearLife = getFounderLifeTitle(false)

  return (
    <BaseCard section={section} label="Your Two Futures" variant="warning">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Bull Case - Best outcome */}
        <div style={{
          padding: '1rem',
          backgroundColor: `${colors.green}08`,
          border: `1px solid ${colors.green}30`,
          borderRadius: '4px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1rem',
              color: colors.green,
              fontWeight: 'bold'
            }}>
              {bullLife.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textDim }}>
              {bullLife.subtitle}
            </div>
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: colors.textPrimary,
            marginBottom: '1rem',
            lineHeight: 1.6
          }}>
            {bull.scenario}
          </p>

          <div style={{
            padding: '0.75rem',
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '2px'
          }}>
            <div style={{ fontSize: '0.7rem', color: colors.textDim, marginBottom: '0.25rem' }}>
              WHAT THIS MEANS FOR YOU
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
              {bull.outcome}
            </div>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.5rem',
              backgroundColor: `${colors.green}20`,
              borderRadius: '2px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: colors.green
            }}>
              {bull.probability} chance
            </div>
          </div>
        </div>

        {/* Bear Case - Worst outcome */}
        <div style={{
          padding: '1rem',
          backgroundColor: `${colors.red}08`,
          border: `1px solid ${colors.red}30`,
          borderRadius: '4px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1rem',
              color: colors.red,
              fontWeight: 'bold'
            }}>
              {bearLife.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textDim }}>
              {bearLife.subtitle}
            </div>
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: colors.textPrimary,
            marginBottom: '1rem',
            lineHeight: 1.6
          }}>
            {bear.scenario}
          </p>

          <div style={{
            padding: '0.75rem',
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '2px'
          }}>
            <div style={{ fontSize: '0.7rem', color: colors.textDim, marginBottom: '0.25rem' }}>
              WHAT THIS MEANS FOR YOU
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
              {bear.outcome}
            </div>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.5rem',
              backgroundColor: `${colors.red}20`,
              borderRadius: '2px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: colors.red
            }}>
              {bear.probability} chance
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
