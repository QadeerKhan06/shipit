'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'

// Cards
import { QuotesCard, MarketSizeCard, VCFundingCard, RegulatoryCard } from '@/components/cards'

// Charts
import {
  DemandTrendChart,
  WorkforceCapacityChart,
  OpportunityGapChart,
  JobPostingsChart,
  HypeRealityChart
} from '@/components/charts'

export const MarketSection = () => {
  const { simulation, shouldShowBlock } = useSimulation()

  if (!simulation) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, marginBottom: '0.25rem' }}>
        Market Reality
      </h2>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: colors.textDim, margin: 0 }}>
        Lesson 2 — Understand the market you&apos;re entering
      </p>

      {/* Charts and Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Demand Trend - Line Chart (MANDATORY) */}
        <DemandTrendChart
          section="market"
          data={simulation.market.demandTrend}
          subtitle={simulation.market.demandTrendSubtitle}
        />

        {/* Workforce Capacity - Bar Chart (MANDATORY) */}
        <WorkforceCapacityChart
          section="market"
          data={simulation.market.workforceCapacity}
          subtitle={simulation.market.workforceSubtitle}
        />

        {/* Market Opportunity Gap - Area Chart (MANDATORY) */}
        <OpportunityGapChart
          section="market"
          data={simulation.market.opportunityGap}
        />

        {/* Ask the Market - Quotes (MANDATORY) */}
        <QuotesCard
          section="market"
          quotes={simulation.market.userQuotes}
        />

        {/* Market Size (TAM/SAM/SOM) - MANDATORY */}
        {simulation.marketExtended?.marketSize && (
          <MarketSizeCard
            section="market"
            tam={simulation.marketExtended.marketSize.tam}
            sam={simulation.marketExtended.marketSize.sam}
            som={simulation.marketExtended.marketSize.som}
          />
        )}

        {/* VC Funding Activity - MANDATORY */}
        {simulation.marketExtended?.fundingActivity && (
          <VCFundingCard
            section="market"
            total={simulation.marketExtended.fundingActivity.total}
            recentRounds={simulation.marketExtended.fundingActivity.recentRounds}
          />
        )}

        {/* Job Postings Trend - MANDATORY */}
        {simulation.marketExtended?.jobPostingsTrend && (
          <JobPostingsChart
            section="market"
            data={simulation.marketExtended.jobPostingsTrend}
            currentPostings={simulation.market.jobPostings}
          />
        )}

        {/* Regulatory Landscape - OPTIONAL */}
        {shouldShowBlock('market-regulatory') && simulation.marketExtended?.regulatoryLandscape && (
          <RegulatoryCard
            section="market"
            items={simulation.marketExtended.regulatoryLandscape}
          />
        )}

        {/* Hype vs Reality Check - OPTIONAL */}
        {shouldShowBlock('market-hype-reality') && simulation.marketExtended?.hypeVsReality && (
          <HypeRealityChart
            section="market"
            data={simulation.marketExtended.hypeVsReality}
          />
        )}
      </div>
    </div>
  )
}
