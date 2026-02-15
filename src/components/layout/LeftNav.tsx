'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SectionName, SectionLoadStatus } from '@/types/simulation'

const sections: { id: SectionName; label: string }[] = [
  { id: 'vision', label: 'Vision' },
  { id: 'market', label: 'Market' },
  { id: 'battlefield', label: 'Battle' },
  { id: 'verdict', label: 'Verdict' },
  { id: 'advisors', label: 'Advisors' }
]

const exportButtons = [
  { icon: '📄', label: 'PDF', tooltip: 'Export PDF Report' },
  { icon: '📋', label: 'Board', tooltip: 'Export to Trello/Notion' },
  { icon: '📊', label: 'CSV', tooltip: 'Export Raw Data' }
]

function getStatusIcon(status: SectionLoadStatus): { icon: string; color: string; className?: string } {
  switch (status) {
    case 'pending': return { icon: '○', color: colors.textDim }
    case 'loading': return { icon: '◌', color: colors.amber, className: 'loading-spin' }
    case 'complete': return { icon: '◉', color: colors.green }
    case 'error': return { icon: '✕', color: colors.red }
  }
}

export const LeftNav = () => {
  const {
    activeSection,
    setActiveSection,
    sectionStatus
  } = useSimulation()

  return (
    <div style={{
      width: '13%',
      minWidth: '160px',
      borderRight: `1px solid ${colors.border}`,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.cyan, marginBottom: '2rem', fontSize: '0.875rem' }}>
        $ shipit
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {sections.map((section) => {
          const status = sectionStatus[section.id]
          const { icon, color, className } = getStatusIcon(status)
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: activeSection === section.id ? colors.surface : 'transparent',
                color: activeSection === section.id ? colors.magenta : colors.textSecondary,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = colors.textPrimary
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = colors.textSecondary
                }
              }}
            >
              <span className={className} style={{ color, display: 'inline-block' }}>
                {icon}
              </span>{' '}
              {section.label}
              {activeSection === section.id && (
                <span style={{ marginLeft: '0.5rem', color: colors.magenta }}>←</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Export Buttons */}
      <div style={{ paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: colors.textDim,
          marginBottom: '0.5rem'
        }}>
          EXPORT
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {exportButtons.map((btn) => (
            <button
              key={btn.label}
              title={btn.tooltip}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.125rem',
                padding: '0.5rem 0.25rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                backgroundColor: colors.surface,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.cyan
                e.currentTarget.style.color = colors.cyan
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border
                e.currentTarget.style.color = colors.textSecondary
              }}
            >
              <span style={{ fontSize: '1rem' }}>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim }}>
          v1.0
        </div>
      </div>
    </div>
  )
}
