'use client'

import React, { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SimulationProvider, useSimulation } from '@/contexts/SimulationContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { colors } from '@/components/ui/colors'

// Error component (only for fatal errors)
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

// Dashboard content - always renders DashboardLayout once analysis starts
function DashboardContent() {
  const searchParams = useSearchParams()
  const { startAnalysis, pipelineStatus, error } = useSimulation()
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const idea = searchParams.get('idea')
    if (idea && !hasStartedRef.current) {
      hasStartedRef.current = true
      startAnalysis(idea)
    }
  }, [searchParams, startAnalysis])

  // Only show error state for fatal errors when nothing has loaded
  if (error && pipelineStatus === 'error') {
    return <ErrorState error={error} />
  }

  // Always show the dashboard layout (with skeletons for unloaded sections)
  return <DashboardLayout />
}

// Main page component with Suspense boundary
export default function DashboardPage() {
  return (
    <SimulationProvider>
      <Suspense fallback={
        <div style={{ height: '100vh', backgroundColor: colors.background }} />
      }>
        <DashboardContent />
      </Suspense>
    </SimulationProvider>
  )
}
