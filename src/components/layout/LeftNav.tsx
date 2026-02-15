'use client'

import React, { useState, useCallback } from 'react'
import { colors } from '@/components/ui/colors'
import { useSimulation } from '@/contexts/SimulationContext'
import { exportToPDF, exportToCSV, exportToBoard } from '@/lib/export'
import type { SectionName, SectionLoadStatus } from '@/types/simulation'

const sections: { id: SectionName; label: string }[] = [
  { id: 'vision', label: 'Vision' },
  { id: 'market', label: 'Market' },
  { id: 'battlefield', label: 'Battle' },
  { id: 'verdict', label: 'Verdict' },
  { id: 'advisors', label: 'Advisors' }
]

type ExportStatus = 'idle' | 'loading' | 'done'

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
    sectionStatus,
    simulation,
    pipelineStatus,
    reportId
  } = useSimulation()

  const [exportStatus, setExportStatus] = useState<Record<string, ExportStatus>>({
    PDF: 'idle',
    Board: 'idle',
    CSV: 'idle'
  })

  const canExport = pipelineStatus === 'complete' && !!simulation?.name

  const handleExport = useCallback(async (label: string) => {
    if (!canExport || !simulation) return

    setExportStatus(prev => ({ ...prev, [label]: 'loading' }))

    try {
      switch (label) {
        case 'PDF':
          await exportToPDF(simulation, reportId ?? null)
          break
        case 'Board':
          await exportToBoard(simulation)
          break
        case 'CSV':
          exportToCSV(simulation)
          break
      }
      setExportStatus(prev => ({ ...prev, [label]: 'done' }))
      setTimeout(() => setExportStatus(prev => ({ ...prev, [label]: 'idle' })), 1500)
    } catch (err) {
      console.error(`Export ${label} failed:`, err)
      setExportStatus(prev => ({ ...prev, [label]: 'idle' }))
    }
  }, [canExport, simulation, reportId])

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
          {([
            { icon: '📄', label: 'PDF', tooltip: 'Export PDF Report' },
            { icon: '📋', label: 'Board', tooltip: 'Copy to Clipboard' },
            { icon: '📊', label: 'CSV', tooltip: 'Export Raw Data' }
          ] as const).map((btn) => {
            const status = exportStatus[btn.label]
            const icon = status === 'loading' ? '⏳' : status === 'done' ? '✓' : btn.icon
            const statusLabel = status === 'done' && btn.label === 'Board' ? 'Copied' : btn.label

            return (
              <button
                key={btn.label}
                title={btn.tooltip}
                disabled={!canExport || status === 'loading'}
                onClick={() => handleExport(btn.label)}
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
                  color: !canExport ? colors.textDim : status === 'done' ? colors.green : colors.textSecondary,
                  border: `1px solid ${status === 'done' ? colors.green : colors.border}`,
                  borderRadius: '2px',
                  cursor: canExport && status !== 'loading' ? 'pointer' : 'not-allowed',
                  opacity: canExport ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (canExport && status === 'idle') {
                    e.currentTarget.style.borderColor = colors.cyan
                    e.currentTarget.style.color = colors.cyan
                  }
                }}
                onMouseLeave={(e) => {
                  if (status === 'idle') {
                    e.currentTarget.style.borderColor = colors.border
                    e.currentTarget.style.color = canExport ? colors.textSecondary : colors.textDim
                  }
                }}
              >
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                <span>{statusLabel}</span>
              </button>
            )
          })}
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
