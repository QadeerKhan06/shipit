'use client'

import React from 'react'
import { colors } from './colors'

interface TerminalBoxProps {
  label?: string
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  glow?: boolean
}

export const TerminalBox = ({
  label,
  children,
  variant = 'default',
  glow = false
}: TerminalBoxProps) => {
  const variantColors = {
    default: colors.textSecondary,
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.cyan
  }

  const color = variantColors[variant]

  return (
    <div
      style={{
        position: 'relative',
        padding: '1rem',
        filter: glow ? 'drop-shadow(0 0 8px rgba(247, 120, 186, 0.3))' : 'none'
      }}
    >
      {/* Box border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid ${color}`,
          pointerEvents: 'none'
        }}
      />

      {/* Inline label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '1rem',
            padding: '0 0.5rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            backgroundColor: colors.background,
            color: color
          }}
        >
          {label}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}
