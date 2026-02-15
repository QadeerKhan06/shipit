'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface TextCardProps {
  section: SectionName
  label: string
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
  text: string
  italic?: boolean
}

/**
 * TextCard - Simple card with a single text paragraph
 * Used for: Value Proposition, Business Model, Aha Moment
 */
export const TextCard = ({ section, label, variant = 'default', text, italic }: TextCardProps) => (
  <BaseCard section={section} label={label} variant={variant}>
    <p style={{
      color: colors.textPrimary,
      lineHeight: '1.6',
      fontStyle: italic ? 'italic' : 'normal',
    }}>
      {italic ? `"${text}"` : text}
    </p>
  </BaseCard>
)
