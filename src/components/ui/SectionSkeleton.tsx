'use client'

import React from 'react'
import { colors } from './colors'
import type { SectionName } from '@/types/simulation'

const SkeletonLine = ({ width = '100%', height = '0.75rem', style }: {
  width?: string
  height?: string
  style?: React.CSSProperties
}) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      background: `linear-gradient(90deg, ${colors.surface} 25%, rgba(88,166,255,0.08) 50%, ${colors.surface} 75%)`,
      backgroundSize: '200% 100%',
      borderRadius: '2px',
      ...style,
    }}
  />
)

const SkeletonBox = ({ label, children, height }: {
  label: string
  children?: React.ReactNode
  height?: string
}) => (
  <div
    className="skeleton-border-pulse"
    style={{
      position: 'relative',
      padding: '1rem',
      minHeight: height,
    }}
  >
    <div style={{
      position: 'absolute',
      inset: 0,
      border: `1px solid ${colors.border}`,
      pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute',
      top: '-10px',
      left: '1rem',
      padding: '0 0.5rem',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.75rem',
      backgroundColor: colors.background,
      color: colors.textDim,
    }}>
      {label}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
      {children || (
        <>
          <SkeletonLine width="85%" />
          <SkeletonLine width="65%" />
          <SkeletonLine width="75%" />
        </>
      )}
    </div>
  </div>
)

const VisionSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <SkeletonLine width="35%" height="1.75rem" />
      <SkeletonLine width="55%" height="1rem" style={{ marginTop: '0.5rem' }} />
    </div>
    <SkeletonBox label="Value Proposition">
      <SkeletonLine width="90%" />
      <SkeletonLine width="70%" />
    </SkeletonBox>
    <SkeletonBox label="Business Model">
      <SkeletonLine width="80%" />
    </SkeletonBox>
    <SkeletonBox label="Key Features">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <SkeletonLine width="80%" />
        <SkeletonLine width="70%" />
        <SkeletonLine width="60%" />
        <SkeletonLine width="75%" />
      </div>
    </SkeletonBox>
  </div>
)

const MarketSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <SkeletonLine width="30%" height="1.75rem" />
      <SkeletonLine width="50%" height="1rem" style={{ marginTop: '0.5rem' }} />
    </div>
    <SkeletonBox label="Demand Trend" height="220px">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '160px', paddingTop: '1rem' }}>
        {[40, 55, 65, 75, 85, 92].map((h, i) => (
          <SkeletonLine key={i} width="12%" height={`${h}%`} />
        ))}
      </div>
    </SkeletonBox>
    <SkeletonBox label="Workforce Capacity" height="180px">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '130px' }}>
        {[70, 90, 50, 60].map((h, i) => (
          <SkeletonLine key={i} width="18%" height={`${h}%`} />
        ))}
      </div>
    </SkeletonBox>
    <SkeletonBox label="Market Opportunity Gap" height="180px">
      <SkeletonLine width="100%" height="120px" />
    </SkeletonBox>
    <SkeletonBox label="Ask the Market">
      <SkeletonLine width="90%" />
      <SkeletonLine width="75%" />
      <SkeletonLine width="85%" />
    </SkeletonBox>
  </div>
)

const BattlefieldSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <SkeletonLine width="35%" height="1.75rem" />
      <SkeletonLine width="55%" height="1rem" style={{ marginTop: '0.5rem' }} />
    </div>
    <SkeletonBox label="Competitive Positioning" height="250px">
      <SkeletonLine width="100%" height="200px" />
    </SkeletonBox>
    <SkeletonBox label="Strategic Gap / Risk">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonLine width="60%" />
          <SkeletonLine width="90%" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonLine width="55%" />
          <SkeletonLine width="85%" />
        </div>
      </div>
    </SkeletonBox>
    <SkeletonBox label="Case Studies">
      <SkeletonLine width="80%" />
      <SkeletonLine width="65%" />
      <SkeletonLine width="70%" />
    </SkeletonBox>
  </div>
)

const VerdictSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <SkeletonLine width="25%" height="1.75rem" />
      <SkeletonLine width="45%" height="1rem" style={{ marginTop: '0.5rem' }} />
    </div>
    <SkeletonBox label="GO / NO-GO">
      <SkeletonLine width="30%" height="2rem" />
      <SkeletonLine width="80%" />
    </SkeletonBox>
    <SkeletonBox label="The Hard Question">
      <SkeletonLine width="70%" height="1.25rem" />
    </SkeletonBox>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <SkeletonBox label="Strengths">
        <SkeletonLine width="70%" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="60%" />
      </SkeletonBox>
      <SkeletonBox label="Risks">
        <SkeletonLine width="65%" />
        <SkeletonLine width="80%" />
        <SkeletonLine width="75%" />
      </SkeletonBox>
    </div>
    <SkeletonBox label="Unit Economics">
      <div style={{ display: 'flex', gap: '2rem' }}>
        <SkeletonLine width="20%" height="2rem" />
        <SkeletonLine width="20%" height="2rem" />
        <SkeletonLine width="20%" height="2rem" />
      </div>
    </SkeletonBox>
  </div>
)

const AdvisorsSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <SkeletonLine width="25%" height="1.75rem" />
      <SkeletonLine width="50%" height="1rem" style={{ marginTop: '0.5rem' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <SkeletonBox key={i} label={`Advisor ${i}`} height="180px">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="skeleton-shimmer" style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `linear-gradient(90deg, ${colors.surface} 25%, rgba(88,166,255,0.08) 50%, ${colors.surface} 75%)`,
              backgroundSize: '200% 100%', flexShrink: 0,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              <SkeletonLine width="50%" />
              <SkeletonLine width="70%" />
            </div>
          </div>
          <SkeletonLine width="90%" style={{ marginTop: '0.75rem' }} />
          <SkeletonLine width="75%" />
        </SkeletonBox>
      ))}
    </div>
  </div>
)

const skeletonMap: Record<SectionName, React.FC> = {
  vision: VisionSkeleton,
  market: MarketSkeleton,
  battlefield: BattlefieldSkeleton,
  verdict: VerdictSkeleton,
  advisors: AdvisorsSkeleton,
}

export const SectionSkeleton = ({ section }: { section: SectionName }) => {
  const Component = skeletonMap[section]
  return <Component />
}
