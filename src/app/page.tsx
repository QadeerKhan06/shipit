'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { colors } from '@/components/ui/colors'

// ============================================================================
// STYLES (CSS-in-JS for animations - easier to edit than inline)
// ============================================================================
const landingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'JetBrains Mono', monospace; }

  /* Animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes flame-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.6; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  /* Animation classes */
  .rocket-float { animation: float 6s ease-in-out infinite; }
  .flame { animation: flame-flicker 0.15s ease-in-out infinite; }

  /* Glow border effect */
  .glow-border {
    position: relative;
    isolation: isolate;
  }
  .glow-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #f778ba, #58a6ff, #3fb950);
    border-radius: 6px;
    z-index: -1;
    animation: glow-pulse 2s ease-in-out infinite;
  }

  /* Background effects */
  .scanline-overlay {
    position: absolute;
    width: 100%;
    height: 3px;
    background: linear-gradient(transparent, rgba(88, 166, 255, 0.1), transparent);
    animation: scanline 8s linear infinite;
    pointer-events: none;
  }
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.2;
    pointer-events: none;
  }
`

// ============================================================================
// COMPONENTS
// ============================================================================

const RocketLogo = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
    <defs>
      <linearGradient id="neon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={colors.neonPink} />
        <stop offset="50%" stopColor={colors.neonCyan} />
        <stop offset="100%" stopColor={colors.neonGreen} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Rocket body */}
    <path d="M60 10 L70 40 L70 90 L60 100 L50 90 L50 40 Z" stroke="url(#neon-grad)" strokeWidth="2" fill="none" filter="url(#glow)" />
    {/* Rocket tip */}
    <path d="M50 40 L60 10 L70 40" stroke={colors.neonCyan} strokeWidth="2" fill="none" filter="url(#glow)" />
    {/* Fins */}
    <path d="M50 70 L30 85 L50 90" stroke={colors.neonPink} strokeWidth="2" fill="none" filter="url(#glow)" />
    <path d="M70 70 L90 85 L70 90" stroke={colors.neonPink} strokeWidth="2" fill="none" filter="url(#glow)" />
    {/* Window */}
    <circle cx="60" cy="55" r="8" stroke={colors.neonGreen} strokeWidth="2" fill="none" filter="url(#glow)" />
    <circle cx="60" cy="55" r="5" fill={colors.neonGreen} opacity="0.3" />
    {/* Flame */}
    <g className="flame">
      <path d="M55 100 L50 115 L55 120 L60 130 L65 120 L70 115 L65 100" stroke={colors.neonPink} strokeWidth="2" fill={colors.neonPink} opacity="0.3" filter="url(#glow)" />
      <path d="M57 105 L55 115 L60 125 L65 115 L63 105" stroke={colors.neonCyan} strokeWidth="1.5" fill={colors.neonCyan} opacity="0.5" filter="url(#glow)" />
    </g>
  </svg>
)

const FeatureBadge = ({ icon, label, color }: { icon: string; label: string; color: string }) => (
  <div style={{
    padding: '0.75rem 1.25rem',
    background: colors.charcoal,
    border: `1px solid ${colors.surface}`,
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }}>
    <span style={{ fontSize: '1.25rem', color, fontFamily: 'JetBrains Mono, monospace' }}>{icon}</span>
    <span style={{ fontSize: '0.875rem', color: colors.textPrimary, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{label}</span>
  </div>
)

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function LandingPage() {
  const [idea, setIdea] = useState('')
  const router = useRouter()

  const handleAnalyze = () => {
    if (idea.trim()) {
      router.push(`/dashboard?idea=${encodeURIComponent(idea)}`)
    }
  }

  const hasIdea = idea.trim().length > 0

  return (
    <div style={{
      height: '100vh',
      backgroundColor: colors.black,
      color: colors.textPrimary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: landingStyles }} />

      {/* Background effects */}
      <div className="grid-bg" />
      <div className="scanline-overlay" />

      {/* Main content */}
      <div style={{
        maxWidth: '1000px',
        width: '95%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>

        {/* Logo */}
        <div className="rocket-float" style={{ marginTop: '-2rem' }}>
          <RocketLogo />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: '-1rem' }}>
          <h1 style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 700,
            margin: 0,
            marginBottom: '0.75rem',
            background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonCyan}, ${colors.neonGreen})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            $ shipit
          </h1>
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
            color: colors.textSecondary,
            fontWeight: 300,
            margin: 0,
          }}>
            Learn to validate your startup with AI-powered research
          </p>
        </div>

        {/* Input box */}
        <div style={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
          <div
            className={!hasIdea ? 'glow-border' : ''}
            style={{
              position: 'relative',
              background: colors.charcoal,
              border: `1px solid ${!hasIdea ? colors.neonPink : colors.surface}`,
              borderRadius: '4px',
              cursor: 'text',
            }}
          >
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Prompt label */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.25rem',
                color: colors.neonCyan,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}>
                <span style={{ color: colors.neonGreen }}>&gt;</span>
                <span>What&apos;s your idea?</span>
              </div>

              {/* Textarea */}
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="A platform connecting college students with local seniors for companionship..."
                style={{
                  width: '100%',
                  minHeight: '140px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: colors.textPrimary,
                  fontSize: '1rem',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  padding: 0,
                  caretColor: colors.neonGreen,
                }}
              />

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: colors.textDim,
                }}>
                  {idea.length} chars
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={!hasIdea}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1rem',
                    fontWeight: 500,
                    padding: '0.75rem 2rem',
                    background: hasIdea ? colors.neonPink : colors.surface,
                    color: hasIdea ? colors.black : colors.textDim,
                    border: `1px solid ${hasIdea ? colors.neonPink : colors.border}`,
                    borderRadius: '2px',
                    cursor: hasIdea ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: hasIdea ? `0 0 20px ${colors.neonPink}40` : 'none',
                  }}
                >
                  Analyze →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '800px', justifyContent: 'center' }}>
          <FeatureBadge icon="◉" label="Market Research" color={colors.neonCyan} />
          <FeatureBadge icon="◉" label="Competitor Analysis" color={colors.neonPink} />
          <FeatureBadge icon="◉" label="Risk Assessment" color={colors.neonGreen} />
        </div>
      </div>
    </div>
  )
}
