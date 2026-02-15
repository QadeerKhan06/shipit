'use client'

import React, { useState, useRef, useEffect } from 'react'
import { colors } from '@/components/ui/colors'
import { TerminalBox } from '@/components/ui/TerminalBox'
import { useSimulation } from '@/contexts/SimulationContext'
import type { SectionName, PipelineMessage } from '@/types/simulation'

const ALL_SECTIONS: SectionName[] = ['vision', 'market', 'battlefield', 'verdict', 'advisors']

// Parse a "Sources:" line into structured source objects
function parseSources(sourcesText: string): { title: string; url: string }[] {
  const sources: { title: string; url: string }[] = []
  // Pattern: Title (url) or [Title](url)
  // Split by comma-separated entries, each having title + url
  const mdLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  const titleUrlPattern = /([^,(]+?)\s*\((https?:\/\/[^)]+)\)/g

  // Try markdown links first
  let match: RegExpExecArray | null
  while ((match = mdLinkPattern.exec(sourcesText)) !== null) {
    sources.push({ title: match[1].trim(), url: match[2].trim() })
  }

  if (sources.length > 0) return sources

  // Fall back to Title (url) pattern
  while ((match = titleUrlPattern.exec(sourcesText)) !== null) {
    sources.push({ title: match[1].trim(), url: match[2].trim() })
  }

  return sources
}

// Render inline text with clickable links and **bold**
function renderInlineText(text: string): React.ReactNode[] {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,)]+)|(\*\*([^*]+)\*\*)/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      nodes.push(
        <a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer"
          style={{ color: colors.cyan, textDecoration: 'underline', textUnderlineOffset: '2px' }}>{match[2]}</a>
      )
    } else if (match[4]) {
      const cleanUrl = match[4].replace(/[.,;:!?)]+$/, '')
      const trailing = match[4].slice(cleanUrl.length)
      nodes.push(
        <a key={match.index} href={cleanUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: colors.cyan, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {cleanUrl.length > 50 ? cleanUrl.slice(0, 50) + '…' : cleanUrl}
        </a>
      )
      if (trailing) nodes.push(trailing)
    } else if (match[5]) {
      nodes.push(<strong key={match.index}>{match[6]}</strong>)
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

// Render agent message: split body from sources, style sources as a block
function renderMessageContent(text: string): React.ReactNode {
  // Split on "Sources:" line (case-insensitive, may have newline before it)
  const sourcesMatch = text.match(/\n?\s*Sources?:\s*/i)

  if (!sourcesMatch || sourcesMatch.index === undefined) {
    // No sources section — render as inline text
    return <>{renderInlineText(text)}</>
  }

  const bodyText = text.slice(0, sourcesMatch.index).trimEnd()
  const sourcesRaw = text.slice(sourcesMatch.index + sourcesMatch[0].length)
  const sources = parseSources(sourcesRaw)

  return (
    <>
      {renderInlineText(bodyText)}
      {sources.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
        }}>
          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: colors.textDim,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Sources
          </span>
          {sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: colors.cyan,
                textDecoration: 'none',
                padding: '0.25rem 0.5rem',
                backgroundColor: `${colors.cyan}08`,
                border: `1px solid ${colors.cyan}20`,
                borderRadius: '2px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.cyan}15`
                e.currentTarget.style.borderColor = `${colors.cyan}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.cyan}08`
                e.currentTarget.style.borderColor = `${colors.cyan}20`
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, opacity: 0.6 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {src.title}
              </span>
            </a>
          ))}
        </div>
      )}
    </>
  )
}

// Format timestamp for pipeline messages
function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Status icon for pipeline messages
function statusIcon(status: PipelineMessage['status']): { icon: string; color: string } {
  switch (status) {
    case 'in_progress': return { icon: '◌', color: colors.amber }
    case 'complete': return { icon: '✓', color: colors.green }
    case 'error': return { icon: '✕', color: colors.red }
  }
}

export const AgentPanel = () => {
  const {
    pipelineStatus,
    pipelineMessages,
    agentMessages,
    focusedBox,
    regenerateSections,
    isDeploying,
    sendAgentMessage,
    isAgentThinking,
  } = useSimulation()

  const [inputValue, setInputValue] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isPipelineActive = pipelineStatus !== 'complete' && pipelineStatus !== 'idle' && pipelineStatus !== 'error'
  const inputDisabled = isPipelineActive || isAgentThinking || isDeploying

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [agentMessages, pipelineMessages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || inputDisabled) return
    const userMessage = inputValue.trim()
    setInputValue('')
    await sendAgentMessage(userMessage)
    setTimeout(() => scrollToBottom(), 50)
  }

  const handleDeploy = async (affectedSections: string[], editInstruction: string) => {
    const sections = affectedSections.filter(s => ALL_SECTIONS.includes(s as SectionName)) as SectionName[]
    if (sections.length === 0) return
    await regenerateSections(sections, editInstruction)
  }

  // Placeholder text
  const getPlaceholder = () => {
    if (isPipelineActive) return 'Analysis in progress...'
    if (isDeploying) return 'Deploying changes...'
    if (isAgentThinking) return 'Thinking...'
    return 'Ask about the analysis...'
  }

  return (
    <div style={{
      width: '30%',
      borderLeft: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.surface,
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${colors.border}`,
        padding: '1rem',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.875rem',
      }}>
        <div style={{ color: colors.green }}>
          $ shipit {isPipelineActive ? 'analyze' : 'mentor'}
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {/* Pipeline progress messages */}
        {pipelineMessages.map((msg) => {
          const { icon, color } = statusIcon(msg.status)
          return (
            <div key={msg.id} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              lineHeight: '1.6',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}>
              <span style={{ color: colors.textDim, flexShrink: 0 }}>
                [{formatTime(msg.timestamp)}]
              </span>
              <span
                className={msg.status === 'in_progress' ? 'loading-spin' : undefined}
                style={{ color, flexShrink: 0, display: 'inline-block' }}
              >
                {icon}
              </span>
              <span style={{ color: msg.status === 'error' ? colors.red : colors.textSecondary }}>
                {msg.message}
              </span>
            </div>
          )
        })}

        {/* Divider between pipeline and chat */}
        {pipelineMessages.length > 0 && agentMessages.length > 0 && (
          <div style={{
            borderTop: `1px solid ${colors.border}`,
            margin: '0.5rem 0',
          }} />
        )}

        {/* Chat messages */}
        {agentMessages.map((msg, i) => (
          <div key={`msg-${i}`}>
            {msg.role === 'system' ? (
              // System messages (deploy confirmations)
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: colors.green,
                padding: '0.5rem',
                backgroundColor: `${colors.green}10`,
                border: `1px solid ${colors.green}30`,
                borderRadius: '2px',
              }}>
                {msg.content}
              </div>
            ) : (
              <>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: colors.textDim,
                  marginBottom: '0.25rem',
                }}>
                  {msg.role === 'user' ? '> you' : '> mentor'}
                </div>
                <TerminalBox variant={msg.role === 'user' ? 'default' : 'info'}>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {msg.role === 'agent' ? renderMessageContent(msg.content) : msg.content}
                  </div>
                </TerminalBox>

                {/* Deploy button for edit-type responses */}
                {msg.metadata?.type === 'edit' && Array.isArray(msg.metadata.affectedSections) && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: `${colors.green}08`,
                    border: `1px solid ${colors.green}30`,
                    borderRadius: '2px',
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.7rem',
                      color: colors.textDim,
                      marginBottom: '0.5rem',
                    }}>
                      AFFECTED SECTIONS
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      {ALL_SECTIONS.map(s => {
                        const isAffected = (msg.metadata!.affectedSections as string[]).includes(s)
                        return (
                          <span key={s} style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '2px',
                            backgroundColor: isAffected ? `${colors.amber}15` : 'transparent',
                            color: isAffected ? colors.amber : colors.textDim,
                            border: `1px solid ${isAffected ? colors.amber + '40' : 'transparent'}`,
                          }}>
                            {isAffected ? '⟳' : '─'} {s.charAt(0).toUpperCase() + s.slice(1)}
                          </span>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => handleDeploy(
                        msg.metadata!.affectedSections as string[],
                        (msg.metadata!.editInstruction as string) || (msg.metadata!.editDescription as string) || ''
                      )}
                      disabled={isDeploying}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: isDeploying ? colors.surface : `${colors.green}15`,
                        color: isDeploying ? colors.textDim : colors.green,
                        border: `1px solid ${isDeploying ? colors.border : colors.green}`,
                        borderRadius: '2px',
                        cursor: isDeploying ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isDeploying ? '◌ Deploying...' : '▶ Deploy Changes'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {isAgentThinking && (
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: colors.textDim,
              marginBottom: '0.25rem',
            }}>
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

      {/* Input */}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        padding: '1rem',
        backgroundColor: colors.surface,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          backgroundColor: colors.background,
          border: `1px solid ${inputFocused ? colors.green : colors.border}`,
          transition: 'border-color 0.2s',
          opacity: inputDisabled ? 0.5 : 1,
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.875rem',
            color: colors.green,
          }}>
            &gt;
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={getPlaceholder()}
            disabled={inputDisabled}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              color: colors.textPrimary,
              border: 'none',
              outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          />
        </div>
        {focusedBox && (
          <div style={{
            marginTop: '0.5rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: colors.amber,
          }}>
            Focus: {focusedBox.section} | {focusedBox.label}
          </div>
        )}
      </div>
    </div>
  )
}
