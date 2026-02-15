'use client'

import React, { useState, useEffect } from 'react'

const colors = {
  black: '#000000',
  charcoal: '#0a0a0a',
  surface: '#121212',
  border: '#1a1a1a',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textDim: '#484f58',
  neonPink: '#f778ba',
  neonGreen: '#3fb950',
  neonCyan: '#58a6ff',
}

// ASCII Rocket Logo Component
const RocketLogo = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
    {/* Rocket body - geometric neon lines */}
    <defs>
      <linearGradient id="neon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: colors.neonPink, stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: colors.neonCyan, stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: colors.neonGreen, stopOpacity: 1 }} />
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

    {/* Main rocket shape */}
    <path d="M60 10 L70 40 L70 90 L60 100 L50 90 L50 40 Z" stroke="url(#neon-grad)" strokeWidth="2" fill="none" filter="url(#glow)" />

    {/* Nose cone */}
    <path d="M50 40 L60 10 L70 40" stroke={colors.neonCyan} strokeWidth="2" fill="none" filter="url(#glow)" />

    {/* Wings */}
    <path d="M50 70 L30 85 L50 90" stroke={colors.neonPink} strokeWidth="2" fill="none" filter="url(#glow)" />
    <path d="M70 70 L90 85 L70 90" stroke={colors.neonPink} strokeWidth="2" fill="none" filter="url(#glow)" />

    {/* Window */}
    <circle cx="60" cy="55" r="8" stroke={colors.neonGreen} strokeWidth="2" fill="none" filter="url(#glow)" />
    <circle cx="60" cy="55" r="5" fill={colors.neonGreen} opacity="0.3" />

    {/* Flame - animated */}
    <g className="flame">
      <path d="M55 100 L50 115 L55 120 L60 130 L65 120 L70 115 L65 100" stroke={colors.neonPink} strokeWidth="2" fill={colors.neonPink} opacity="0.3" filter="url(#glow)" />
      <path d="M57 105 L55 115 L60 125 L65 115 L63 105" stroke={colors.neonCyan} strokeWidth="1.5" fill={colors.neonCyan} opacity="0.5" filter="url(#glow)" />
    </g>

    {/* ASCII-style details */}
    <text x="56" y="77" fill={colors.neonGreen} fontSize="6" fontFamily="monospace">━</text>
    <text x="56" y="83" fill={colors.neonGreen} fontSize="6" fontFamily="monospace">━</text>
  </svg>
)

export default function LandingPage() {
  const [idea, setIdea] = useState('')
  const [scanlines, setScanlines] = useState(true)

  const handleAnalyze = () => {
    if (idea.trim()) {
      console.log('Analyzing:', idea)
      // Navigation logic would go here
    }
  }

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
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes flame-flicker {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: translateY(2px) scale(0.95);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(247, 120, 186, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(247, 120, 186, 0.5), 0 0 80px rgba(247, 120, 186, 0.2);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes text-glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .rocket-float {
          animation: float 6s ease-in-out infinite;
        }

        .flame {
          animation: flame-flicker 0.15s ease-in-out infinite;
        }

        .glow-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(90deg, ${colors.neonPink}, ${colors.neonCyan}, ${colors.neonGreen});
          border-radius: 4px;
          opacity: 0.5;
          animation: glow-pulse 2s ease-in-out infinite;
        }

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
          background-image:
            linear-gradient(${colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border} 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.2;
          pointer-events: none;
        }

        .glitch {
          position: relative;
        }

        .glitch:hover {
          animation: text-glitch 0.3s ease-in-out;
        }

      `}</style>

      {/* Grid background */}
      <div className="grid-bg" />

      {/* Scanline effect */}
      {scanlines && <div className="scanline-overlay" />}

      {/* Main content */}
      <div style={{
        maxWidth: '1000px',
        width: '95%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Logo */}
        <div className="rocket-float" style={{ marginTop: '-2rem' }}>
          <RocketLogo />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: '-1rem' }}>
          <h1 className="glitch" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 700,
            margin: 0,
            marginBottom: '0.75rem',
            background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonCyan}, ${colors.neonGreen})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            $ shipit
          </h1>
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
            color: colors.textSecondary,
            fontWeight: 300,
            margin: 0
          }}>
            AI validation grounded in real market data
          </p>
        </div>

        {/* Main input field */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div
            className={!idea ? 'glow-border' : ''}
            onClick={(e) => {
              const textarea = e.currentTarget.querySelector('textarea')
              textarea?.focus()
            }}
            style={{
              position: 'relative',
              background: colors.charcoal,
              border: `1px solid ${!idea ? colors.neonPink : colors.surface}`,
              borderRadius: '4px',
              transition: idea ? 'none' : 'all 0.3s ease',
              cursor: 'text'
            }}>
            <div style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Prompt - just a label */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.25rem',
                color: colors.neonCyan,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                userSelect: 'none'
              }}>
                <span style={{ color: colors.neonGreen }}>&gt;</span>
                <span>What's your idea?</span>
              </div>

              {/* Text area */}
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="A platform connecting college students with local seniors for companionship. Students earn money, seniors get help and conversation..."
                style={{
                  width: '100%',
                  minHeight: '140px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: colors.textPrimary,
                  fontSize: '1rem',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  padding: 0,
                  caretColor: colors.neonGreen
                }}
              />

              {/* Character count & CTA */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: colors.textDim
                }}>
                  {idea.length} / ∞ chars
                </span>

                <button
                  onClick={handleAnalyze}
                  disabled={!idea.trim()}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1rem',
                    fontWeight: 500,
                    padding: '0.75rem 2rem',
                    background: idea.trim() ? colors.neonPink : colors.surface,
                    color: idea.trim() ? colors.black : colors.textDim,
                    border: `1px solid ${idea.trim() ? colors.neonPink : colors.border}`,
                    borderRadius: '2px',
                    cursor: idea.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: idea.trim() ? `0 0 20px ${colors.neonPink}40` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (idea.trim()) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 4px 30px ${colors.neonPink}60`
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = idea.trim() ? `0 0 20px ${colors.neonPink}40` : 'none'
                  }}
                >
                  Analyze →
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Feature highlights - Compact horizontal row */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '800px',
          justifyContent: 'center'
        }}>
          {[
            { icon: '◉', label: 'Market Research', color: colors.neonCyan },
            { icon: '◉', label: 'Competitor Analysis', color: colors.neonPink },
            { icon: '◉', label: 'Risk Assessment', color: colors.neonGreen }
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem 1.25rem',
                background: colors.charcoal,
                border: `1px solid ${colors.surface}`,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = feature.color
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 4px 20px ${feature.color}30`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.surface
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: '1.25rem',
                color: feature.color,
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {feature.icon}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: colors.textPrimary,
                fontFamily: 'JetBrains Mono, monospace',
                whiteSpace: 'nowrap'
              }}>
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcut */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '1px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${colors.neonCyan}80, transparent)`
          }}
        />
      </div>
    </div>
  )
}
