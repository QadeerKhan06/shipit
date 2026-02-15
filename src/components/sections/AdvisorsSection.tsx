'use client'

import React, { useState } from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'
import { AdvisorCard } from '@/components/cards/AdvisorCard'
import { AdvisorChat } from '@/components/cards/AdvisorChat'
import type { AdvisorPersona } from '@/types/simulation'

export const AdvisorsSection = () => {
  const { simulation, shouldShowBlock } = useSimulation()
  const [activeChat, setActiveChat] = useState<AdvisorPersona | null>(null)

  if (!simulation) return null

  // Filter advisors: competitor-customer is optional
  const visibleAdvisors = simulation.advisors.filter(a => {
    if (a.id === 'competitor-customer') {
      return shouldShowBlock('advisors-competitor-user')
    }
    return true
  })

  if (activeChat) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, margin: 0 }}>
          Advisors
        </h2>
        <AdvisorChat
          advisor={activeChat}
          onBack={() => setActiveChat(null)}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, margin: 0, marginBottom: '0.25rem' }}>
          Advisors
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: colors.textDim, margin: 0 }}>
          Lesson 5 — Practice defending your idea to real stakeholders
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {visibleAdvisors.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            advisor={advisor}
            onStartChat={() => setActiveChat(advisor)}
          />
        ))}
      </div>
    </div>
  )
}
