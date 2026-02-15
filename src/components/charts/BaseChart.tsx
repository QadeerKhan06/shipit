'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { TerminalBox } from '@/components/ui/TerminalBox'
import { DeepDiveButton } from '@/components/ui/DeepDiveButton'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SectionName } from '@/types/simulation'

export interface BaseChartProps {
  /** Section this chart belongs to (for focus tracking) */
  section: SectionName
  /** Label shown in the terminal box header */
  label: string
  /** Visual variant */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
  /** Chart SVG content */
  children: React.ReactNode
  /** Enable "Discuss" button for agent deep-dive */
  deepDive?: boolean
  /** Context data to pass to agent when deep-diving */
  deepDiveContext?: Record<string, unknown>
  /** Optional interpretation/insight text shown below chart */
  insight?: string
  /** Contextual question for the deep dive button */
  deepDiveQuestion?: string
}

/**
 * BaseChart - Wrapper for all chart components
 *
 * Provides:
 * - TerminalBox styling
 * - Click-to-focus behavior
 * - Focus highlight state
 * - Consistent chart container styling
 *
 * Usage:
 * ```tsx
 * <BaseChart section="market" label="Demand Trend">
 *   <svg viewBox="0 0 400 200">...</svg>
 * </BaseChart>
 * ```
 */
export const BaseChart = ({
  section,
  label,
  variant = 'default',
  children,
  deepDive = false,
  deepDiveContext = {},
  insight,
  deepDiveQuestion
}: BaseChartProps) => {
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
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.5rem 0',
        }}>
          {children}
        </div>

        {/* Insight interpretation */}
        {insight && (
          <div style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.75rem',
            color: colors.textSecondary,
            fontStyle: 'italic'
          }}>
            → {insight}
          </div>
        )}

        {/* Deep dive button */}
        {deepDive && (
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
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

// Re-export colors for chart components to use
export { colors }
