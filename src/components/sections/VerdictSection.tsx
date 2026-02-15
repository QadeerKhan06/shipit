'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'

// Cards
import {
  StrengthCard,
  RiskItemCard,
  VerdictUnitEconomicsCard,
  HardQuestionCard,
  BullBearCard,
  DefensibilityCard,
  GoNoGoCard,
  FatalFlawCard
} from '@/components/cards'

// Charts
import { ProfitabilityPathChart } from '@/components/charts'

// Helper to find weakest metric from defensibility scores
const findWeakestMetric = (scores: Record<string, number>): { name: string; score: number } | undefined => {
  let weakest: { name: string; score: number } | undefined
  Object.entries(scores).forEach(([key, value]) => {
    if (key !== 'overallScore' && key !== 'label') {
      if (!weakest || value < weakest.score) {
        weakest = { name: key, score: value }
      }
    }
  })
  return weakest
}

// Map metric keys to human-readable names
const metricLabels: Record<string, string> = {
  networkEffects: 'Viral Growth Potential',
  brandTrust: 'Market Trust',
  switchingCosts: 'Customer Stickiness',
  dataAsset: 'Data Advantage',
  scale: 'Scale Economics'
}

export const VerdictSection = () => {
  const { simulation, shouldShowBlock } = useSimulation()

  if (!simulation) return null

  // Calculate weakest metric for strategic pivot logic
  const defensibilityScores = simulation.defensibilityScore
    ? Object.fromEntries(
        Object.entries(simulation.defensibilityScore)
          .filter(([key]) => key !== 'overallScore' && key !== 'label')
      ) as Record<string, number>
    : {}

  const weakestMetricRaw = findWeakestMetric(defensibilityScores)
  const weakestMetric = weakestMetricRaw
    ? { name: metricLabels[weakestMetricRaw.name] || weakestMetricRaw.name, score: weakestMetricRaw.score }
    : undefined

  // Determine GO/NO-GO decision based on score and confidence
  const getGoNoGoDecision = (): { decision: 'GO' | 'CONDITIONAL GO' | 'NO GO'; confidence: number; reason: string; conditions?: string[] } => {
    const overallScore = simulation.defensibilityScore?.overallScore || 50
    const recommendation = simulation.finalVerdict?.recommendation || 'VALIDATE FIRST'

    if (recommendation === 'BUILD IT' && overallScore >= 60) {
      return {
        decision: 'GO',
        confidence: Math.min(95, overallScore + 20),
        reason: 'The market opportunity is real, your differentiation is clear, and the economics work. Execute with focus.'
      }
    } else if (recommendation === 'PASS' || overallScore < 35) {
      return {
        decision: 'NO GO',
        confidence: 85,
        reason: 'The current approach faces too many structural barriers. Consider a significant pivot or different market entirely.'
      }
    } else {
      return {
        decision: 'CONDITIONAL GO',
        confidence: 65,
        reason: 'The opportunity exists but requires validation of key assumptions before scaling.',
        conditions: [
          weakestMetric && weakestMetric.score < 40
            ? `Address your ${weakestMetric.name} weakness (currently ${weakestMetric.score}%)`
            : 'Validate customer willingness to pay',
          'Run a small pilot before committing significant resources',
          'Secure early partnerships or letters of intent'
        ].filter(Boolean)
      }
    }
  }

  const goNoGoData = getGoNoGoDecision()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, marginBottom: '0.25rem' }}>
          The Verdict
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: colors.textDim, margin: 0 }}>
          Lesson 4 — See if the data supports your idea
        </p>
      </div>

      {/* GO/NO-GO Decision - The single definitive verdict */}
      <GoNoGoCard
        section="verdict"
        decision={goNoGoData.decision}
        confidence={goNoGoData.confidence}
        primaryReason={goNoGoData.reason}
        conditions={goNoGoData.conditions}
        weakestMetric={weakestMetric}
      />

      {/* Hard Question - Emotional center */}
      <HardQuestionCard section="verdict" question={simulation.hardQuestion} />

      {/* Competitive Protection (formerly Defensibility) */}
      {shouldShowBlock('verdict-defensibility') && simulation.defensibilityScore && (
        <DefensibilityCard
          section="verdict"
          overallScore={simulation.defensibilityScore.overallScore}
          label={simulation.defensibilityScore.label}
          scores={defensibilityScores}
        />
      )}

      {/* Your Two Futures (Bull/Bear) */}
      {shouldShowBlock('verdict-bull-bear') && simulation.bullBearCase && (
        <BullBearCard
          section="verdict"
          bull={simulation.bullBearCase.bull}
          bear={simulation.bullBearCase.bear}
        />
      )}

      {/* Strengths */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.green }}>
          ✓ What&apos;s Working For You
        </h3>
        {simulation.strengths.map((strength, i) => (
          <StrengthCard
            key={i}
            section="verdict"
            title={strength.title}
            description={strength.description}
            source={strength.source}
          />
        ))}
      </div>

      {/* Risks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.amber }}>
          ⚠ What Could Hurt You
        </h3>
        {simulation.risks.map((risk, i) => (
          <RiskItemCard
            key={i}
            section="verdict"
            title={risk.title}
            description={risk.description}
            source={risk.source}
          />
        ))}
      </div>

      {/* Fatal Flaw Analysis - OPTIONAL (merged from History) */}
      {shouldShowBlock('verdict-fatal-flaw') && simulation.fatalFlaw && (
        <FatalFlawCard
          section="verdict"
          title={simulation.fatalFlaw.title}
          description={simulation.fatalFlaw.description}
          example={simulation.fatalFlaw.example}
        />
      )}

      {/* Unit Economics */}
      <VerdictUnitEconomicsCard section="verdict" />

      {/* Path to Profitability */}
      {shouldShowBlock('verdict-profitability-path') && simulation.profitabilityPath && (
        <ProfitabilityPathChart
          section="verdict"
          data={simulation.profitabilityPath}
        />
      )}
    </div>
  )
}
