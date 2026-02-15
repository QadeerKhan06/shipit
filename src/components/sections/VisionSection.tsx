'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SimulationData } from '@/types/simulation'
import {
  TextCard,
  FeaturesCard,
  TargetUsersCard
} from '@/components/cards'

export const VisionSection = () => {
  const { simulation: partialSim, shouldShowBlock } = useSimulation()

  if (!partialSim) return null
  const simulation = partialSim as SimulationData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.875rem', color: colors.cyan, marginBottom: '0.5rem' }}>
          {simulation.name}
        </h2>
        <p style={{ color: colors.textSecondary, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
          {simulation.tagline}
        </p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: colors.textDim, margin: 0 }}>
          Lesson 1 — Define what you&apos;re building and who it&apos;s for
        </p>
      </div>

      {/* Value Proposition - MANDATORY */}
      <TextCard
        section="vision"
        label="Value Proposition"
        variant="info"
        text={simulation.valueProposition}
      />

      {/* Business Model - MANDATORY */}
      <TextCard
        section="vision"
        label="Business Model"
        text={simulation.businessModel}
      />

      {/* Key Features - MANDATORY */}
      <FeaturesCard
        section="vision"
        label="Key Features"
        features={simulation.features}
      />

      {/* Target Users - OPTIONAL */}
      {shouldShowBlock('vision-target-users') && (
        <TargetUsersCard
          section="vision"
          primary={simulation.targetUsers.primary}
          secondary={simulation.targetUsers.secondary}
        />
      )}
    </div>
  )
}
