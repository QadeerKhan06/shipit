'use client'

import React from 'react'
import { colors } from '@/components/ui/colors'
import { LeftNav } from './LeftNav'
import { AgentPanel } from './AgentPanel'
import { useSimulation } from '@/contexts/SimulationContext'
import { SectionSkeleton } from '@/components/ui/SectionSkeleton'
import type { SectionName } from '@/types/simulation'

// ============================================================================
// LAZY-LOADED SECTIONS (code-splitting for performance)
// ============================================================================
const VisionSection = React.lazy(() => import('@/components/sections/VisionSection').then(m => ({ default: m.VisionSection })))
const MarketSection = React.lazy(() => import('@/components/sections/MarketSection').then(m => ({ default: m.MarketSection })))
const BattlefieldSection = React.lazy(() => import('@/components/sections/BattlefieldSection').then(m => ({ default: m.BattlefieldSection })))
const VerdictSection = React.lazy(() => import('@/components/sections/VerdictSection').then(m => ({ default: m.VerdictSection })))
const AdvisorsSection = React.lazy(() => import('@/components/sections/AdvisorsSection').then(m => ({ default: m.AdvisorsSection })))

// ============================================================================
// STYLES
// ============================================================================
const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

  /* Animations */
  @keyframes pulse-glow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(247, 120, 186, 0.4)); }
    50% { filter: drop-shadow(0 0 12px rgba(247, 120, 186, 0.6)); }
  }
  @keyframes pulse-ring {
    0%, 100% { stroke-opacity: 0.6; }
    50% { stroke-opacity: 1; }
  }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }

  /* Skeleton shimmer animation */
  @keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skeleton-shimmer {
    animation: skeleton-shimmer 2s ease-in-out infinite;
  }

  /* Skeleton border pulse */
  @keyframes skeleton-border-pulse {
    0%, 100% { border-color: rgba(48, 54, 61, 0.5); }
    50% { border-color: rgba(88, 166, 255, 0.15); }
  }
  .skeleton-border-pulse > div:first-child {
    animation: skeleton-border-pulse 2.5s ease-in-out infinite;
  }

  /* Section update flash */
  @keyframes section-updated {
    0% { background-color: rgba(63, 185, 80, 0.08); }
    100% { background-color: transparent; }
  }
  .section-updated {
    animation: section-updated 1.5s ease-out;
  }

  /* Loading spinner */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .loading-spin { animation: spin 1s linear infinite; }

  /* Form elements */
  input::placeholder { color: #484f58; transition: color 0.2s; }
  input:focus::placeholder { color: #8b949e; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #161b22; }
  ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #484f58; }

  /* Clickable boxes (for focus state) */
  .clickable-box {
    cursor: pointer;
    transition: background-color 0.2s ease;
    padding: 0.5rem;
    margin: -0.5rem;
    border-radius: 4px;
  }
  .clickable-box:hover { background-color: rgba(22, 27, 34, 0.5); }
  .clickable-box.selected { background-color: rgba(22, 27, 34, 0.4); }
`

// ============================================================================
// SECTION RENDERER (with skeleton fallback)
// ============================================================================
const SectionContent = ({ activeSection }: { activeSection: SectionName }) => {
  const { isSectionReady } = useSimulation()

  if (!isSectionReady(activeSection)) {
    return <SectionSkeleton section={activeSection} />
  }

  switch (activeSection) {
    case 'vision': return <VisionSection />
    case 'market': return <MarketSection />
    case 'battlefield': return <BattlefieldSection />
    case 'verdict': return <VerdictSection />
    case 'advisors': return <AdvisorsSection />
    default: return <VisionSection />
  }
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================
export const DashboardLayout = () => {
  const { activeSection } = useSimulation()

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: colors.background,
      color: colors.textPrimary,
    }}>
      <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />

      {/* LEFT NAV */}
      <LeftNav />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '2rem' }}>
          <React.Suspense fallback={<SectionSkeleton section={activeSection} />}>
            <SectionContent activeSection={activeSection} />
          </React.Suspense>
        </div>
      </main>

      {/* AGENT PANEL - 30% */}
      <AgentPanel />
    </div>
  )
}
