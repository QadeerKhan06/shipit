'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { useSimulation } from '@/contexts/SimulationContext'

// Strategic pivot suggestions based on weakest metric
const getPivotSuggestion = (weakestMetric?: { name: string; score: number }): string | null => {
  if (!weakestMetric || weakestMetric.score >= 50) return null

  const pivots: Record<string, string> = {
    'Customer Stickiness': 'Consider a subscription or membership model to increase lock-in and recurring revenue.',
    'Market Trust': 'Partner with trusted local organizations to borrow their credibility.',
    'Viral Growth Potential': 'Build community features or referral programs that grow value with users.',
    'Data Advantage': 'Leverage user data to create personalized experiences competitors cannot match.',
    'Scale Economics': 'Automate key processes or find volume partnerships to improve unit economics.'
  }

  return pivots[weakestMetric.name] || null
}

export interface GoNoGoCardProps {
  section: SectionName
  decision: 'GO' | 'CONDITIONAL GO' | 'NO GO'
  confidence: number
  primaryReason: string
  conditions?: string[]
  weakestMetric?: { name: string; score: number }
}

export const GoNoGoCard = ({ section, decision, confidence, primaryReason, conditions, weakestMetric }: GoNoGoCardProps) => {
  const { setFocusedBox } = useSimulation()

  const isGo = decision === 'GO'
  const isConditional = decision === 'CONDITIONAL GO'

  const accentColor = isGo ? colors.green : isConditional ? colors.amber : colors.red

  const pivotSuggestion = getPivotSuggestion(weakestMetric)

  return (
    <div
      onClick={() => setFocusedBox({ section, label: 'GO/NO-GO Decision' })}
      style={{
        position: 'relative',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Border — uses TerminalBox pattern but with accent-colored left edge */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `1px solid ${accentColor}`,
        borderLeft: `4px solid ${accentColor}`,
        pointerEvents: 'none'
      }} />

      {/* Inline label — TerminalBox pattern */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '1rem',
        padding: '0 0.5rem',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        backgroundColor: colors.background,
        color: accentColor
      }}>
        The Verdict
      </div>

      {/* Content */}
      <div style={{ position: 'relative' }}>
        {/* Decision + confidence row */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{
            fontSize: '1.75rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 'bold',
            color: accentColor,
            letterSpacing: '0.05em'
          }}>
            {decision}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            color: colors.textDim
          }}>
            {confidence}% confidence
          </div>
        </div>

        {/* Primary reason */}
        <p style={{
          fontSize: '0.925rem',
          color: colors.textPrimary,
          margin: 0,
          lineHeight: 1.7,
          marginBottom: (isConditional && conditions?.length) ? '1rem' : 0
        }}>
          {primaryReason}
        </p>

        {/* Conditions */}
        {isConditional && conditions && conditions.length > 0 && (
          <div style={{
            paddingTop: '1rem',
            borderTop: `1px solid ${colors.border}`
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: accentColor,
              marginBottom: '0.625rem',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.05em'
            }}>
              VALIDATE FIRST
            </div>
            {conditions.map((condition, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: i < conditions.length - 1 ? '0.4rem' : 0
              }}>
                <span style={{ color: accentColor, fontSize: '0.75rem', marginTop: '0.15rem', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: '0.85rem', color: colors.textSecondary, lineHeight: 1.5 }}>
                  {condition}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pivot hint — subtle inline, not a separate box */}
        {pivotSuggestion && (
          <div style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ color: colors.magenta, fontSize: '0.8rem', flexShrink: 0 }}>↩</span>
            <span style={{
              fontSize: '0.8rem',
              color: colors.textDim,
              lineHeight: 1.5,
              fontStyle: 'italic'
            }}>
              {pivotSuggestion}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
