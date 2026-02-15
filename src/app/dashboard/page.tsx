'use client'

import React, { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SimulationProvider, useSimulation } from '@/contexts/SimulationContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { colors } from '@/components/ui/colors'

// Loading component
const LoadingState = () => (
  <div style={{
    height: '100vh',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem'
  }}>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loading-dot {
        animation: pulse 1.5s ease-in-out infinite;
      }
      .loading-spinner {
        animation: spin 1s linear infinite;
      }
    `}</style>

    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
      <div
        className="loading-spinner"
        style={{
          width: '60px',
          height: '60px',
          border: `3px solid ${colors.border}`,
          borderTop: `3px solid ${colors.magenta}`,
          borderRadius: '50%'
        }}
      />
    </div>

    <div style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.cyan, fontSize: '1rem' }}>
      Analyzing your idea<span className="loading-dot">...</span>
    </div>

    <div style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.textDim, fontSize: '0.75rem', maxWidth: '300px', textAlign: 'center' }}>
      Researching competitors, market trends, and case studies
    </div>
  </div>
)

// Error component
const ErrorState = ({ error }: { error: string }) => (
  <div style={{
    height: '100vh',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
  }}>
    <div style={{ fontSize: '3rem' }}>⚠️</div>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.red, fontSize: '1rem' }}>
      {error}
    </div>
    <a
      href="/"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: colors.cyan,
        fontSize: '0.875rem',
        textDecoration: 'underline'
      }}
    >
      ← Try again
    </a>
  </div>
)

// Dashboard content component
function DashboardContent() {
  const searchParams = useSearchParams()
  const { loadSimulation, simulation, isLoading, error } = useSimulation()
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const idea = searchParams.get('idea')
    if (idea && !hasStartedRef.current) {
      hasStartedRef.current = true
      loadSimulation(idea)
    }
  }, [searchParams, loadSimulation])

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!simulation) {
    return <LoadingState />
  }

  return <DashboardLayout />
}

// Main page component with Suspense boundary
export default function DashboardPage() {
  return (
    <SimulationProvider>
      <Suspense fallback={<LoadingState />}>
        <DashboardContent />
      </Suspense>
    </SimulationProvider>
  )
}
