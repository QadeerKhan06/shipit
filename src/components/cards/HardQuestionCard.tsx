'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

export interface HardQuestionCardProps {
  section: SectionName
  question: string
}

/**
 * HardQuestionCard - Display the hard question
 */
export const HardQuestionCard = ({ section, question }: HardQuestionCardProps) => (
  <BaseCard section={section} label="The Hard Question" variant="error">
    <p style={{ color: colors.textPrimary, lineHeight: '1.6' }}>
      {question}
    </p>
  </BaseCard>
)
