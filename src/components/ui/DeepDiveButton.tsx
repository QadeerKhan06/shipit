'use client'

import React from 'react'
import { colors } from './colors'
import { useSimulation } from '@/contexts/SimulationContext'

export interface DeepDiveButtonProps {
  /** The block/card label to discuss */
  blockLabel: string
  /** Context data to pass to the agent */
  context: Record<string, unknown>
  /** Contextual question to display and ask */
  question?: string
}

/**
 * DeepDiveButton - Triggers agent discussion with a contextual question
 *
 * When clicked, sends the contextual question to the agent panel
 * for deeper analysis and Q&A.
 */
export const DeepDiveButton = ({ blockLabel, context, question }: DeepDiveButtonProps) => {
  const { sendAgentMessage, isAgentThinking, pipelineStatus } = useSimulation()

  const displayQuestion = question || `Tell me more about this`
  const fullQuestion = question || `Tell me more about "${blockLabel}". What should I know?`

  const truncatedDisplay = displayQuestion.length > 50
    ? displayQuestion.slice(0, 50) + '...'
    : displayQuestion

  const disabled = isAgentThinking || (pipelineStatus !== 'complete' && pipelineStatus !== 'idle')

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card focus
    if (disabled) return

    const section = (context.section as string) || ''
    sendAgentMessage(fullQuestion, section ? { section, label: blockLabel } : undefined)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={displayQuestion}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.625rem',
        fontSize: '0.65rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: disabled ? colors.textDim : colors.cyan,
        backgroundColor: `${colors.cyan}10`,
        border: `1px solid ${colors.cyan}30`,
        borderRadius: '2px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = `${colors.cyan}20`
          e.currentTarget.style.borderColor = `${colors.cyan}60`
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.cyan}10`
        e.currentTarget.style.borderColor = `${colors.cyan}30`
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span style={{ opacity: 0.7 }}>Ask:</span>
      <span>{truncatedDisplay}</span>
    </button>
  )
}
