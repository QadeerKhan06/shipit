'use client'

import React, { useState, useCallback } from 'react'
import { colors } from './colors'

export interface TooltipData {
  label: string
  value: string | number
  subLabel?: string
  color?: string
}

export interface ChartTooltipProps {
  /** Tooltip content */
  data: TooltipData | null
  /** Position relative to chart container */
  x: number
  y: number
  /** Whether tooltip is visible */
  visible: boolean
}

/**
 * ChartTooltip - Floating tooltip for chart data points
 */
export const ChartTooltip = ({ data, x, y, visible }: ChartTooltipProps) => {
  if (!visible || !data) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-16px',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        border: `1px solid ${data.color || colors.cyan}`,
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 100,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 10px ${data.color || colors.cyan}40`
      }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        color: colors.textSecondary,
        marginBottom: '0.25rem'
      }}>
        {data.label}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: data.color || colors.cyan
      }}>
        {data.value}
      </div>
      {data.subLabel && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: colors.textDim,
          marginTop: '0.25rem'
        }}>
          {data.subLabel}
        </div>
      )}
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        bottom: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `6px solid ${data.color || colors.cyan}`
      }} />
    </div>
  )
}

/**
 * Hook for managing tooltip state
 */
export function useChartTooltip() {
  const [tooltip, setTooltip] = useState<{
    data: TooltipData | null
    x: number
    y: number
    visible: boolean
  }>({
    data: null,
    x: 0,
    y: 0,
    visible: false
  })

  const showTooltip = useCallback((data: TooltipData, x: number, y: number) => {
    setTooltip({ data, x, y, visible: true })
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }, [])

  return { tooltip, showTooltip, hideTooltip }
}
