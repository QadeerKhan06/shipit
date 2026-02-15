'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type {
  SimulationData,
  SectionName,
  FocusedBox,
  AgentMessage,
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

// Mock data for development
const mockData: SimulationData = {
  name: 'SeniorConnect',
  tagline: 'Bridging generations through meaningful companionship',
  valueProposition: 'Connect university students with local seniors for mutual benefit',
  businessModel: 'Commission-based marketplace (15% platform fee)',
  features: [
    'Video verified profiles',
    'Smart matching algorithm',
    'In-app scheduling & payments',
    'Background checks & safety',
    'Activity tracking & reports'
  ],
  competitors: [
    { name: 'Papa', x: 85, y: 75, funding: '$241M', pricing: 'Premium' },
    { name: 'Care.com', x: 70, y: 60, funding: '$110M', pricing: 'Mid-range' },
    { name: 'Candoo', x: 30, y: 40, funding: '$8M', pricing: 'Affordable' },
    { name: 'GreyMatters', x: 50, y: 20, funding: '$2M', pricing: 'Freemium' },
    { name: 'YOU', x: 45, y: 35, funding: '$0', pricing: 'Your Position' }
  ],
  secondaryCompetitors: [
    { name: 'TaskRabbit', x: 60, y: 45, funding: '$50M', pricing: 'Task-Based' },
    { name: 'Handy', x: 75, y: 55, funding: '$110M', pricing: 'Premium Service' },
    { name: 'Thumbtack', x: 40, y: 30, funding: '$273M', pricing: 'Lead Gen' },
    { name: 'Nextdoor', x: 25, y: 15, funding: '$470M', pricing: 'Free/Ads' },
    { name: 'YOU', x: 45, y: 35, funding: '$0', pricing: 'Your Position' }
  ],
  market: {
    trendsData: [
      { date: '2019', value: 35 },
      { date: '2020', value: 52 },
      { date: '2021', value: 68 },
      { date: '2022', value: 71 },
      { date: '2023', value: 89 },
      { date: '2024', value: 95 }
    ],
    demandTrend: [
      { year: '2019', value: 35 },
      { year: '2020', value: 52 },
      { year: '2021', value: 68 },
      { year: '2022', value: 71 },
      { year: '2023', value: 89 },
      { year: '2024', value: 95 }
    ],
    demandTrendSubtitle: "'Senior companion' search interest",
    workforceSubtitle: "University students available for companion roles",
    workforceCapacity: [
      { city: 'Boston', count: 152000 },
      { city: 'Austin', count: 128000 },
      { city: 'Seattle', count: 98000 },
      { city: 'Denver', count: 87000 },
      { city: 'Portland', count: 76000 }
    ],
    opportunityGap: [
      { year: '2019', demand: 65, supply: 25 },
      { year: '2020', demand: 78, supply: 32 },
      { year: '2021', demand: 85, supply: 38 },
      { year: '2022', demand: 88, supply: 42 },
      { year: '2023', demand: 92, supply: 48 },
      { year: '2024', demand: 95, supply: 52 }
    ],
    fundingTotal: '$450M+',
    jobPostings: 2847,
    userQuotes: [
      {
        platform: 'reddit',
        content: 'My grandma is so lonely since grandpa passed. She needs someone to talk to but we all work full time.',
        insight: 'Validates core pain point - senior loneliness when family is unavailable'
      },
      {
        platform: 'appstore',
        content: 'Love the idea but wish there were more affordable options. Papa is too expensive for weekly visits.',
        insight: 'Price sensitivity - opportunity for competitive pricing model'
      }
    ]
  },
  caseStudies: [
    {
      name: 'CareLinx',
      years: '2011-2019',
      outcome: 'succeeded',
      timeline: [
        { date: '2011', event: 'Launched in SF' },
        { date: '2014', event: 'Raised $7M Series A' },
        { date: '2019', event: 'Acquired by ShareCare' }
      ],
      lesson: 'Focus on trust & safety from day one - background checks critical'
    },
    {
      name: 'Hometeam',
      years: '2016-2018',
      outcome: 'failed',
      timeline: [
        { date: '2016', event: 'Launched in NYC' },
        { date: '2017', event: 'Expanded to 5 cities' },
        { date: '2018', event: 'Shut down' }
      ],
      lesson: 'Scaling too fast without product-market fit led to burnout'
    }
  ],
  strengths: [
    { title: 'GROWING DEMAND', description: 'Search interest up 171% since 2019', source: 'Google Trends' },
    { title: 'LARGE MARKET', description: '54M seniors in US, 70% report loneliness', source: 'AARP Study 2023' },
    { title: 'READY WORKFORCE', description: '2,847 job postings for senior companions', source: 'Indeed' }
  ],
  risks: [
    { title: 'TRUST BARRIER', description: 'Families hesitant to let strangers into homes', source: 'User research' },
    { title: 'VOLUNTEER CHURN', description: 'Students may prioritize higher-paying gigs', source: 'Papa case study' },
    { title: 'REGULATORY RISK', description: 'Healthcare licensing varies by state', source: 'Legal analysis' }
  ],
  hardQuestion: 'Can you build enough trust with families to overcome the "stranger danger" barrier at a price point students will work for?',
  verdict: 'Strong market validation but execution risk is high. Success depends on nailing trust & safety systems and finding the right economic balance.',
  nextSteps: [
    { priority: 'critical', title: 'Interview 20 families', description: 'Understand trust requirements and willingness to pay' },
    { priority: 'critical', title: 'Build MVP matching flow', description: 'Test core hypothesis with minimal features' },
    { priority: 'important', title: 'Research licensing requirements', description: 'Understand state-by-state compliance needs' }
  ],

  // Vision optional
  targetUsers: {
    primary: {
      name: 'Family Decision Makers',
      description: 'Adult children (35-55) managing care for aging parents',
      pains: ['No time for regular visits', 'Guilt about parent loneliness', 'Expensive professional care'],
      gains: ['Peace of mind', 'Affordable solution', 'Regular updates on parent wellbeing']
    },
    secondary: {
      name: 'College Students',
      description: 'Undergrads seeking flexible income + meaningful work',
      pains: ['Limited job flexibility', 'Want meaningful work', 'Need extra income'],
      gains: ['Flexible schedule', 'Feel good factor', 'Competitive hourly rate']
    }
  },
  ahaMoment: 'When a senior receives their first visit and lights up with joy, while the student realizes this is the most fulfilling $20/hour they\'ve ever earned',
  unitEconomicsSnapshot: {
    customerPays: 25,
    platformKeeps: 5,
    workerGets: 20,
    breakdown: 'Senior pays $25/hr → Platform takes $5 (20%) → Student earns $20/hr'
  },
  problemSolutionMap: {
    problem: 'Seniors are lonely, families feel guilty, students need flexible income',
    solution: 'Match vetted students with nearby seniors for regular companionship visits',
    value: 'Seniors get connection, families get peace of mind, students get meaningful work'
  },

  // Market extended
  marketExtended: {
    marketSize: {
      tam: 50000000000,
      sam: 8000000000,
      som: 400000000
    },
    fundingActivity: {
      total: '$450M+',
      recentRounds: [
        { company: 'Papa', amount: '$150M', date: '2021', stage: 'Series C' },
        { company: 'Honor', amount: '$140M', date: '2021', stage: 'Series E' },
        { company: 'Silvernest', amount: '$12M', date: '2022', stage: 'Series A' }
      ]
    },
    jobPostingsTrend: [
      { year: '2020', postings: 1200 },
      { year: '2021', postings: 1850 },
      { year: '2022', postings: 2300 },
      { year: '2023', postings: 2847 },
      { year: '2024', postings: 3100 }
    ],
    regulatoryLandscape: [
      { state: 'CA', complexity: 'High', licensing: 'Required', notes: 'Home Care Services Bureau license needed' },
      { state: 'TX', complexity: 'Medium', licensing: 'Not Required', notes: 'Lighter regulations if non-medical' },
      { state: 'NY', complexity: 'High', licensing: 'Required', notes: 'Strict background check requirements' },
      { state: 'FL', complexity: 'Low', licensing: 'Not Required', notes: 'Friendly regulations' }
    ],
    hypeVsReality: [
      { year: '2019', hype: 35, reality: 28 },
      { year: '2020', hype: 65, reality: 42 },
      { year: '2021', hype: 78, reality: 58 },
      { year: '2022', hype: 85, reality: 71 },
      { year: '2023', hype: 88, reality: 82 },
      { year: '2024', hype: 92, reality: 89 }
    ]
  },

  // Battlefield optional
  strategicPosition: {
    opportunity: 'Affordable, tech-enabled matching sits between premium in-home care (Papa) and basic platforms (Care.com)',
    risk: 'Papa has 10x funding and could easily copy your pricing model or acquire you'
  },
  featureMatrix: {
    features: ['Background Checks', 'Video Verification', 'Smart Matching', 'In-App Payments', 'Activity Reports', '24/7 Support'],
    competitors: [
      { name: 'You', values: [true, true, true, true, true, false] },
      { name: 'Papa', values: [true, true, false, true, true, true] },
      { name: 'Care.com', values: [true, false, false, true, false, false] },
      { name: 'Candoo', values: [true, false, false, false, false, false] }
    ]
  },
  competitorFunding: [
    { date: '2019', competitors: [{ name: 'Papa', value: 8 }, { name: 'Care.com', value: 110 }, { name: 'Honor', value: 20 }] },
    { date: '2020', competitors: [{ name: 'Papa', value: 60 }, { name: 'Care.com', value: 110 }, { name: 'Honor', value: 65 }] },
    { date: '2021', competitors: [{ name: 'Papa', value: 241 }, { name: 'Care.com', value: 110 }, { name: 'Honor', value: 205 }] },
    { date: '2022', competitors: [{ name: 'Papa', value: 241 }, { name: 'Care.com', value: 110 }, { name: 'Honor', value: 205 }] },
    { date: '2023', competitors: [{ name: 'Papa', value: 241 }, { name: 'Care.com', value: 110 }, { name: 'Honor', value: 205 }] }
  ],
  saturationScore: {
    score: 62,
    label: 'Moderately Crowded',
    description: '4-5 major players + 10+ regional competitors. Room for differentiation but requires clear positioning.'
  },
  moatAnalysis: {
    networkEffects: 45,
    brandTrust: 30,
    switchingCosts: 25,
    dataAdvantage: 20,
    regulatoryBarriers: 55
  },

  // History optional
  fatalFlaw: {
    title: 'Scaling Before Unit Economics',
    description: 'Most failures happened when startups expanded to 5+ cities before achieving sustainable unit economics in 1-2 markets. Burn rate exceeded revenue 3:1.',
    example: 'Hometeam expanded to 5 cities with $150K/month burn but only $40K revenue. Ran out of runway in 18 months.'
  },
  successPattern: {
    title: 'Trust-First, Then Scale',
    description: 'Winners like CareLinx spent 2+ years perfecting trust/safety in one market before expanding. Background checks, insurance, and rigorous vetting were non-negotiable.',
    keyMetrics: 'CareLinx: 100% background checks, <2% incident rate, 4.8/5 avg rating before Series A'
  },
  riskBaseline: {
    failed: {
      name: 'Hometeam',
      burnRate: '$150K/mo',
      growthRate: '15% MoM',
      marketCoverage: '5 cities',
      runway: '18 months'
    },
    yourPlan: {
      name: 'Your Roadmap',
      burnRate: '$50K/mo',
      growthRate: '20% MoM',
      marketCoverage: '1-2 cities',
      runway: '24+ months'
    }
  },
  techEvolution: [
    { year: '2010', tech: 'Basic web listings', impact: 'Limited reach, no mobile' },
    { year: '2015', tech: 'Mobile apps + GPS', impact: 'Location-based matching possible' },
    { year: '2020', tech: 'Video verification + AI matching', impact: 'Trust + quality improvements' },
    { year: '2024', tech: 'AI companions + remote monitoring', impact: 'Hybrid human + AI care emerging' }
  ],

  // Verdict optional
  unitEconomics: {
    ltv: 50,
    cac: 15,
    ratio: 3.33,
    paybackMonths: 3,
    grossMargin: 20
  },
  bullBearCase: {
    bull: {
      scenario: 'Strong network effects + trust moat → 30% market share in 3 years',
      outcome: 'Become the "Uber for senior care" - exit for $500M+',
      probability: '25%'
    },
    bear: {
      scenario: 'Papa copies model + undercuts on price → slow growth',
      outcome: 'Struggle to differentiate, plateau at $5M ARR, acqui-hire',
      probability: '35%'
    }
  },
  profitabilityPath: [
    { milestone: 'Launch MVP', months: 0, mrr: 0 },
    { milestone: 'First 100 matches', months: 3, mrr: 5000 },
    { milestone: 'Break even', months: 12, mrr: 50000 },
    { milestone: 'Profitable', months: 18, mrr: 100000 },
    { milestone: 'Scale mode', months: 24, mrr: 250000 }
  ],
  defensibilityScore: {
    networkEffects: 60,
    brandTrust: 45,
    switchingCosts: 35,
    dataAsset: 30,
    scale: 25,
    overallScore: 39,
    label: 'Moderate Moat'
  },
  finalVerdict: {
    recommendation: 'Validate First',
    confidence: 'Medium-High',
    reasoning: 'Strong market signals + proven model, but trust barrier and competitive risks require validation before full build. Run 30-day experiment with 20 families and 10 students.',
    goNoGo: 'GO if validation shows >60% conversion + 4+ star ratings'
  },

  // Advisors
  advisors: [
    {
      id: 'target-customer',
      name: 'Maria Santos',
      title: 'Office Manager',
      company: 'Lives in suburban Boston',
      avatar: 'MS',
      color: '#3fb950',
      bio: '52 years old. Her mother (78) lives alone since her father passed. She works full-time and visits on weekends, but worries about the loneliness in between.',
      expertise: ['Eldercare decisions', 'Family budgeting', 'Trust concerns'],
      openingMessage: "I saw your app... my mom has been so lonely since dad passed. She lights up when anyone visits, but we all work full time. How would this actually work? I'm nervous about strangers visiting her.",
      systemContext: 'You are Maria Santos, a concerned daughter looking for affordable companionship for her elderly mother. You are skeptical but hopeful.',
      voiceGender: 'female'
    },
    {
      id: 'skeptical-vc',
      name: 'James Liu',
      title: 'Partner',
      company: 'Horizon Ventures',
      avatar: 'JL',
      color: '#58a6ff',
      bio: 'Series A investor focused on marketplace businesses. Has seen 4 eldercare startups fail in the last 3 years. Needs to see clear unit economics and a defensible moat.',
      expertise: ['Unit economics', 'Marketplace dynamics', 'Competitive moats'],
      openingMessage: "I've seen 4 eldercare startups pitch me this quarter. Papa raised $241M and Care.com owns the category. Walk me through why you think there's room for another player here.",
      systemContext: 'You are James Liu, a skeptical VC who has seen similar startups fail. You ask tough questions about market size, defensibility, and unit economics.',
      voiceGender: 'male'
    },
    {
      id: 'competitor-customer',
      name: 'Tyler Park',
      title: 'Software Engineer',
      company: 'Uses Papa for 8 months',
      avatar: 'TP',
      color: '#f778ba',
      bio: '29 years old. Has been using Papa to arrange visits for his grandmother. Pays $35/hour. Mostly satisfied but has complaints about consistency and pricing.',
      expertise: ['Papa user experience', 'Pricing sensitivity', 'Companion quality'],
      openingMessage: "Yeah I use Papa for my grandma. It's fine I guess, but honestly $35 an hour adds up fast. And the companions change every time - grandma finally gets comfortable with someone and then they send a different person. Pretty frustrating.",
      systemContext: 'You are Tyler Park, a Papa customer who is somewhat dissatisfied with the price and companion consistency. You are open to alternatives but need convincing.',
      voiceGender: 'male'
    }
  ]
}

// Context type
interface SimulationContextType {
  // Data
  simulation: SimulationData | null
  isLoading: boolean
  error: string | null

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

  // API
  reportId: string | null
  loadSimulation: (idea: string) => Promise<void>
}

const SimulationContext = createContext<SimulationContextType | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  // Data state
  const [simulation, setSimulation] = useState<SimulationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Navigation
  const [activeSection, setActiveSection] = useState<SectionName>('vision')

  // Focus
  const [focusedBox, setFocusedBox] = useState<FocusedBox | null>(null)

  // Optional blocks
  const [enabledBlocks, setEnabledBlocks] = useState<Set<string>>(new Set())

  // Battlefield toggle
  const [currentMarketIndex, setCurrentMarketIndex] = useState<'core' | 'secondary'>('core')

  // Report ID (for MongoDB reference)
  const [reportId, setReportId] = useState<string | null>(null)

  // Agent messages
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    { role: 'agent', content: 'Analysis complete. I\'ve researched 47 competitors, 12 case studies, and analyzed market trends. Ready to help you explore this idea.' }
  ])

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

  const loadSimulation = useCallback(async (idea: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      setSimulation(data.simulation)
      if (data.reportId) {
        setReportId(data.reportId)
      }

      // Use AI-recommended blocks if available, otherwise enable all
      if (data.simulation.recommendedBlocks?.length) {
        setEnabledBlocks(new Set(data.simulation.recommendedBlocks))
      } else {
        setEnabledBlocks(new Set(ALL_OPTIONAL_BLOCKS.map(b => b.id)))
      }

      // Reset to first section
      setActiveSection('vision')
      setFocusedBox(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze idea. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        isLoading,
        error,
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
        reportId,
        loadSimulation
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
