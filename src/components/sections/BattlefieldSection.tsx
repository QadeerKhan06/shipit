'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'

// Cards
import { GapRiskCard, FeatureMatrixCard, SaturationScoreCard, CaseStudyCard } from '@/components/cards'

// Charts
import { CompetitorMapChart, FundingVelocityChart, MoatRadarChart } from '@/components/charts'

export const BattlefieldSection = () => {
  const { simulation, shouldShowBlock, currentMarketIndex, setCurrentMarketIndex } = useSimulation()

  if (!simulation) return null

  const hasSecondaryMarket = simulation.secondaryCompetitors && simulation.secondaryCompetitors.length > 0
  const currentCompetitors = currentMarketIndex === 'core' ? simulation.competitors : simulation.secondaryCompetitors
  const chartLabel = currentMarketIndex === 'core' ? 'Core Market: Senior Companionship' : 'Secondary Market: Task Services'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, margin: 0, marginBottom: '0.25rem' }}>
            The Battlefield
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: colors.textDim, margin: 0 }}>
            Lesson 3 — Know your competition
          </p>
        </div>
        {hasSecondaryMarket && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentMarketIndex(currentMarketIndex === 'core' ? 'secondary' : 'core')
            }}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.cyan}`,
              color: colors.cyan,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.cyan
              e.currentTarget.style.color = colors.background
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface
              e.currentTarget.style.color = colors.cyan
            }}
          >
            {currentMarketIndex === 'core' ? 'Show Secondary Market' : 'Show Core Market'}
          </button>
        )}
      </div>

      {/* Competitive Landscape Scatter Plot */}
      <CompetitorMapChart
        section="battlefield"
        label={chartLabel}
        competitors={currentCompetitors || []}
      />

      {/* Gap & Risk Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <GapRiskCard
          section="battlefield"
          label="Your Gap"
          variant="success"
          text={simulation.strategicPosition?.opportunity || 'Market gap identified from competitive analysis'}
        />
        <GapRiskCard
          section="battlefield"
          label="Your Risk"
          variant="warning"
          text={simulation.strategicPosition?.risk || 'Competitive risk identified from market analysis'}
        />
      </div>

      {/* Feature Comparison Matrix - OPTIONAL */}
      {shouldShowBlock('battlefield-feature-matrix') && simulation.featureMatrix && (
        <FeatureMatrixCard
          section="battlefield"
          matrix={simulation.featureMatrix}
        />
      )}

      {/* Funding Velocity - OPTIONAL */}
      {shouldShowBlock('battlefield-funding-velocity') && simulation.competitorFunding && (
        <FundingVelocityChart
          section="battlefield"
          data={simulation.competitorFunding}
        />
      )}

      {/* Market Saturation Score - OPTIONAL */}
      {shouldShowBlock('battlefield-saturation') && simulation.saturationScore && (
        <SaturationScoreCard
          section="battlefield"
          score={simulation.saturationScore.score}
          label={simulation.saturationScore.label}
          description={simulation.saturationScore.description}
        />
      )}

      {/* Trust/Moat Analysis - OPTIONAL */}
      {shouldShowBlock('battlefield-moat-analysis') && simulation.moatAnalysis && (
        <MoatRadarChart
          section="battlefield"
          data={simulation.moatAnalysis}
        />
      )}

      {/* Case Studies - OPTIONAL (merged from History) */}
      {shouldShowBlock('battlefield-case-studies') && simulation.caseStudies && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.textDim }}>
            WHAT HAPPENED TO SIMILAR COMPANIES
          </h3>
          {simulation.caseStudies.map((study, i) => (
            <CaseStudyCard key={i} section="battlefield" study={study} />
          ))}
        </div>
      )}
    </div>
  )
}
