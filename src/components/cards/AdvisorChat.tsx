'use client'

import React, { useState, useRef, useEffect } from 'react'
import { colors } from '@/components/ui/colors'
import type { AdvisorPersona } from '@/types/simulation'
import { TerminalBox } from '@/components/ui/TerminalBox'
import { useSimulation } from '@/contexts/SimulationContext'

interface ChatMessage {
  role: 'advisor' | 'user'
  content: string
}

export interface AdvisorChatProps {
  advisor: AdvisorPersona
  onBack: () => void
}

export const AdvisorChat = ({ advisor, onBack }: AdvisorChatProps) => {
  const { simulation } = useSimulation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'advisor', content: advisor.openingMessage }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [playingVoice, setPlayingVoice] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const firstName = advisor.name.split(' ')[0].toUpperCase()

  const playVoice = async (text: string, messageIndex: number) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (playingVoice === messageIndex) {
      setPlayingVoice(null)
      return
    }

    setPlayingVoice(messageIndex)

    try {
      const response = await fetch('/api/advisor-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, advisorId: advisor.id, voiceGender: advisor.voiceGender })
      })

      if (!response.ok) throw new Error('Voice synthesis failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setPlayingVoice(null)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error('Voice playback error:', error)
      setPlayingVoice(null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(updatedMessages)
    setIsTyping(true)

    try {
      const response = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisorId: advisor.id,
          messages: updatedMessages.map(m => ({
            role: m.role === 'advisor' ? 'assistant' : 'user',
            content: m.content
          })),
          simulationData: simulation
        })
      })

      if (!response.ok) throw new Error('Advisor response failed')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'advisor', content: data.response }])
    } catch (error) {
      console.error('Advisor chat error:', error)
      setMessages(prev => [...prev, { role: 'advisor', content: 'Sorry, I had trouble responding. Could you try again?' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <TerminalBox label={advisor.name} variant="default">
      <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: '0.75rem',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: '0.75rem'
        }}>
          <button
            onClick={onBack}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              color: colors.textDim,
              cursor: 'pointer',
              borderRadius: '2px'
            }}
          >
            ← Back
          </button>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: `${advisor.color}20`,
            border: `2px solid ${advisor.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: advisor.color,
            fontWeight: 'bold'
          }}>
            {advisor.avatar}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: colors.textPrimary, fontWeight: 'bold' }}>
              {advisor.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: colors.textDim }}>
              {advisor.title}, {advisor.company}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingRight: '0.25rem'
        }}>
          {messages.map((msg, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: msg.role === 'advisor' ? advisor.color : colors.textDim,
                marginBottom: '0.25rem'
              }}>
                {msg.role === 'advisor' ? firstName : 'YOU'}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: colors.textPrimary,
                lineHeight: 1.6,
                padding: '0.5rem 0.75rem',
                backgroundColor: msg.role === 'advisor' ? `${advisor.color}08` : colors.surface,
                borderLeft: msg.role === 'advisor' ? `2px solid ${advisor.color}40` : `2px solid ${colors.border}`,
                borderRadius: '0 4px 4px 0'
              }}>
                {msg.content}
              </div>
              {msg.role === 'advisor' && (
                <button
                  onClick={() => playVoice(msg.content, i)}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${playingVoice === i ? advisor.color : colors.border}`,
                    color: playingVoice === i ? advisor.color : colors.textDim,
                    cursor: 'pointer',
                    borderRadius: '2px',
                    marginTop: '0.25rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {playingVoice === i ? '■ Stop' : '▶ Listen'}
                </button>
              )}
            </div>
          ))}

          {isTyping && (
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: advisor.color,
                marginBottom: '0.25rem'
              }}>
                {firstName}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: colors.textDim,
                padding: '0.5rem 0.75rem',
                backgroundColor: `${advisor.color}08`,
                borderLeft: `2px solid ${advisor.color}40`,
                borderRadius: '0 4px 4px 0',
                fontStyle: 'italic'
              }}>
                typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: `1px solid ${colors.border}`,
          marginTop: '0.75rem'
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.875rem',
            color: colors.green,
            padding: '0.5rem 0',
            flexShrink: 0
          }}>
            &gt;
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Talk to ${advisor.name.split(' ')[0]}...`}
            style={{
              flex: 1,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.85rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textPrimary,
              outline: 'none',
              padding: '0.5rem 0'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: advisor.color,
              border: 'none',
              color: colors.background,
              cursor: 'pointer',
              fontWeight: 'bold',
              borderRadius: '2px'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </TerminalBox>
  )
}

