'use client'

import React, { useState, useRef, useEffect } from 'react'
import { colors } from '@/components/ui/colors'
import { TerminalBox } from '@/components/ui/TerminalBox'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SectionName } from '@/types/simulation'

const sections: { id: SectionName; label: string }[] = [
  { id: 'vision', label: 'Vision' },
  { id: 'market', label: 'Market' },
  { id: 'battlefield', label: 'Battle' },
  { id: 'verdict', label: 'Verdict' },
  { id: 'advisors', label: 'Advisors' }
]

export const AgentPanel = () => {
  const { simulation, agentMessages, addAgentMessage, focusedBox } = useSimulation()
  const [inputValue, setInputValue] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [agentMessages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking || !simulation) return

    const userMessage = inputValue.trim()
    addAgentMessage({ role: 'user', content: userMessage })
    setInputValue('')
    setIsThinking(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentData: simulation,
          focusedBlock: focusedBox ? { section: focusedBox.section, label: focusedBox.label } : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Agent request failed')
      }

      const data = await response.json()

      if (data.type === 'edit' && data.affectedSections) {
        addAgentMessage({
          role: 'agent',
          content: data.response,
          metadata: {
            type: 'edit',
            affectedSections: data.affectedSections,
            editDescription: data.editDescription
          }
        })
      } else {
        addAgentMessage({ role: 'agent', content: data.response })
      }
    } catch (error) {
      console.error('Agent error:', error)
      addAgentMessage({ role: 'agent', content: 'Sorry, I encountered an error. Please try again.' })
    } finally {
      setIsThinking(false)
      setTimeout(() => scrollToBottom(), 50)
    }
  }

  return (
    <div style={{ width: '30%', borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>
        <div style={{ color: colors.green }}>$ shipit mentor</div>
      </div>

      {/* Messages - Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {agentMessages.map((msg, i) => (
          <div key={i}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
              {msg.role === 'user' ? '> you' : '> mentor'}
            </div>
            <TerminalBox variant={msg.role === 'user' ? 'default' : 'info'}>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </TerminalBox>

            {/* Show affected sections for edit-type responses */}
            {msg.metadata && msg.metadata.type === 'edit' && Array.isArray(msg.metadata.affectedSections) ? (
              <div style={{ marginTop: '0.5rem' }}>
                <TerminalBox label="Sections Affected" variant="warning">
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary }}>
                    {['vision', 'market', 'battlefield', 'verdict', 'advisors'].map(s => (
                      <div key={s} style={{
                        color: (msg.metadata!.affectedSections as string[]).includes(s) ? colors.amber : colors.textDim
                      }}>
                        {(msg.metadata!.affectedSections as string[]).includes(s) ? '⟳' : '─'} {s.charAt(0).toUpperCase() + s.slice(1)}
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>
            ) : null}
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
              {'> mentor'}
            </div>
            <TerminalBox variant="info">
              <div style={{
                fontSize: '0.875rem',
                color: colors.cyan,
                fontFamily: 'JetBrains Mono, monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="animate-pulse-glow">●</span> Thinking...
              </div>
            </TerminalBox>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <div style={{ borderTop: `1px solid ${colors.border}`, padding: '1rem', backgroundColor: colors.surface }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          backgroundColor: colors.background,
          border: `1px solid ${inputFocused ? colors.green : colors.border}`,
          transition: 'border-color 0.2s'
        }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.green }}>
            &gt;
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isThinking ? 'Thinking...' : 'Ask about the analysis...'}
            disabled={isThinking}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              color: colors.textPrimary,
              border: 'none',
              outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              opacity: isThinking ? 0.5 : 1
            }}
          />
        </div>
        <div style={{ marginTop: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: focusedBox ? colors.amber : colors.textDim }}>
          Mode: {focusedBox ? `${sections.find(s => s.id === focusedBox.section)?.label} | ${focusedBox.label}` : ''}
        </div>
      </div>
    </div>
  )
}
