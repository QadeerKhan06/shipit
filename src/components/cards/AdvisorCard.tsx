'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { AdvisorPersona } from '@/types/simulation'
import { TerminalBox } from '@/components/ui/TerminalBox'

export interface AdvisorCardProps {
  advisor: AdvisorPersona
  onStartChat: (advisor: AdvisorPersona) => void
}

export const AdvisorCard = ({ advisor, onStartChat }: AdvisorCardProps) => (
  <TerminalBox label={advisor.name} variant="default">
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {/* Avatar */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: `${advisor.color}20`,
        border: `2px solid ${advisor.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.875rem',
        color: advisor.color,
        fontWeight: 'bold',
        flexShrink: 0
      }}>
        {advisor.avatar}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: colors.textPrimary, fontWeight: 'bold' }}>
              {advisor.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textDim }}>
              {advisor.title}, {advisor.company}
            </div>
          </div>
          <button
            onClick={() => onStartChat(advisor)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: `${advisor.color}15`,
              border: `1px solid ${advisor.color}50`,
              color: advisor.color,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '2px',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${advisor.color}25`
              e.currentTarget.style.borderColor = advisor.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${advisor.color}15`
              e.currentTarget.style.borderColor = `${advisor.color}50`
            }}
          >
            TALK →
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '0.5rem', lineHeight: 1.5 }}>
          {advisor.bio}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {advisor.expertise.map((tag, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                padding: '0.125rem 0.375rem',
                backgroundColor: `${advisor.color}10`,
                color: `${advisor.color}cc`,
                borderRadius: '2px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </TerminalBox>
)
