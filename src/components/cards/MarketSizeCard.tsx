'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface MarketSizeCardProps {
  section: SectionName
  tam: number
  sam: number
  som: number
}

const formatMarketSize = (value: number): string => {
  if (value >= 1000000000000) return `$${(value / 1000000000000).toFixed(1)}T`
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(value >= 10000000000 ? 0 : 1)}B`
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

/**
 * MarketSizeCard - TAM/SAM/SOM display with arrows
 */
export const MarketSizeCard = ({ section, tam, sam, som }: MarketSizeCardProps) => (
  <BaseCard section={section} label="Market Size (TAM/SAM/SOM)" variant="success">
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', color: colors.cyan, fontWeight: 'bold' }}>
          {formatMarketSize(tam)}
        </div>
        <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>TAM</div>
        <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Total Addressable Market</div>
      </div>
      <div style={{ fontSize: '2rem', color: colors.textDim }}>→</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', color: colors.green, fontWeight: 'bold' }}>
          {formatMarketSize(sam)}
        </div>
        <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>SAM</div>
        <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Serviceable Available Market</div>
      </div>
      <div style={{ fontSize: '2rem', color: colors.textDim }}>→</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', color: colors.magenta, fontWeight: 'bold' }}>
          {formatMarketSize(som)}
        </div>
        <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>SOM</div>
        <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Serviceable Obtainable Market</div>
      </div>
    </div>
  </BaseCard>
)
