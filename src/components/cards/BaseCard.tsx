'use client'

import React from 'react'
import { TerminalBox } from '@/components/ui/TerminalBox'
import { DeepDiveButton } from '@/components/ui/DeepDiveButton'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SectionName } from '@/types/simulation'

export interface BaseCardProps {
  /** Section this card belongs to (for focus tracking) */
  section: SectionName
  /** Label shown in the terminal box header */
  label: string
  /** Visual variant */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
  /** Card content */
  children: React.ReactNode
  /** Enable "Discuss" button for agent deep-dive */
  deepDive?: boolean
  /** Context data to pass to agent when deep-diving */
  deepDiveContext?: Record<string, unknown>
  /** Optional interpretation/insight text shown below content */
  insight?: string
  /** Contextual question for the deep dive button */
  deepDiveQuestion?: string
}

/**
 * BaseCard - Wrapper for all card components
 *
 * Provides:
 * - TerminalBox styling
 * - Click-to-focus behavior
 * - Focus highlight state
 *
 * Usage:
 * ```tsx
 * <BaseCard section="verdict" label="Strength" variant="success">
 *   <p>Card content here</p>
 * </BaseCard>
 * ```
 */
export const BaseCard = ({
  section,
  label,
  variant = 'default',
  children,
  deepDive = false,
  deepDiveContext = {},
  insight,
  deepDiveQuestion
}: BaseCardProps) => {
  const { focusedBox, setFocusedBox } = useSimulation()

  const isFocused = focusedBox?.section === section && focusedBox?.label === label

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFocusedBox({ section, label })
  }

  return (
    <div
      className={`clickable-box ${isFocused ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <TerminalBox label={label} variant={variant}>
        {children}

        {/* Insight interpretation */}
        {insight && (
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.75rem',
            color: '#9ca3af',
            fontStyle: 'italic'
          }}>
            → {insight}
          </div>
        )}

        {/* Deep dive button */}
        {deepDive && (
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <DeepDiveButton
              blockLabel={label}
              context={{ section, ...deepDiveContext }}
              question={deepDiveQuestion}
            />
          </div>
        )}
      </TerminalBox>
    </div>
  )
}
