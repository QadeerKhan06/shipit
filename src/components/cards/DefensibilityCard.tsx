'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface DefensibilityCardProps {
  section: SectionName
  overallScore: number
  label: string
  scores: Record<string, number>
}

// Map technical terms to plain language
const labelMap: Record<string, { label: string; tooltip: string }> = {
  networkEffects: { label: 'Viral Growth Potential', tooltip: 'Does your product get better as more people use it?' },
  brandTrust: { label: 'Market Trust', tooltip: 'How much do customers trust you vs. competitors?' },
  switchingCosts: { label: 'Customer Stickiness', tooltip: 'How hard is it for customers to leave?' },
  dataAsset: { label: 'Data Advantage', tooltip: 'Do you collect data that makes your product smarter?' },
  scale: { label: 'Scale Economics', tooltip: 'Do you get cheaper/better as you grow?' }
}

// Get color based on score
const getScoreColor = (score: number) => {
  if (score >= 70) return colors.green
  if (score >= 40) return colors.amber
  return colors.red
}

// Find weakest area for strategic insight
const findWeakestArea = (scores: Record<string, number>): { key: string; value: number } | null => {
  let weakest: { key: string; value: number } | null = null
  Object.entries(scores).forEach(([key, value]) => {
    if (!weakest || value < weakest.value) {
      weakest = { key, value }
    }
  })
  return weakest
}

// Generate strategic insight based on weakest area
const getStrategicInsight = (weakest: { key: string; value: number } | null): string => {
  if (!weakest) return ''

  const insights: Record<string, string> = {
    networkEffects: 'Consider adding referral incentives or community features to boost viral growth.',
    brandTrust: 'Focus on testimonials, certifications, and partnership announcements to build credibility.',
    switchingCosts: 'Add features that make your product more valuable over time (saved data, customizations).',
    dataAsset: 'Collect and leverage user data to personalize experiences and create unique insights.',
    scale: 'Automate operations and negotiate volume discounts to improve unit economics at scale.'
  }

  return insights[weakest.key] || ''
}

/**
 * DefensibilityCard - Display competitive protection score with plain language
 */
export const DefensibilityCard = ({ section, overallScore, label, scores }: DefensibilityCardProps) => {
  const scoreColor = getScoreColor(overallScore)
  const weakest = findWeakestArea(scores)
  const insight = getStrategicInsight(weakest)

  return (
    <BaseCard section={section} label="Competitive Protection" variant="info">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '3.5rem', color: scoreColor, fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace' }}>
            {overallScore}<span style={{ fontSize: '1.5rem', color: colors.textDim }}>/100</span>
          </div>
          <div style={{ fontSize: '1rem', color: colors.textPrimary, marginTop: '0.25rem' }}>
            {label}
          </div>
        </div>
        {/* Copycat Defense indicator */}
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: `${scoreColor}15`,
          border: `1px solid ${scoreColor}40`,
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
            Copycat Defense
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: scoreColor }}>
            {overallScore >= 70 ? 'STRONG' : overallScore >= 40 ? 'MODERATE' : 'WEAK'}
          </div>
        </div>
      </div>

      {/* Why this score explanation */}
      {weakest && weakest.value < 50 && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: `${colors.amber}10`,
          border: `1px solid ${colors.amber}30`,
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: colors.amber, marginBottom: '0.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
            WHY THIS SCORE?
          </div>
          <p style={{ fontSize: '0.8rem', color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
            Your &ldquo;{labelMap[weakest.key]?.label || weakest.key}&rdquo; is only {weakest.value}%, which limits your overall protection. {insight}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(scores).map(([key, value]) => {
          const barColor = getScoreColor(value)
          const labelInfo = labelMap[key] || { label: key, tooltip: '' }

          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, fontSize: '0.8rem', color: colors.textPrimary }} title={labelInfo.tooltip}>
                {labelInfo.label}
              </div>
              <div style={{ flex: 2, backgroundColor: colors.background, borderRadius: '4px', overflow: 'hidden', height: '18px' }}>
                <div style={{
                  width: `${value}%`,
                  height: '100%',
                  backgroundColor: barColor,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: barColor, minWidth: '40px', textAlign: 'right' }}>
                {value}%
              </div>
            </div>
          )
        })}
      </div>
    </BaseCard>
  )
}
