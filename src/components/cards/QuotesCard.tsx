'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import type { SectionName } from '@/types/simulation'
import { BaseCard } from './BaseCard'

interface Quote {
  content: string
  platform: string
  insight: string
  url?: string
}

export interface QuotesCardProps {
  section: SectionName
  label?: string
  quotes: Quote[]
}

// Platform icons as SVG components
const PlatformIcon = ({ platform }: { platform: string }) => {
  const normalizedPlatform = platform.toLowerCase()

  // Reddit icon
  if (normalizedPlatform.includes('reddit')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4500">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    )
  }

  // App Store / iOS icon
  if (normalizedPlatform.includes('app') || normalizedPlatform.includes('ios')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0D96F6">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    )
  }

  // Twitter/X icon
  if (normalizedPlatform.includes('twitter') || normalizedPlatform.includes('x.com')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }

  // LinkedIn icon
  if (normalizedPlatform.includes('linkedin')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  }

  // Hacker News icon
  if (normalizedPlatform.includes('hacker') || normalizedPlatform.includes('hn')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6600">
        <path d="M0 0v24h24V0H0zm12.3 13.5l3.3-6.6h1.5l-4.2 8.2v5.2h-1.8v-5.2L7 6.9h1.5l3.3 6.6h.5z"/>
      </svg>
    )
  }

  // Product Hunt icon
  if (normalizedPlatform.includes('product hunt') || normalizedPlatform.includes('producthunt')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#DA552F">
        <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.8 0-.995-.806-1.8-1.801-1.8zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.319 0 4.2 1.881 4.2 4.2 0 2.321-1.881 4.2-4.2 4.2z"/>
      </svg>
    )
  }

  // Generic quote/forum icon for others
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.textSecondary}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

/**
 * QuotesCard - Display user quotes with platform icons and insights
 */
export const QuotesCard = ({ section, label = 'Ask the Market', quotes }: QuotesCardProps) => (
  <BaseCard
    section={section}
    label={label}
    variant="default"
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {quotes.map((quote, i) => (
        <div
          key={i}
          style={{
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            padding: '1rem'
          }}
        >
          {/* Quote content */}
          <p style={{
            color: colors.textPrimary,
            fontStyle: 'italic',
            marginBottom: '0.75rem',
            lineHeight: '1.5',
            fontSize: '0.9rem'
          }}>
            &quot;{quote.content}&quot;
          </p>

          {/* Platform source with icon */}
          {quote.url ? (
            <a
              href={quote.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <PlatformIcon platform={quote.platform} />
              <span style={{
                fontSize: '0.8rem',
                color: colors.cyan,
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'underline',
                textDecorationColor: `${colors.cyan}40`
              }}>
                {quote.platform} ↗
              </span>
            </a>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <PlatformIcon platform={quote.platform} />
              <span style={{
                fontSize: '0.8rem',
                color: colors.textSecondary,
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {quote.platform}
              </span>
            </div>
          )}

          {/* Insight */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.375rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <span style={{ color: colors.green, fontSize: '0.75rem' }}>→</span>
            <p style={{
              fontSize: '0.8rem',
              color: colors.green,
              margin: 0,
              lineHeight: '1.4'
            }}>
              {quote.insight}
            </p>
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
)
