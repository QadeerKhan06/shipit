'use client'

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'
import type {
  SimulationData,
  SectionName,
  FocusedBox,
  AgentMessage,
  PipelineStatus,
  SectionLoadStatus,
  PipelineMessage,
  OptionalBlocksBySection
} from '@/types/simulation'

// Optional block definitions
export const OPTIONAL_BLOCKS_BY_SECTION: OptionalBlocksBySection = {
  vision: [
    { id: 'vision-target-users', label: 'Target Users' }
  ],
  market: [
    { id: 'market-regulatory', label: 'Regulatory Landscape' },
    { id: 'market-hype-reality', label: 'Hype vs Reality Check' }
  ],
  battlefield: [
    { id: 'battlefield-feature-matrix', label: 'Feature Comparison Matrix' },
    { id: 'battlefield-funding-velocity', label: 'Funding Velocity' },
    { id: 'battlefield-saturation', label: 'Market Saturation Score' },
    { id: 'battlefield-moat-analysis', label: 'Trust/Moat Analysis' },
    { id: 'battlefield-case-studies', label: 'Case Studies' }
  ],
  verdict: [
    { id: 'verdict-bull-bear', label: 'Bull vs Bear Case' },
    { id: 'verdict-profitability-path', label: 'Path to Profitability' },
    { id: 'verdict-defensibility', label: 'Defensibility Score' },
    { id: 'verdict-fatal-flaw', label: 'Fatal Flaw Analysis' }
  ],
  advisors: [
    { id: 'advisors-competitor-user', label: "Competitor's Customer" }
  ]
}

export const ALL_OPTIONAL_BLOCKS = Object.values(OPTIONAL_BLOCKS_BY_SECTION).flat()

const SECTIONS: SectionName[] = ['vision', 'market', 'battlefield', 'verdict', 'advisors']

// Research source type (from raw search results)
interface ResearchSource {
  title: string
  snippet: string
  link: string
}

// Context type
interface SimulationContextType {
  // Data (progressive — starts empty, fills in per section)
  simulation: Partial<SimulationData> | null
  pipelineStatus: PipelineStatus
  sectionStatus: Record<SectionName, SectionLoadStatus>
  pipelineMessages: PipelineMessage[]
  error: string | null
  researchSources: ResearchSource[]

  // Navigation
  activeSection: SectionName
  setActiveSection: (section: SectionName) => void

  // Focus state
  focusedBox: FocusedBox | null
  setFocusedBox: (box: FocusedBox | null) => void

  // Optional blocks
  enabledBlocks: Set<string>
  toggleBlock: (blockId: string) => void
  shouldShowBlock: (blockId: string) => boolean
  enableAllBlocks: () => void
  disableAllBlocks: () => void

  // Battlefield toggle
  currentMarketIndex: 'core' | 'secondary'
  setCurrentMarketIndex: (index: 'core' | 'secondary') => void

  // Agent panel
  agentMessages: AgentMessage[]
  addAgentMessage: (message: AgentMessage) => void
  sendAgentMessage: (message: string, focusedBlock?: { section: string; label: string }) => Promise<void>
  isAgentThinking: boolean

  // API
  reportId: string | null
  startAnalysis: (idea: string) => void
  isSectionReady: (section: SectionName) => boolean
  regenerateSections: (sections: SectionName[], editInstruction: string) => Promise<void>

  // Deploying state
  isDeploying: boolean
}

const SimulationContext = createContext<SimulationContextType | null>(null)

function makeInitialSectionStatus(): Record<SectionName, SectionLoadStatus> {
  return { vision: 'pending', market: 'pending', battlefield: 'pending', verdict: 'pending', advisors: 'pending' }
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  // Data state (progressive)
  const [simulation, setSimulation] = useState<Partial<SimulationData> | null>(null)
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle')
  const [sectionStatus, setSectionStatus] = useState<Record<SectionName, SectionLoadStatus>>(makeInitialSectionStatus)
  const [pipelineMessages, setPipelineMessages] = useState<PipelineMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [researchSources, setResearchSources] = useState<ResearchSource[]>([])

  // Navigation
  const [activeSection, setActiveSection] = useState<SectionName>('vision')

  // Focus
  const [focusedBox, setFocusedBox] = useState<FocusedBox | null>(null)

  // Optional blocks
  const [enabledBlocks, setEnabledBlocks] = useState<Set<string>>(new Set())

  // Battlefield toggle
  const [currentMarketIndex, setCurrentMarketIndex] = useState<'core' | 'secondary'>('core')

  // Report ID
  const [reportId, setReportId] = useState<string | null>(null)

  // Agent messages
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const [isAgentThinking, setIsAgentThinking] = useState(false)

  // Deploying
  const [isDeploying, setIsDeploying] = useState(false)

  // Track whether first section navigated to
  const hasNavigatedRef = useRef(false)

  // Refs for sendAgentMessage to read latest state without re-creating
  const simulationRef = useRef(simulation)
  simulationRef.current = simulation
  const researchSourcesRef = useRef(researchSources)
  researchSourcesRef.current = researchSources
  const focusedBoxRef = useRef(focusedBox)
  focusedBoxRef.current = focusedBox

  const toggleBlock = useCallback((blockId: string) => {
    setEnabledBlocks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(blockId)) {
        newSet.delete(blockId)
      } else {
        newSet.add(blockId)
      }
      return newSet
    })
  }, [])

  const shouldShowBlock = useCallback((blockId: string) => {
    return enabledBlocks.has(blockId)
  }, [enabledBlocks])

  const enableAllBlocks = useCallback(() => {
    setEnabledBlocks(new Set(ALL_OPTIONAL_BLOCKS.map(b => b.id)))
  }, [])

  const disableAllBlocks = useCallback(() => {
    setEnabledBlocks(new Set())
  }, [])

  const addAgentMessage = useCallback((message: AgentMessage) => {
    setAgentMessages(prev => [...prev, message])
  }, [])

  const addPipelineMessage = useCallback((msg: Omit<PipelineMessage, 'id' | 'timestamp'>) => {
    const pipelineMsg: PipelineMessage = {
      id: `pm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...msg,
    }
    setPipelineMessages(prev => [...prev, pipelineMsg])
  }, [])

  const isSectionReady = useCallback((section: SectionName) => {
    return sectionStatus[section] === 'complete'
  }, [sectionStatus])

  // Mark sections as loading when generation starts
  const markSectionsLoading = useCallback((sections: SectionName[]) => {
    setSectionStatus(prev => {
      const next = { ...prev }
      for (const s of sections) next[s] = 'loading'
      return next
    })
  }, [])

  // Merge section payload into simulation
  const updateSection = useCallback((section: SectionName, payload: Partial<SimulationData>) => {
    setSimulation(prev => ({ ...prev, ...payload }))
    setSectionStatus(prev => ({ ...prev, [section]: 'complete' }))
  }, [])

  // ========== SHARED AGENT SEND ==========
  const sendAgentMessage = useCallback(async (
    message: string,
    focusedBlock?: { section: string; label: string }
  ) => {
    const sim = simulationRef.current
    if (!sim) return

    setAgentMessages(prev => [...prev, { role: 'user', content: message }])
    setIsAgentThinking(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          currentData: sim,
          focusedBlock: focusedBlock || (focusedBoxRef.current ? { section: focusedBoxRef.current.section, label: focusedBoxRef.current.label } : undefined),
          sources: researchSourcesRef.current,
        })
      })

      if (!response.ok) throw new Error('Agent request failed')

      const data = await response.json()

      if (data.type === 'edit' && data.affectedSections) {
        setAgentMessages(prev => [...prev, {
          role: 'agent',
          content: data.response,
          metadata: {
            type: 'edit',
            affectedSections: data.affectedSections,
            editDescription: data.editDescription,
            editInstruction: data.editInstruction || data.editDescription || message,
          }
        }])
      } else {
        setAgentMessages(prev => [...prev, { role: 'agent', content: data.response }])
      }
    } catch (err) {
      console.error('Agent error:', err)
      setAgentMessages(prev => [...prev, { role: 'agent', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsAgentThinking(false)
    }
  }, [])

  // ========== STREAMING ANALYSIS ==========
  const startAnalysis = useCallback((idea: string) => {
    // Reset state
    setSimulation({})
    setPipelineStatus('researching')
    setSectionStatus(makeInitialSectionStatus())
    setPipelineMessages([])
    setError(null)
    setReportId(null)
    setAgentMessages([])
    setResearchSources([])
    setFocusedBox(null)
    setActiveSection('vision')
    hasNavigatedRef.current = false

    addPipelineMessage({ message: 'Starting analysis...', status: 'in_progress' })

    // Start streaming fetch
    fetch('/api/analyze/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea }),
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Analysis failed')
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const { event, data } = JSON.parse(line)
              handleStreamEvent(event, data)
            } catch {
              // Skip unparseable lines
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.trim()) {
          try {
            const { event, data } = JSON.parse(buffer)
            handleStreamEvent(event, data)
          } catch {
            // Skip
          }
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
        setPipelineStatus('error')
        addPipelineMessage({ message: err instanceof Error ? err.message : 'Analysis failed', status: 'error' })
      })

    function handleStreamEvent(event: string, data: Record<string, unknown>) {
      switch (event) {
        case 'stage': {
          const stage = data.stage as string
          const message = data.message as string
          if (stage === 'researching') {
            setPipelineStatus('researching')
          } else if (stage === 'generating' || stage === 'generating_verdict' || stage === 'generating_advisors') {
            setPipelineStatus('generating')
            // Mark relevant sections as loading
            if (stage === 'generating') {
              markSectionsLoading(['vision', 'market', 'battlefield'])
            } else if (stage === 'generating_verdict') {
              markSectionsLoading(['verdict'])
            } else if (stage === 'generating_advisors') {
              markSectionsLoading(['advisors'])
            }
          }
          addPipelineMessage({ message, status: 'in_progress', section: data.section as SectionName | undefined })
          break
        }

        case 'progress': {
          const message = data.message as string
          addPipelineMessage({ message, status: 'in_progress' })
          break
        }

        case 'research_complete': {
          const count = data.searchResultCount as number
          const competitors = data.competitorsFound as number
          // Store research sources for agent citations
          if (Array.isArray(data.sources)) {
            setResearchSources(data.sources as ResearchSource[])
          }
          addPipelineMessage({
            message: `Research complete — ${count} sources, ${competitors} competitors found`,
            status: 'complete',
          })
          break
        }

        case 'section_complete': {
          const section = data.section as SectionName
          const payload = data.payload as Partial<SimulationData>
          updateSection(section, payload)
          addPipelineMessage({
            message: `${section.charAt(0).toUpperCase() + section.slice(1)} section ready`,
            status: 'complete',
            section,
          })

          // Auto-navigate to first completed section
          if (!hasNavigatedRef.current) {
            setActiveSection(section)
            hasNavigatedRef.current = true
          }

          // When verdict arrives, apply recommended blocks
          if (section === 'verdict' && payload.recommendedBlocks?.length) {
            setEnabledBlocks(new Set(payload.recommendedBlocks))
          }
          break
        }

        case 'complete': {
          setPipelineStatus('complete')
          if (data.reportId) setReportId(data.reportId as string)
          addPipelineMessage({ message: 'Analysis complete', status: 'complete' })

          // Add agent welcome message
          setAgentMessages(prev => [...prev, {
            role: 'agent' as const,
            content: 'Analysis complete. Ask me anything about the results — I can explain any section, dive deeper into the data, or help you refine your strategy.',
          }])
          break
        }

        case 'error': {
          setPipelineStatus('error')
          setError(data.message as string)
          addPipelineMessage({ message: data.message as string, status: 'error' })
          // Mark any loading sections as error
          setSectionStatus(prev => {
            const next = { ...prev }
            for (const s of SECTIONS) {
              if (next[s] === 'loading' || next[s] === 'pending') next[s] = 'error'
            }
            return next
          })
          break
        }
      }
    }
  }, [addPipelineMessage, markSectionsLoading, updateSection])

  // ========== SELECTIVE REGENERATION ==========
  const regenerateSections = useCallback(async (sections: SectionName[], editInstruction: string) => {
    if (!simulation) return
    setIsDeploying(true)

    // Mark affected sections as loading
    markSectionsLoading(sections)
    addPipelineMessage({
      message: `Regenerating ${sections.join(', ')}...`,
      status: 'in_progress',
    })

    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections,
          currentData: simulation,
          editInstruction,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Regeneration failed')
      }

      const { updates } = await response.json() as { updates: Record<string, Partial<SimulationData>> }

      // Merge all updates
      for (const [section, payload] of Object.entries(updates)) {
        updateSection(section as SectionName, payload)
      }

      addPipelineMessage({
        message: `Changes deployed to ${sections.join(', ')}`,
        status: 'complete',
      })

      // Add agent confirmation
      addAgentMessage({
        role: 'system',
        content: `Changes deployed successfully to: ${sections.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`,
      })
    } catch (err) {
      // Mark sections as error
      setSectionStatus(prev => {
        const next = { ...prev }
        for (const s of sections) next[s] = 'error'
        return next
      })
      addPipelineMessage({
        message: err instanceof Error ? err.message : 'Regeneration failed',
        status: 'error',
      })
    } finally {
      setIsDeploying(false)
    }
  }, [simulation, markSectionsLoading, updateSection, addPipelineMessage, addAgentMessage])

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        pipelineStatus,
        sectionStatus,
        pipelineMessages,
        error,
        researchSources,
        activeSection,
        setActiveSection,
        focusedBox,
        setFocusedBox,
        enabledBlocks,
        toggleBlock,
        shouldShowBlock,
        enableAllBlocks,
        disableAllBlocks,
        currentMarketIndex,
        setCurrentMarketIndex,
        agentMessages,
        addAgentMessage,
        sendAgentMessage,
        isAgentThinking,
        reportId,
        startAnalysis,
        isSectionReady,
        regenerateSections,
        isDeploying,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
