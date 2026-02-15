'use client'

import React, { useState, useRef, useEffect } from 'react'

// Optional block definitions (inline to avoid import issues)
const OPTIONAL_BLOCKS_BY_SECTION = {
  vision: [
    { id: 'vision-target-users', label: 'Target Users' },
    { id: 'vision-aha-moment', label: 'Aha Moment' },
    { id: 'vision-unit-economics-snapshot', label: 'Unit Economics Snapshot' },
    { id: 'vision-problem-solution-map', label: 'Problem→Solution Map' }
  ],
  market: [
    { id: 'market-size', label: 'Market Size (TAM/SAM/SOM)' },
    { id: 'market-regulatory', label: 'Regulatory Landscape' },
    { id: 'market-hype-reality', label: 'Hype vs Reality Check' }
  ],
  battlefield: [
    { id: 'battlefield-feature-matrix', label: 'Feature Comparison Matrix' },
    { id: 'battlefield-funding-velocity', label: 'Funding Velocity' },
    { id: 'battlefield-saturation', label: 'Market Saturation Score' },
    { id: 'battlefield-moat-analysis', label: 'Trust/Moat Analysis' }
  ],
  history: [
    { id: 'history-fatal-flaw', label: 'Fatal Flaw Analysis' },
    { id: 'history-success-pattern', label: 'Success Pattern' },
    { id: 'history-risk-baseline', label: 'Risk Baseline Comparison' },
    { id: 'history-tech-evolution', label: 'Technology Evolution' }
  ],
  verdict: [
    { id: 'verdict-bull-bear', label: 'Bull vs Bear Case' },
    { id: 'verdict-profitability-path', label: 'Path to Profitability' },
    { id: 'verdict-defensibility', label: 'Defensibility Score' },
    { id: 'verdict-final-verdict', label: 'Final Verdict' }
  ],
  nextmoves: [
    { id: 'nextmoves-30day-sprint', label: '30-Day Sprint Plan' },
    { id: 'nextmoves-acquisition-strategy', label: 'Acquisition Strategy' },
    { id: 'nextmoves-funding-roadmap', label: 'Funding Roadmap' }
  ]
}

const ALL_OPTIONAL_BLOCKS = Object.values(OPTIONAL_BLOCKS_BY_SECTION).flat()

// Mock data for the prototype
const mockData = {
  simulation: {
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
      workforceCapacity: [
        { city: 'Boston', students: 152000 },
        { city: 'Austin', students: 128000 },
        { city: 'Seattle', students: 98000 },
        { city: 'Denver', students: 87000 },
        { city: 'Portland', students: 76000 }
      ],
      opportunityGap: [
        { year: '2019', loneliness: 65, solutions: 25 },
        { year: '2020', loneliness: 78, solutions: 32 },
        { year: '2021', loneliness: 85, solutions: 38 },
        { year: '2022', loneliness: 88, solutions: 42 },
        { year: '2023', loneliness: 92, solutions: 48 },
        { year: '2024', loneliness: 95, solutions: 52 }
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
        outcome: 'succeeded' as const,
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
        outcome: 'failed' as const,
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
      { priority: 'critical' as const, title: 'Interview 20 families', description: 'Understand trust requirements and willingness to pay' },
      { priority: 'critical' as const, title: 'Build MVP matching flow', description: 'Test core hypothesis with minimal features' },
      { priority: 'important' as const, title: 'Research licensing requirements', description: 'Understand state-by-state compliance needs' }
    ],

    // ========== OPTIONAL BLOCK DATA ==========

    // Vision Optional Blocks
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

    // Market Optional Blocks (extend existing market object after this)
    marketExtended: {
      marketSize: {
        tam: 50000000000,  // $50B - Total senior care market
        sam: 8000000000,   // $8B - Companion care segment
        som: 400000000     // $400M - Realistic 3-year target
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

    // Battlefield Optional Blocks
    strategicPosition: {
      opportunity: 'Affordable, tech-enabled matching sits between premium in-home care (Papa) and basic platforms (Care.com)',
      risk: 'Papa has 10x funding and could easily copy your pricing model or acquire you'
    },
    featureMatrix: {
      features: ['Background Checks', 'Video Verification', 'Smart Matching', 'In-App Payments', 'Activity Reports', '24/7 Support'],
      you: [true, true, true, true, true, false],
      papa: [true, true, false, true, true, true],
      careDotCom: [true, false, false, true, false, false],
      candoo: [true, false, false, false, false, false]
    },
    competitorFunding: [
      { date: '2019', papa: 8, careDotCom: 110, honor: 20 },
      { date: '2020', papa: 60, careDotCom: 110, honor: 65 },
      { date: '2021', papa: 241, careDotCom: 110, honor: 205 },
      { date: '2022', papa: 241, careDotCom: 110, honor: 205 },
      { date: '2023', papa: 241, careDotCom: 110, honor: 205 }
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

    // History Optional Blocks
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

    // Verdict Optional Blocks
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

    // Next Moves Optional Blocks
    validationChecklist: [
      { item: 'Interview 20 families about trust requirements', completed: false, priority: 'critical' },
      { item: 'Survey 30 students about interest + pricing', completed: false, priority: 'critical' },
      { item: 'Test manual matching with 5 pairs', completed: false, priority: 'critical' },
      { item: 'Validate background check costs + timeline', completed: false, priority: 'important' },
      { item: 'Check insurance requirements', completed: false, priority: 'important' }
    ],
    sprintPlan: [
      { week: 1, goal: 'Customer Discovery', tasks: ['Interview 10 families', 'Survey 20 students'], metrics: 'Pain/gain validation' },
      { week: 2, goal: 'Manual MVP', tasks: ['Match 3 pairs manually', 'Observe first visits'], metrics: 'Satisfaction scores' },
      { week: 3, goal: 'Economics Test', tasks: ['Test pricing sensitivity', 'Measure acquisition cost'], metrics: 'Willingness to pay' },
      { week: 4, goal: 'Decision Point', tasks: ['Analyze results', 'Go/No-Go decision'], metrics: 'Hit 3/4 validation targets' }
    ],
    acquisitionStrategy: [
      { channel: 'Senior center partnerships', cac: 8, ltv: 50, volume: 100, viability: 'High' },
      { channel: 'Facebook ads (seniors)', cac: 22, ltv: 50, volume: 500, viability: 'Medium' },
      { channel: 'College campus flyering', cac: 3, ltv: 30, volume: 200, viability: 'High' },
      { channel: 'Next door local posts', cac: 5, ltv: 40, volume: 150, viability: 'High' }
    ],
    fundingRoadmap: {
      approach: 'Bootstrap → Angel → Seed',
      milestones: [
        { stage: 'Bootstrap', amount: '$50K', timing: 'Month 0', goal: 'MVP + first 50 matches' },
        { stage: 'Angel Round', amount: '$250K', timing: 'Month 6', goal: 'Prove unit economics in 1 city' },
        { stage: 'Seed Round', amount: '$1.5M', timing: 'Month 12', goal: 'Expand to 3 cities + team' }
      ]
    }
  }
}

type SectionName = 'vision' | 'market' | 'battlefield' | 'history' | 'verdict' | 'nextmoves'

// Color palette matching rallies.ai
const colors = {
  background: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textDim: '#484f58',
  cyan: '#58a6ff',
  magenta: '#f778ba',
  green: '#3fb950',
  amber: '#d29922',
  red: '#f85149'
}

// Terminal Box Component with inline label
const TerminalBox = ({
  label,
  children,
  variant = 'default',
  glow = false
}: {
  label?: string
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  glow?: boolean
}) => {
  const variantColors = {
    default: colors.textSecondary,
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.cyan
  }

  const color = variantColors[variant]

  return (
    <div
      style={{
        position: 'relative',
        padding: '1rem',
        filter: glow ? 'drop-shadow(0 0 8px rgba(247, 120, 186, 0.3))' : 'none'
      }}
    >
      {/* Box border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid ${color}`,
          pointerEvents: 'none'
        }}
      />

      {/* Inline label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '1rem',
            padding: '0 0.5rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            backgroundColor: colors.background,
            color: color
          }}
        >
          {label}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

export default function ShipItDashboard() {
  const [activeSection, setActiveSection] = useState<SectionName>('battlefield')
  const [focusedSection, setFocusedSection] = useState<SectionName | null>(null)
  const [focusedBox, setFocusedBox] = useState<{ section: SectionName; label: string } | null>(null)
  const [currentMarketIndex, setCurrentMarketIndex] = useState<'core' | 'secondary'>('core')
  const [agentMessages, setAgentMessages] = useState([
    { role: 'agent', content: 'Analysis complete. I\'ve researched 47 competitors, 12 case studies, and analyzed market trends. Ready to help you explore this idea.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [enabledBlocks, setEnabledBlocks] = useState<Set<string>>(new Set())
  const [showBlockConfig, setShowBlockConfig] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'vision' as SectionName, label: 'Vision', icon: '◉', completed: true },
    { id: 'market' as SectionName, label: 'Market', icon: '◉', completed: true },
    { id: 'battlefield' as SectionName, label: 'Battle', icon: '◉', completed: true },
    { id: 'history' as SectionName, label: 'History', icon: '◉', completed: true },
    { id: 'verdict' as SectionName, label: 'Verdict', icon: '○', completed: false },
    { id: 'nextmoves' as SectionName, label: 'Next', icon: '○', completed: false }
  ]

  const getKeyMetric = (section: SectionName): string => {
    switch(section) {
      case 'vision': return 'B2C Marketplace'
      case 'market': return '↑ 171% Growth'
      case 'battlefield': return '5 Active Competitors'
      case 'history': return '2 Case Studies'
      case 'verdict': return 'LTV/CAC: 3.33x'
      case 'nextmoves': return '3 Critical Steps'
      default: return ''
    }
  }

  const scrollToTop = () => {
    const messageContainer = messagesEndRef.current?.parentElement
    messageContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSectionClick = (section: SectionName) => {
    setActiveSection(section)
    setFocusedSection(focusedSection === section ? null : section)
  }

  // Helper to check if an optional block should be shown
  const shouldShowBlock = (blockId: string) => {
    return enabledBlocks.has(blockId)
  }

  useEffect(() => {
    scrollToTop()
  }, [agentMessages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    const newMessages = [
      { role: 'user', content: inputValue },
      { role: 'agent', content: 'Let me analyze that change and show you what sections would be affected...' },
      ...agentMessages
    ]
    setAgentMessages(newMessages)
    setInputValue('')
    // Scroll to top after state update to show newest messages
    setTimeout(() => scrollToTop(), 50)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', backgroundColor: colors.background, color: colors.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(247, 120, 186, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(247, 120, 186, 0.6));
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            stroke-opacity: 0.6;
          }
          50% {
            stroke-opacity: 1;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        input::placeholder {
          color: ${colors.textDim};
          transition: color 0.2s;
        }

        input:focus::placeholder {
          color: ${colors.textSecondary};
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${colors.surface};
        }

        ::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.textDim};
        }

        .clickable-box {
          cursor: pointer;
          transition: background-color 0.2s ease;
          padding: 0.5rem;
          margin: -0.5rem;
          border-radius: 4px;
        }

        .clickable-box:hover {
          background-color: ${colors.surface}80;
        }

        .clickable-box.selected {
          background-color: ${colors.surface}60;
        }
      `}</style>

      {/* LEFT NAV - 10% */}
      <div style={{ width: '10%', borderRight: `1px solid ${colors.border}`, padding: '1rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.cyan, marginBottom: '2rem', fontSize: '0.875rem' }}>
          $ shipit
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: activeSection === section.id ? colors.surface : 'transparent',
                color: activeSection === section.id ? colors.magenta : colors.textSecondary,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = colors.textPrimary
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = colors.textSecondary
                }
              }}
            >
              <span style={{ color: section.completed ? colors.green : colors.textDim }}>
                {section.icon}
              </span>{' '}
              {section.label}
              {activeSection === section.id && (
                <span style={{ marginLeft: '0.5rem', color: colors.magenta }}>←</span>
              )}
            </button>
          ))}
        </nav>

        {/* Block Configurator */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={() => setShowBlockConfig(!showBlockConfig)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
          >
            <span>🔧 Blocks ({enabledBlocks.size}/{ALL_OPTIONAL_BLOCKS.length})</span>
            <span>{showBlockConfig ? '▼' : '▶'}</span>
          </button>

          {showBlockConfig && (
            <div style={{
              marginTop: '0.5rem',
              maxHeight: '300px',
              overflowY: 'auto',
              fontSize: '0.7rem'
            }}>
              {(['vision', 'market', 'battlefield', 'history', 'verdict', 'nextmoves'] as SectionName[]).map(section => {
                const optionalBlocks = OPTIONAL_BLOCKS_BY_SECTION[section] || []
                if (optionalBlocks.length === 0) return null

                return (
                  <div key={section} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.65rem',
                      color: colors.cyan,
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase'
                    }}>
                      {section}
                    </div>
                    {optionalBlocks.map((block: { id: string; label: string }) => (
                      <label
                        key={block.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          padding: '0.25rem 0',
                          cursor: 'pointer',
                          color: enabledBlocks.has(block.id) ? colors.textPrimary : colors.textDim,
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
                        onMouseLeave={(e) => {
                          if (!enabledBlocks.has(block.id)) {
                            e.currentTarget.style.color = colors.textDim
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={enabledBlocks.has(block.id)}
                          onChange={(e) => {
                            const newSet = new Set(enabledBlocks)
                            if (e.target.checked) {
                              newSet.add(block.id)
                            } else {
                              newSet.delete(block.id)
                            }
                            setEnabledBlocks(newSet)
                          }}
                          style={{
                            marginTop: '0.2rem',
                            cursor: 'pointer',
                            accentColor: colors.magenta
                          }}
                        />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}>
                          {block.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )
              })}

              {/* Quick Actions */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setEnabledBlocks(new Set(ALL_OPTIONAL_BLOCKS.map((b: { id: string }) => b.id)))}
                  style={{
                    flex: 1,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    padding: '0.4rem',
                    backgroundColor: colors.surface,
                    color: colors.green,
                    border: `1px solid ${colors.green}40`,
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setEnabledBlocks(new Set())}
                  style={{
                    flex: 1,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    padding: '0.4rem',
                    backgroundColor: colors.surface,
                    color: colors.red,
                    border: `1px solid ${colors.red}40`,
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  None
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim }}>
            v1.0
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - 60% */}
      <div style={{ width: '60%', overflowY: 'auto' }}>
        <div style={{ padding: '2rem' }}>
          {/* Vision Section */}
          {activeSection === 'vision' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.875rem', color: colors.cyan, marginBottom: '0.5rem' }}>
                  {mockData.simulation.name}
                </h2>
                <p style={{ color: colors.textSecondary, fontSize: '1.125rem' }}>
                  {mockData.simulation.tagline}
                </p>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Value Proposition' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Value Proposition' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Value Proposition" variant="info">
                  <p style={{ color: colors.textPrimary, lineHeight: '1.6' }}>
                    {mockData.simulation.valueProposition}
                  </p>
                </TerminalBox>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Business Model' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Business Model' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Business Model" variant="default">
                  <p style={{ color: colors.textPrimary }}>
                    {mockData.simulation.businessModel}
                  </p>
                </TerminalBox>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Key Features' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Key Features' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Key Features" variant="success">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {mockData.simulation.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        padding: '0.75rem'
                      }}
                    >
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: colors.green, fontSize: '0.75rem' }}>✓</span>{' '}
                      {feature}
                    </div>
                  ))}
                </div>
              </TerminalBox>
              </div>

              {/* Target Users - OPTIONAL */}
              {shouldShowBlock('vision-target-users') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Target Users' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Target Users' })
                }}
              >
                <TerminalBox label="Target Users" variant="info">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Primary User */}
                    <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.cyan, marginBottom: '0.5rem' }}>
                        PRIMARY: {mockData.simulation.targetUsers.primary.name}
                      </div>
                      <p style={{ color: colors.textSecondary, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                        {mockData.simulation.targetUsers.primary.description}
                      </p>
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ color: colors.red, marginBottom: '0.25rem' }}>Pains:</div>
                        {mockData.simulation.targetUsers.primary.pains.map((pain, i) => (
                          <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {pain}</div>
                        ))}
                        <div style={{ color: colors.green, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Gains:</div>
                        {mockData.simulation.targetUsers.primary.gains.map((gain, i) => (
                          <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {gain}</div>
                        ))}
                      </div>
                    </div>
                    {/* Secondary User */}
                    <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.magenta, marginBottom: '0.5rem' }}>
                        SECONDARY: {mockData.simulation.targetUsers.secondary.name}
                      </div>
                      <p style={{ color: colors.textSecondary, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                        {mockData.simulation.targetUsers.secondary.description}
                      </p>
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ color: colors.red, marginBottom: '0.25rem' }}>Pains:</div>
                        {mockData.simulation.targetUsers.secondary.pains.map((pain, i) => (
                          <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {pain}</div>
                        ))}
                        <div style={{ color: colors.green, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Gains:</div>
                        {mockData.simulation.targetUsers.secondary.gains.map((gain, i) => (
                          <div key={i} style={{ color: colors.textDim, marginLeft: '0.5rem' }}>• {gain}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Aha Moment - OPTIONAL */}
              {shouldShowBlock('vision-aha-moment') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Aha Moment' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Aha Moment' })
                }}
              >
                <TerminalBox label="Aha Moment" variant="success">
                  <p style={{ color: colors.textPrimary, lineHeight: '1.6', fontStyle: 'italic' }}>
                    {mockData.simulation.ahaMoment}
                  </p>
                </TerminalBox>
              </div>
              )}

              {/* Unit Economics Snapshot - OPTIONAL */}
              {shouldShowBlock('vision-unit-economics-snapshot') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Unit Economics' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Unit Economics' })
                }}
              >
                <TerminalBox label="Unit Economics Snapshot" variant="info">
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', color: colors.cyan, fontWeight: 'bold' }}>
                        ${mockData.simulation.unitEconomicsSnapshot.customerPays}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.textDim }}>Customer Pays</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', color: colors.textDim }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', color: colors.green, fontWeight: 'bold' }}>
                        ${mockData.simulation.unitEconomicsSnapshot.platformKeeps}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.textDim }}>Platform Keeps</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', color: colors.textDim }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', color: colors.magenta, fontWeight: 'bold' }}>
                        ${mockData.simulation.unitEconomicsSnapshot.workerGets}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.textDim }}>Worker Gets</div>
                    </div>
                  </div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
                    {mockData.simulation.unitEconomicsSnapshot.breakdown}
                  </p>
                </TerminalBox>
              </div>
              )}

              {/* Problem→Solution Map - OPTIONAL */}
              {shouldShowBlock('vision-problem-solution-map') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'vision' && focusedBox?.label === 'Problem→Solution Map' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'vision', label: 'Problem→Solution Map' })
                }}
              >
                <TerminalBox label="Problem→Solution Map" variant="warning">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.red}40` }}>
                      <div style={{ color: colors.red, fontWeight: 'bold', marginBottom: '0.5rem' }}>PROBLEM</div>
                      <p style={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
                        {mockData.simulation.problemSolutionMap.problem}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', color: colors.cyan }}>↓</div>
                    <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.green}40` }}>
                      <div style={{ color: colors.green, fontWeight: 'bold', marginBottom: '0.5rem' }}>SOLUTION</div>
                      <p style={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
                        {mockData.simulation.problemSolutionMap.solution}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', color: colors.cyan }}>↓</div>
                    <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.cyan}40` }}>
                      <div style={{ color: colors.cyan, fontWeight: 'bold', marginBottom: '0.5rem' }}>VALUE</div>
                      <p style={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
                        {mockData.simulation.problemSolutionMap.value}
                      </p>
                    </div>
                  </div>
                </TerminalBox>
              </div>
              )}
            </div>
          )}

          {/* Market Section */}
          {activeSection === 'market' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan }}>Market Reality</h2>

              {/* Vertical stack of technical charts */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Demand Trend - Line Chart */}
                <div
                  className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Demand Trend' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusedBox({ section: 'market', label: 'Demand Trend' })
                  }}
                >
                  <TerminalBox label="Demand Trend" variant="info">
                  <div style={{ padding: '1rem' }}>
                    <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="60"
                          y1={20 + i * 35}
                          x2="560"
                          y2={20 + i * 35}
                          stroke={colors.border}
                          strokeOpacity="0.3"
                        />
                      ))}

                      {/* Y-axis labels */}
                      {['100', '75', '50', '25', '0'].map((label, i) => (
                        <text
                          key={i}
                          x="20"
                          y={25 + i * 35}
                          fill={colors.textDim}
                          fontSize="12"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {label}
                        </text>
                      ))}

                      {/* Line path */}
                      <path
                        d={mockData.simulation.market.demandTrend.map((point, i) => {
                          const x = 80 + (i * 480 / 5)
                          const y = 160 - (point.value * 1.4)
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={colors.cyan}
                        strokeWidth="3"
                        filter="url(#glow)"
                      />

                      {/* Data points */}
                      {mockData.simulation.market.demandTrend.map((point, i) => {
                        const x = 80 + (i * 480 / 5)
                        const y = 160 - (point.value * 1.4)
                        return (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill={colors.cyan}
                              stroke={colors.background}
                              strokeWidth="2"
                            />
                            <text
                              x={x}
                              y="190"
                              fill={colors.textSecondary}
                              fontSize="12"
                              fontFamily="JetBrains Mono, monospace"
                              textAnchor="middle"
                            >
                              {point.year.slice(2)}
                            </text>
                          </g>
                        )
                      })}

                      {/* Glow filter */}
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                    </svg>

                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: `${colors.cyan}10`,
                      border: `1px solid ${colors.cyan}40`,
                      borderRadius: '2px'
                    }}>
                      <p style={{
                        fontSize: '0.75rem',
                        color: colors.textSecondary,
                        margin: 0,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        'Senior Companion' search interest
                      </p>
                    </div>
                  </div>
                </TerminalBox>
                </div>

                {/* Workforce Capacity - Bar Chart (MANDATORY) */}
                <div
                  className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Workforce Capacity' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusedBox({ section: 'market', label: 'Workforce Capacity' })
                  }}
                >
                  <TerminalBox label="Workforce Capacity" variant="success">
                  <div style={{ padding: '1rem' }}>
                    <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="80"
                          y1={20 + i * 35}
                          x2="560"
                          y2={20 + i * 35}
                          stroke={colors.border}
                          strokeOpacity="0.3"
                        />
                      ))}

                      {/* Y-axis labels (in thousands) */}
                      {['150K', '120K', '90K', '60K', '30K'].map((label, i) => (
                        <text
                          key={i}
                          x="30"
                          y={25 + i * 35}
                          fill={colors.textDim}
                          fontSize="12"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {label}
                        </text>
                      ))}

                      {/* Bars */}
                      {mockData.simulation.market.workforceCapacity.map((city, i) => {
                        const x = 120 + (i * 95)
                        const barHeight = (city.students / 150000) * 140
                        const y = 160 - barHeight
                        return (
                          <g key={i}>
                            <rect
                              x={x}
                              y={y}
                              width="70"
                              height={barHeight}
                              fill={colors.green}
                              fillOpacity="0.8"
                              stroke={colors.green}
                              strokeWidth="1"
                              rx="2"
                            />
                            <text
                              x={x + 35}
                              y="175"
                              fill={colors.textSecondary}
                              fontSize="11"
                              fontFamily="JetBrains Mono, monospace"
                              textAnchor="middle"
                            >
                              {city.city}
                            </text>
                            <text
                              x={x + 35}
                              y={y - 5}
                              fill={colors.green}
                              fontSize="12"
                              fontFamily="JetBrains Mono, monospace"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              {(city.students / 1000).toFixed(0)}K
                            </text>
                          </g>
                        )
                      })}
                    </svg>

                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: `${colors.green}10`,
                      border: `1px solid ${colors.green}40`,
                      borderRadius: '2px'
                    }}>
                      <p style={{
                        fontSize: '0.75rem',
                        color: colors.textSecondary,
                        margin: 0,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        University student population
                      </p>
                    </div>
                  </div>
                </TerminalBox>
                </div>

                {/* Market Opportunity Gap - Area Chart (MANDATORY) */}
                <div
                  className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Market Opportunity Gap' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusedBox({ section: 'market', label: 'Market Opportunity Gap' })
                  }}
                >
                  <TerminalBox label="Market Opportunity Gap" variant="warning">
                  <div style={{ padding: '1rem' }}>
                    <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="60"
                          y1={20 + i * 35}
                          x2="560"
                          y2={20 + i * 35}
                          stroke={colors.border}
                          strokeOpacity="0.3"
                        />
                      ))}

                      {/* Y-axis labels */}
                      {['100', '75', '50', '25', '0'].map((label, i) => (
                        <text
                          key={i}
                          x="20"
                          y={25 + i * 35}
                          fill={colors.textDim}
                          fontSize="12"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {label}
                        </text>
                      ))}

                      {/* Area fill (gap between lines) */}
                      <path
                        d={
                          // Top line (loneliness)
                          mockData.simulation.market.opportunityGap.map((point, i) => {
                            const x = 80 + (i * 480 / 5)
                            const y = 160 - (point.loneliness * 1.4)
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                          }).join(' ') +
                          // Bottom line (solutions) - reversed for area fill
                          mockData.simulation.market.opportunityGap.slice().reverse().map((point, i) => {
                            const x = 560 - (i * 480 / 5)
                            const y = 160 - (point.solutions * 1.4)
                            return `L ${x} ${y}`
                          }).join(' ') +
                          ' Z'
                        }
                        fill={colors.amber}
                        fillOpacity="0.3"
                        stroke="none"
                      />

                      {/* Loneliness line */}
                      <path
                        d={mockData.simulation.market.opportunityGap.map((point, i) => {
                          const x = 80 + (i * 480 / 5)
                          const y = 160 - (point.loneliness * 1.4)
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={colors.red}
                        strokeWidth="3"
                      />

                      {/* Solutions line */}
                      <path
                        d={mockData.simulation.market.opportunityGap.map((point, i) => {
                          const x = 80 + (i * 480 / 5)
                          const y = 160 - (point.solutions * 1.4)
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={colors.green}
                        strokeWidth="3"
                      />

                      {/* X-axis labels */}
                      {mockData.simulation.market.opportunityGap.map((point, i) => {
                        const x = 80 + (i * 480 / 5)
                        return (
                          <text
                            key={i}
                            x={x}
                            y="190"
                            fill={colors.textSecondary}
                            fontSize="12"
                            fontFamily="JetBrains Mono, monospace"
                            textAnchor="middle"
                          >
                            {point.year.slice(2)}
                          </text>
                        )
                      })}
                    </svg>

                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: `${colors.amber}10`,
                      border: `1px solid ${colors.amber}40`,
                      borderRadius: '2px',
                      display: 'flex',
                      gap: '0.75rem',
                      fontSize: '0.7rem',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '12px', height: '2px', backgroundColor: colors.red }} />
                        <span style={{ color: colors.textSecondary }}>Loneliness</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '12px', height: '2px', backgroundColor: colors.green }} />
                        <span style={{ color: colors.textSecondary }}>Solutions</span>
                      </div>
                    </div>
                  </div>
                </TerminalBox>
                </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Ask the Market' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'Ask the Market' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Ask the Market" variant="default">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockData.simulation.market.userQuotes.map((quote, i) => (
                      <div key={i} style={{ borderLeft: `2px solid ${colors.cyan}`, paddingLeft: '1rem' }}>
                      <p style={{ color: colors.textPrimary, fontStyle: 'italic', marginBottom: '0.5rem' }}>"{quote.content}"</p>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
                        — {quote.platform}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: colors.green }}>
                        ✓ {quote.insight}
                      </p>
                    </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>

              {/* Market Size (TAM/SAM/SOM) - OPTIONAL */}
              {shouldShowBlock('market-size') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Market Size' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'Market Size' })
                }}
              >
                <TerminalBox label="Market Size (TAM/SAM/SOM)" variant="success">
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', color: colors.cyan, fontWeight: 'bold' }}>
                        ${(mockData.simulation.marketExtended.marketSize.tam / 1000000000).toFixed(0)}B
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>TAM</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Total Addressable Market</div>
                    </div>
                    <div style={{ fontSize: '2rem', color: colors.textDim }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', color: colors.green, fontWeight: 'bold' }}>
                        ${(mockData.simulation.marketExtended.marketSize.sam / 1000000000).toFixed(0)}B
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>SAM</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Serviceable Available Market</div>
                    </div>
                    <div style={{ fontSize: '2rem', color: colors.textDim }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', color: colors.magenta, fontWeight: 'bold' }}>
                        ${(mockData.simulation.marketExtended.marketSize.som / 1000000).toFixed(0)}M
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>SOM</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Serviceable Obtainable Market</div>
                    </div>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* VC Funding Activity - MANDATORY (now shows both total and breakdown) */}
              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'VC Funding Activity' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'VC Funding Activity' })
                }}
              >
                <TerminalBox label="VC Funding Activity" variant="info">
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', color: colors.cyan, fontWeight: 'bold' }}>
                      {mockData.simulation.marketExtended.fundingActivity.total}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Total funding in space (2021-2024)</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mockData.simulation.marketExtended.fundingActivity.recentRounds.map((round: any, i: number) => (
                      <div key={i} style={{ padding: '0.75rem', backgroundColor: colors.background, border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{round.company}</div>
                          <div style={{ fontSize: '0.75rem', color: colors.textDim }}>{round.stage} • {round.date}</div>
                        </div>
                        <div style={{ color: colors.green, fontSize: '1.25rem', fontWeight: 'bold' }}>{round.amount}</div>
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>

              {/* Job Postings Trend - MANDATORY (now shows both total and trend) */}
              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Job Postings Trend' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'Job Postings Trend' })
                }}
              >
                <TerminalBox label="Job Postings Trend" variant="success">
                  <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', color: colors.green, fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace' }}>
                      {mockData.simulation.market.jobPostings.toLocaleString()} current postings
                    </div>
                  </div>
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
                    <defs>
                      <linearGradient id="jobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: colors.green, stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: colors.green, stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    {mockData.simulation.marketExtended.jobPostingsTrend.map((point: any, i: number) => {
                      const x = 50 + (i * 90)
                      const maxPostings = 3500
                      const y = 180 - (point.postings / maxPostings * 150)
                      return (
                        <g key={i}>
                          <rect x={x - 15} y={y} width="30" height={180 - y} fill="url(#jobGradient)" />
                          <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">{point.year}</text>
                          <text x={x} y={y - 5} textAnchor="middle" fill={colors.green} fontSize="12" fontWeight="bold">{point.postings}</text>
                        </g>
                      )
                    })}
                  </svg>
                </TerminalBox>
              </div>

              {/* Regulatory Landscape - OPTIONAL */}
              {shouldShowBlock('market-regulatory') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Regulatory Landscape' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'Regulatory Landscape' })
                }}
              >
                <TerminalBox label="Regulatory Landscape" variant="warning">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {mockData.simulation.marketExtended.regulatoryLandscape.map((reg: any, i: number) => {
                      const complexityColor = reg.complexity === 'High' ? colors.red : reg.complexity === 'Medium' ? colors.amber : colors.green
                      return (
                        <div key={i} style={{ padding: '0.75rem', backgroundColor: colors.background, border: `1px solid ${complexityColor}40` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{reg.state}</span>
                            <span style={{ color: complexityColor, fontSize: '0.75rem' }}>{reg.complexity}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
                            License: {reg.licensing}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: colors.textDim }}>{reg.notes}</div>
                        </div>
                      )
                    })}
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Hype vs Reality Check - OPTIONAL */}
              {shouldShowBlock('market-hype-reality') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'market' && focusedBox?.label === 'Hype vs Reality' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'market', label: 'Hype vs Reality' })
                }}
              >
                <TerminalBox label="Hype vs Reality Check" variant="info">
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
                    {mockData.simulation.marketExtended.hypeVsReality.map((point: any, i: number) => {
                      const x = 50 + (i * 75)
                      const hypeY = 180 - (point.hype / 100 * 150)
                      const realityY = 180 - (point.reality / 100 * 150)
                      const nextPoint = mockData.simulation.marketExtended.hypeVsReality[i + 1]

                      return (
                        <g key={i}>
                          {nextPoint && (
                            <>
                              <line x1={x} y1={hypeY} x2={50 + ((i + 1) * 75)} y2={180 - (nextPoint.hype / 100 * 150)} stroke={colors.magenta} strokeWidth="2" strokeDasharray="5,5" />
                              <line x1={x} y1={realityY} x2={50 + ((i + 1) * 75)} y2={180 - (nextPoint.reality / 100 * 150)} stroke={colors.cyan} strokeWidth="2" />
                            </>
                          )}
                          <circle cx={x} cy={hypeY} r="4" fill={colors.magenta} />
                          <circle cx={x} cy={realityY} r="4" fill={colors.cyan} />
                          <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">{point.year}</text>
                        </g>
                      )
                    })}
                    <text x="20" y="30" fill={colors.magenta} fontSize="12">- - Hype</text>
                    <text x="20" y="50" fill={colors.cyan} fontSize="12">— Reality</text>
                  </svg>
                </TerminalBox>
              </div>
              )}
            </div>
          </div>
          )}

          {/* Battlefield Section */}
          {activeSection === 'battlefield' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, margin: 0 }}>The Battlefield</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentMarketIndex(currentMarketIndex === 'core' ? 'secondary' : 'core')
                  }}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.cyan}`,
                    color: colors.cyan,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderRadius: '2px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cyan
                    e.currentTarget.style.color = colors.background
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.surface
                    e.currentTarget.style.color = colors.cyan
                  }}
                >
                  {currentMarketIndex === 'core' ? 'Show Secondary Market' : 'Show Core Market'}
                </button>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === (currentMarketIndex === 'core' ? 'Core Market: Senior Companionship' : 'Secondary Market: Task Services') ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'battlefield', label: currentMarketIndex === 'core' ? 'Core Market: Senior Companionship' : 'Secondary Market: Task Services' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label={currentMarketIndex === 'core' ? 'Core Market: Senior Companionship' : 'Secondary Market: Task Services'} variant="info">
                  <div style={{ width: '100%', padding: '0.5rem 0' }}>
                    <svg viewBox="0 0 700 450" style={{ width: '100%', height: '26rem' }}>
                    <defs>
                      <filter id="cyan-glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Grid */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <g key={`grid-${i}`}>
                        <line
                          x1={150 + i * 83}
                          y1="60"
                          x2={150 + i * 83}
                          y2="360"
                          stroke={colors.border}
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                        <line
                          x1="150"
                          y1={60 + i * 60}
                          x2="650"
                          y2={60 + i * 60}
                          stroke={colors.border}
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      </g>
                    ))}

                    {/* Axes */}
                    <line x1="150" y1="360" x2="650" y2="360" stroke={colors.textSecondary} strokeWidth="2"/>
                    <line x1="150" y1="60" x2="150" y2="360" stroke={colors.textSecondary} strokeWidth="2"/>

                    {/* Axis titles */}
                    <text x="400" y="410" fill={colors.textSecondary} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
                      Service Model →
                    </text>
                    <text x="50" y="210" fill={colors.textSecondary} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono" transform="rotate(-90, 50, 210)">
                      ← Price
                    </text>

                    {/* X-axis labels */}
                    <text x="150" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
                      Group
                    </text>
                    <text x="400" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
                      Remote 1:1
                    </text>
                    <text x="650" y="385" fill={colors.textDim} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">
                      In-Home
                    </text>

                    {/* Y-axis labels */}
                    <text x="130" y="365" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                      Free
                    </text>
                    <text x="130" y="210" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                      Mid
                    </text>
                    <text x="130" y="65" fill={colors.textDim} fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                      Premium
                    </text>

                    {/* Plot competitors */}
                    {(currentMarketIndex === 'core' ? mockData.simulation.competitors : mockData.simulation.secondaryCompetitors).map((comp, i) => {
                      const cx = 150 + (comp.x / 100) * 500
                      const cy = 360 - (comp.y / 100) * 300
                      const isYou = comp.name === 'YOU'

                      return (
                        <g key={i}>
                          {isYou ? (
                            <>
                              {/* Subtle neon pink ring with pulse animation */}
                              <circle
                                cx={cx}
                                cy={cy}
                                r="12"
                                fill="none"
                                stroke={colors.magenta}
                                strokeWidth="2"
                                className="pulse-ring"
                              />
                              <circle
                                cx={cx}
                                cy={cy}
                                r="7"
                                fill={colors.magenta}
                                opacity="0.3"
                              />
                              <circle
                                cx={cx}
                                cy={cy}
                                r="4"
                                fill={colors.magenta}
                              />
                              <text
                                x={cx}
                                y={cy - 20}
                                fill={colors.magenta}
                                fontSize="14"
                                fontWeight="bold"
                                textAnchor="middle"
                                fontFamily="JetBrains Mono"
                              >
                                YOU
                              </text>
                            </>
                          ) : (
                            <>
                              <circle cx={cx} cy={cy} r="6" fill={colors.cyan} stroke={colors.cyan} strokeWidth="1" filter="url(#cyan-glow)" />
                              <text x={cx} y={cy - 13} fill={colors.cyan} fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">
                                {comp.name}
                              </text>
                              <text x={cx} y={cy + 22} fill={colors.textDim} fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                                {comp.funding}
                              </text>
                            </>
                          )}
                        </g>
                      )
                    })}
                    </svg>
                  </div>
                </TerminalBox>
              </div>

              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <div
                  className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Your Gap' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusedBox({ section: 'battlefield', label: 'Your Gap' })
                  }}
                >
                  <TerminalBox label="Your Gap" variant="success">
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary }}>
                      Affordable, tech-enabled matching sits between premium in-home (Papa) and basic platforms (Care.com)
                    </p>
                  </TerminalBox>
                </div>
                <div
                  className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Your Risk' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusedBox({ section: 'battlefield', label: 'Your Risk' })
                  }}
                >
                  <TerminalBox label="Your Risk" variant="warning">
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary }}>
                      Papa has 10x funding and could easily copy your pricing model or acquire you
                    </p>
                  </TerminalBox>
                </div>
              </div>

              {/* Feature Comparison Matrix - OPTIONAL */}
              {shouldShowBlock('battlefield-feature-matrix') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Feature Matrix' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'battlefield', label: 'Feature Matrix' })
                }}
              >
                <TerminalBox label="Feature Comparison Matrix" variant="info">
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem', color: colors.textDim }}>Feature</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.cyan }}>You</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textSecondary }}>Papa</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textSecondary }}>Care.com</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textSecondary }}>Candoo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.simulation.featureMatrix.features.map((feature: string, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${colors.border}20` }}>
                          <td style={{ padding: '0.5rem', color: colors.textPrimary }}>{feature}</td>
                          <td style={{ textAlign: 'center', padding: '0.5rem', color: mockData.simulation.featureMatrix.you[i] ? colors.green : colors.textDim }}>
                            {mockData.simulation.featureMatrix.you[i] ? '✓' : '—'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0.5rem', color: mockData.simulation.featureMatrix.papa[i] ? colors.green : colors.textDim }}>
                            {mockData.simulation.featureMatrix.papa[i] ? '✓' : '—'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0.5rem', color: mockData.simulation.featureMatrix.careDotCom[i] ? colors.green : colors.textDim }}>
                            {mockData.simulation.featureMatrix.careDotCom[i] ? '✓' : '—'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0.5rem', color: mockData.simulation.featureMatrix.candoo[i] ? colors.green : colors.textDim }}>
                            {mockData.simulation.featureMatrix.candoo[i] ? '✓' : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TerminalBox>
              </div>
              )}

              {/* Funding Velocity - OPTIONAL */}
              {shouldShowBlock('battlefield-funding-velocity') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Funding Velocity' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'battlefield', label: 'Funding Velocity' })
                }}
              >
                <TerminalBox label="Competitor Funding Velocity" variant="warning">
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
                    {mockData.simulation.competitorFunding.map((point: any, i: number) => {
                      const x = 50 + (i * 90)
                      const nextPoint = mockData.simulation.competitorFunding[i + 1]
                      const maxFunding = 250

                      return (
                        <g key={i}>
                          {nextPoint && (
                            <>
                              <line x1={x} y1={180 - (point.papa / maxFunding * 150)} x2={50 + ((i + 1) * 90)} y2={180 - (nextPoint.papa / maxFunding * 150)} stroke={colors.magenta} strokeWidth="2" />
                              <line x1={x} y1={180 - (point.honor / maxFunding * 150)} x2={50 + ((i + 1) * 90)} y2={180 - (nextPoint.honor / maxFunding * 150)} stroke={colors.cyan} strokeWidth="2" />
                              <line x1={x} y1={180 - (point.careDotCom / maxFunding * 150)} x2={50 + ((i + 1) * 90)} y2={180 - (nextPoint.careDotCom / maxFunding * 150)} stroke={colors.amber} strokeWidth="2" />
                            </>
                          )}
                          <circle cx={x} cy={180 - (point.papa / maxFunding * 150)} r="4" fill={colors.magenta} />
                          <circle cx={x} cy={180 - (point.honor / maxFunding * 150)} r="4" fill={colors.cyan} />
                          <circle cx={x} cy={180 - (point.careDotCom / maxFunding * 150)} r="4" fill={colors.amber} />
                          <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="12">{point.date}</text>
                        </g>
                      )
                    })}
                    <text x="420" y="30" fill={colors.magenta} fontSize="12">Papa</text>
                    <text x="420" y="50" fill={colors.cyan} fontSize="12">Honor</text>
                    <text x="420" y="70" fill={colors.amber} fontSize="12">Care.com</text>
                  </svg>
                </TerminalBox>
              </div>
              )}

              {/* Market Saturation Score - OPTIONAL */}
              {shouldShowBlock('battlefield-saturation') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Saturation' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'battlefield', label: 'Saturation' })
                }}
              >
                <TerminalBox label="Market Saturation Score" variant="warning">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '4rem', color: colors.amber, fontWeight: 'bold' }}>
                        {mockData.simulation.saturationScore.score}
                      </div>
                      <div style={{ fontSize: '1.25rem', color: colors.textPrimary, marginTop: '0.5rem' }}>
                        {mockData.simulation.saturationScore.label}
                      </div>
                    </div>
                    <div style={{ flex: 2 }}>
                      <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                        {mockData.simulation.saturationScore.description}
                      </p>
                    </div>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Trust/Moat Analysis - OPTIONAL */}
              {shouldShowBlock('battlefield-moat-analysis') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'battlefield' && focusedBox?.label === 'Moat Analysis' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'battlefield', label: 'Moat Analysis' })
                }}
              >
                <TerminalBox label="Trust/Moat Analysis" variant="info">
                  <svg viewBox="0 0 500 500" style={{ width: '100%', height: 'auto' }}>
                    {/* Radar chart */}
                    <g transform="translate(250, 250)">
                      {/* Grid circles */}
                      {[20, 40, 60, 80, 100].map((r, i) => (
                        <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={colors.border} strokeWidth="1" opacity="0.3" />
                      ))}
                      {/* Axes */}
                      {Object.keys(mockData.simulation.moatAnalysis).map((key, i) => {
                        const angle = (i / Object.keys(mockData.simulation.moatAnalysis).length) * 2 * Math.PI - Math.PI / 2
                        const x = Math.cos(angle) * 120
                        const y = Math.sin(angle) * 120
                        return (
                          <g key={i}>
                            <line x1="0" y1="0" x2={x} y2={y} stroke={colors.border} strokeWidth="1" opacity="0.5" />
                            <text x={x * 1.6} y={y * 1.6} textAnchor="middle" fill={colors.textSecondary} fontSize="12">
                              {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                            </text>
                          </g>
                        )
                      })}
                      {/* Data polygon */}
                      <polygon
                        points={Object.values(mockData.simulation.moatAnalysis).map((value: any, i: number) => {
                          const angle = (i / Object.values(mockData.simulation.moatAnalysis).length) * 2 * Math.PI - Math.PI / 2
                          const x = Math.cos(angle) * value
                          const y = Math.sin(angle) * value
                          return `${x},${y}`
                        }).join(' ')}
                        fill={colors.cyan}
                        fillOpacity="0.2"
                        stroke={colors.cyan}
                        strokeWidth="2"
                      />
                      {/* Data points */}
                      {Object.values(mockData.simulation.moatAnalysis).map((value: any, i: number) => {
                        const angle = (i / Object.values(mockData.simulation.moatAnalysis).length) * 2 * Math.PI - Math.PI / 2
                        const x = Math.cos(angle) * value
                        const y = Math.sin(angle) * value
                        return <circle key={i} cx={x} cy={y} r="4" fill={colors.cyan} />
                      })}
                    </g>
                  </svg>
                </TerminalBox>
              </div>
              )}
            </div>
          )}

          {/* History Section */}
          {activeSection === 'history' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan }}>Lessons from History</h2>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                {mockData.simulation.caseStudies.map((study, i) => (
                  <div
                    key={i}
                    className={`clickable-box ${focusedBox?.section === 'history' && focusedBox?.label === `Case Study: ${study.name}` ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFocusedBox({ section: 'history', label: `Case Study: ${study.name}` })
                    }}
                  >
                  <TerminalBox
                    label={`Case Study: ${study.name}`}
                    variant={study.outcome === 'succeeded' ? 'success' : study.outcome === 'failed' ? 'error' : 'warning'}
                  >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.125rem', color: colors.textPrimary }}>
                        {study.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{study.years}</p>
                    </div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: study.outcome === 'succeeded' ? `${colors.green}33` : study.outcome === 'failed' ? `${colors.red}33` : `${colors.amber}33`,
                      color: study.outcome === 'succeeded' ? colors.green : study.outcome === 'failed' ? colors.red : colors.amber
                    }}>
                      {study.outcome === 'succeeded' ? '✓ Succeeded' : study.outcome === 'failed' ? '✗ Failed' : '↻ Pivoted'}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ position: 'absolute', top: '12px', left: 0, width: '100%', height: '2px', backgroundColor: colors.border }} />
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                      {study.timeline.map((milestone, j) => (
                        <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: j === 0 ? colors.green : j === study.timeline.length - 1 && study.outcome === 'failed' ? colors.red : j === study.timeline.length - 1 ? colors.green : colors.amber,
                            backgroundColor: j === 0 ? colors.green : j === study.timeline.length - 1 && study.outcome === 'failed' ? colors.red : j === study.timeline.length - 1 ? colors.green : colors.amber
                          }} />
                          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.5rem' }}>
                            {milestone.date}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: colors.textPrimary, marginTop: '0.25rem', maxWidth: '100px', textAlign: 'center' }}>
                            {milestone.event}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderLeft: `2px solid ${study.outcome === 'succeeded' ? colors.green : colors.amber}`, paddingLeft: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary }}>LESSON: </span>
                      {study.lesson}
                    </p>
                  </div>
                  </TerminalBox>
                  </div>
                ))}
              </div>

              {/* Fatal Flaw Analysis - OPTIONAL */}
              {shouldShowBlock('history-fatal-flaw') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'history' && focusedBox?.label === 'Fatal Flaw' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'history', label: 'Fatal Flaw' })
                }}
              >
                <TerminalBox label="Fatal Flaw Analysis" variant="error">
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', color: colors.red, marginBottom: '0.5rem' }}>
                      {mockData.simulation.fatalFlaw.title}
                    </h3>
                    <p style={{ color: colors.textPrimary, fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {mockData.simulation.fatalFlaw.description}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: `${colors.red}10`, border: `1px solid ${colors.red}40`, borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.red, marginBottom: '0.5rem' }}>
                      EXAMPLE:
                    </div>
                    <p style={{ fontSize: '0.875rem', color: colors.textSecondary, margin: 0 }}>
                      {mockData.simulation.fatalFlaw.example}
                    </p>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Success Pattern - OPTIONAL */}
              {shouldShowBlock('history-success-pattern') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'history' && focusedBox?.label === 'Success Pattern' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'history', label: 'Success Pattern' })
                }}
              >
                <TerminalBox label="Success Pattern" variant="success">
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', color: colors.green, marginBottom: '0.5rem' }}>
                      {mockData.simulation.successPattern.title}
                    </h3>
                    <p style={{ color: colors.textPrimary, fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {mockData.simulation.successPattern.description}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: `${colors.green}10`, border: `1px solid ${colors.green}40`, borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.green, marginBottom: '0.5rem' }}>
                      KEY METRICS:
                    </div>
                    <p style={{ fontSize: '0.875rem', color: colors.textSecondary, margin: 0 }}>
                      {mockData.simulation.successPattern.keyMetrics}
                    </p>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Risk Baseline Comparison - OPTIONAL */}
              {shouldShowBlock('history-risk-baseline') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'history' && focusedBox?.label === 'Risk Baseline: Hometeam Failure Analysis' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'history', label: 'Risk Baseline: Hometeam Failure Analysis' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Risk Baseline: Hometeam Failure Analysis" variant="warning">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.5rem' }}>
                        Hometeam (Failed 2018)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.875rem', color: colors.red }}>
                          • Burn Rate: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>$150K/mo</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.red }}>
                          • Growth Velocity: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>15% MoM</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.red }}>
                          • Market Coverage: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>5 cities</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.5rem' }}>
                        Your Current Roadmap
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.875rem', color: colors.green }}>
                          • Target Burn: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>$50K/mo</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.amber }}>
                          • Target Growth: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>20% MoM</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.green }}>
                          • Initial Coverage: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>1-2 cities</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: `${colors.amber}20`, border: `1px solid ${colors.amber}`, borderRadius: '2px' }}>
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary, margin: 0 }}>
                      <span style={{ color: colors.amber, fontWeight: 700 }}>⚠ Key Risk Factor:</span> Hometeam's failure pattern shows that scaling to 5+ cities before achieving strong unit economics in 1-2 markets is fatal. Your roadmap avoids this by focusing on depth over breadth, but you must maintain the 20% MoM growth target to justify lower burn rate.
                    </p>
                  </div>
                </div>
              </TerminalBox>
              </div>
              )}

              {/* Technology Evolution - OPTIONAL */}
              {shouldShowBlock('history-tech-evolution') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'history' && focusedBox?.label === 'Tech Evolution' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'history', label: 'Tech Evolution' })
                }}
              >
                <TerminalBox label="Technology Evolution" variant="info">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockData.simulation.techEvolution.map((tech: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '1.25rem',
                          color: colors.cyan,
                          minWidth: '60px'
                        }}>
                          {tech.year}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: colors.textPrimary, fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {tech.tech}
                          </div>
                          <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>
                            {tech.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>
              )}
            </div>
          )}

          {/* Verdict Section */}
          {activeSection === 'verdict' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan }}>The Verdict</h2>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.green }}>✓ Strengths</h3>
                {mockData.simulation.strengths.map((strength, i) => (
                  <div
                    key={i}
                    className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === strength.title ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFocusedBox({ section: 'verdict', label: strength.title })
                    }}
                  >
                  <TerminalBox label={strength.title} variant="success">
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                      {strength.description}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: colors.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
                      Source: {strength.source}
                    </p>
                  </TerminalBox>
                  </div>
                ))}
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.amber }}>⚠ Risks</h3>
                {mockData.simulation.risks.map((risk, i) => (
                  <div
                    key={i}
                    className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === risk.title ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFocusedBox({ section: 'verdict', label: risk.title })
                    }}
                  >
                  <TerminalBox label={risk.title} variant="warning">
                    <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                      {risk.description}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: colors.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
                      Source: {risk.source}
                    </p>
                  </TerminalBox>
                  </div>
                ))}
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'Unit Economics' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'Unit Economics' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Unit Economics" variant="info">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
                      LTV (Lifetime Value)
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.green, fontWeight: 700 }}>
                      $50
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
                      Per seat/month × 12 months
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
                      CAC (Customer Acquisition)
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.amber, fontWeight: 700 }}>
                      $15
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
                      Blended cost per acquisition
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
                      LTV/CAC Ratio
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, fontWeight: 700 }}>
                      3.33x
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.green, marginTop: '0.25rem' }}>
                      ✓ Above 3x threshold
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: `${colors.green}20`, border: `1px solid ${colors.green}`, borderRadius: '2px' }}>
                  <p style={{ fontSize: '0.875rem', color: colors.textPrimary, margin: 0 }}>
                    <span style={{ color: colors.green, fontWeight: 700 }}>Strong unit economics:</span> The 3.33x ratio exceeds the standard 3x benchmark for sustainable SaaS businesses. At scale, this translates to healthy margins and efficient growth.
                  </p>
                </div>
                </TerminalBox>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'The Hard Question' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'The Hard Question' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="The Hard Question" variant="error">
                  <p style={{ color: colors.textPrimary, lineHeight: '1.6' }}>
                    {mockData.simulation.hardQuestion}
                  </p>
                </TerminalBox>
              </div>

              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'Final Assessment' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'Final Assessment' })
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TerminalBox label="Final Assessment" variant="default">
                  <p style={{ color: colors.textPrimary, lineHeight: '1.6' }}>
                    {mockData.simulation.verdict}
                  </p>
                </TerminalBox>
              </div>

              {/* Bull vs Bear Case - OPTIONAL */}
              {shouldShowBlock('verdict-bull-bear') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'Bull vs Bear' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'Bull vs Bear' })
                }}
              >
                <TerminalBox label="Bull vs Bear Case" variant="warning">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.green, marginBottom: '1rem', fontWeight: 'bold' }}>
                        🐂 BULL CASE
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                          {mockData.simulation.bullBearCase.bull.scenario}
                        </p>
                      </div>
                      <div style={{ padding: '0.75rem', backgroundColor: `${colors.green}10`, border: `1px solid ${colors.green}40`, borderRadius: '2px' }}>
                        <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
                          Outcome:
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                          {mockData.simulation.bullBearCase.bull.outcome}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.green }}>
                          Probability: {mockData.simulation.bullBearCase.bull.probability}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.red, marginBottom: '1rem', fontWeight: 'bold' }}>
                        🐻 BEAR CASE
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                          {mockData.simulation.bullBearCase.bear.scenario}
                        </p>
                      </div>
                      <div style={{ padding: '0.75rem', backgroundColor: `${colors.red}10`, border: `1px solid ${colors.red}40`, borderRadius: '2px' }}>
                        <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
                          Outcome:
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
                          {mockData.simulation.bullBearCase.bear.outcome}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.red }}>
                          Probability: {mockData.simulation.bullBearCase.bear.probability}
                        </div>
                      </div>
                    </div>
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Path to Profitability - OPTIONAL */}
              {shouldShowBlock('verdict-profitability-path') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'Profitability Path' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'Profitability Path' })
                }}
              >
                <TerminalBox label="Path to Profitability" variant="success">
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto' }}>
                    {mockData.simulation.profitabilityPath.map((point: any, i: number) => {
                      const x = 50 + (i * 90)
                      const nextPoint = mockData.simulation.profitabilityPath[i + 1]
                      const maxMRR = 300000
                      const mrrY = 180 - (point.mrr / maxMRR * 150)

                      return (
                        <g key={i}>
                          {nextPoint && (
                            <line x1={x} y1={mrrY} x2={50 + ((i + 1) * 90)} y2={180 - (nextPoint.mrr / maxMRR * 150)} stroke={colors.green} strokeWidth="2" />
                          )}
                          <circle cx={x} cy={mrrY} r="4" fill={colors.green} />
                          <text x={x} y={195} textAnchor="middle" fill={colors.textDim} fontSize="10">{point.milestone}</text>
                          <text x={x} y={mrrY - 10} textAnchor="middle" fill={colors.green} fontSize="10">${(point.mrr / 1000).toFixed(0)}K</text>
                        </g>
                      )
                    })}
                    <line x1="50" y1="120" x2="450" y2="120" stroke={colors.amber} strokeWidth="1" strokeDasharray="5,5" />
                    <text x="455" y="125" fill={colors.amber} fontSize="10">Break Even</text>
                  </svg>
                </TerminalBox>
              </div>
              )}

              {/* Defensibility Score - OPTIONAL */}
              {shouldShowBlock('verdict-defensibility') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'Defensibility' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'Defensibility' })
                }}
              >
                <TerminalBox label="Defensibility Score" variant="info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '4rem', color: colors.cyan, fontWeight: 'bold' }}>
                        {mockData.simulation.defensibilityScore.overallScore}/100
                      </div>
                      <div style={{ fontSize: '1.25rem', color: colors.textPrimary, marginTop: '0.25rem' }}>
                        {mockData.simulation.defensibilityScore.label}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(mockData.simulation.defensibilityScore).filter(([key]) => key !== 'overallScore' && key !== 'label').map(([key, value]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, fontSize: '0.875rem', color: colors.textPrimary }}>
                          {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div style={{ flex: 2, backgroundColor: colors.background, borderRadius: '4px', overflow: 'hidden', height: '20px' }}>
                          <div style={{ width: `${value}%`, height: '100%', backgroundColor: colors.cyan }} />
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.cyan, minWidth: '40px' }}>
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Final Verdict - OPTIONAL */}
              {shouldShowBlock('verdict-final-verdict') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'verdict' && focusedBox?.label === 'AI Verdict' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'verdict', label: 'AI Verdict' })
                }}
              >
                <TerminalBox label="Final AI Verdict" variant={mockData.simulation.finalVerdict.recommendation === 'BUILD IT' ? 'success' : mockData.simulation.finalVerdict.recommendation === 'VALIDATE FIRST' ? 'warning' : 'error'}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontFamily: 'JetBrains Mono, monospace', color: mockData.simulation.finalVerdict.recommendation === 'BUILD IT' ? colors.green : mockData.simulation.finalVerdict.recommendation === 'VALIDATE FIRST' ? colors.amber : colors.red, fontWeight: 'bold' }}>
                      {mockData.simulation.finalVerdict.recommendation}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.textDim, marginTop: '0.5rem' }}>
                      Confidence: {mockData.simulation.finalVerdict.confidence}%
                    </div>
                  </div>
                  <p style={{ color: colors.textPrimary, fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {mockData.simulation.finalVerdict.reasoning}
                  </p>
                  <div style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}`, borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.cyan, marginBottom: '0.5rem' }}>
                      GO/NO-GO:
                    </div>
                    <p style={{ fontSize: '0.875rem', color: colors.textSecondary, margin: 0 }}>
                      {mockData.simulation.finalVerdict.goNoGo}
                    </p>
                  </div>
                </TerminalBox>
              </div>
              )}
            </div>
          )}

          {/* Next Moves Section */}
          {activeSection === 'nextmoves' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan }}>Next Moves</h2>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                {mockData.simulation.nextSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`clickable-box ${focusedBox?.section === 'nextmoves' && focusedBox?.label === `Step ${i + 1}: ${step.title}` ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFocusedBox({ section: 'nextmoves', label: `Step ${i + 1}: ${step.title}` })
                    }}
                  >
                  <TerminalBox
                    label={`Step ${i + 1}: ${step.title}`}
                    variant={step.priority === 'critical' ? 'error' : step.priority === 'important' ? 'warning' : 'info'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '1.125rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: step.priority === 'critical' ? `${colors.red}33` : step.priority === 'important' ? `${colors.amber}33` : `${colors.cyan}33`,
                        color: step.priority === 'critical' ? colors.red : step.priority === 'important' ? colors.amber : colors.cyan
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            backgroundColor: step.priority === 'critical' ? `${colors.red}33` : step.priority === 'important' ? `${colors.amber}33` : `${colors.cyan}33`,
                            color: step.priority === 'critical' ? colors.red : step.priority === 'important' ? colors.amber : colors.cyan
                          }}>
                            {step.priority.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </TerminalBox>
                  </div>
                ))}
              </div>

              {/* Validation Checklist - MANDATORY (but seems to be missing, adding it) */}
              <div
                className={`clickable-box ${focusedBox?.section === 'nextmoves' && focusedBox?.label === 'Validation Checklist' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'nextmoves', label: 'Validation Checklist' })
                }}
              >
                <TerminalBox label="Validation Checklist" variant="warning">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mockData.simulation.validationChecklist.map((item: any, i: number) => {
                      const priorityColor = item.priority === 'critical' ? colors.red : colors.amber
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                          <input type="checkbox" checked={item.completed} readOnly style={{ accentColor: colors.cyan }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: colors.textPrimary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                              {item.item}
                            </div>
                          </div>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.65rem',
                            padding: '0.125rem 0.5rem',
                            backgroundColor: `${priorityColor}20`,
                            color: priorityColor
                          }}>
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </TerminalBox>
              </div>

              {/* 30-Day Sprint Plan - OPTIONAL */}
              {shouldShowBlock('nextmoves-30day-sprint') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'nextmoves' && focusedBox?.label === '30-Day Sprint' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'nextmoves', label: '30-Day Sprint' })
                }}
              >
                <TerminalBox label="30-Day Sprint Plan" variant="info">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockData.simulation.sprintPlan.map((week: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: colors.cyan, minWidth: '60px' }}>
                          W{week.week}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: colors.textPrimary, fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {week.goal}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                            Tasks: {week.tasks.join(', ')}
                          </div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.green }}>
                            Metrics: {week.metrics}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>
              )}

              {/* Acquisition Strategy - OPTIONAL */}
              {shouldShowBlock('nextmoves-acquisition-strategy') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'nextmoves' && focusedBox?.label === 'Acquisition Strategy' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'nextmoves', label: 'Acquisition Strategy' })
                }}
              >
                <TerminalBox label="Acquisition Strategy" variant="success">
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem', color: colors.textDim }}>Channel</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textDim }}>CAC</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textDim }}>LTV</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textDim }}>Volume</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', color: colors.textDim }}>Viability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.simulation.acquisitionStrategy.map((channel: any, i: number) => {
                        const viabilityColor = channel.viability === 'High' ? colors.green : channel.viability === 'Medium' ? colors.amber : colors.red
                        return (
                          <tr key={i} style={{ borderBottom: `1px solid ${colors.border}20` }}>
                            <td style={{ padding: '0.5rem', color: colors.textPrimary }}>{channel.channel}</td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', color: colors.amber, fontFamily: 'JetBrains Mono, monospace' }}>
                              ${channel.cac}
                            </td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', color: colors.green, fontFamily: 'JetBrains Mono, monospace' }}>
                              ${channel.ltv}
                            </td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', color: colors.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}>
                              {channel.volume}
                            </td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', color: viabilityColor }}>
                              {channel.viability}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </TerminalBox>
              </div>
              )}

              {/* Funding Roadmap - OPTIONAL */}
              {shouldShowBlock('nextmoves-funding-roadmap') && (
              <div
                className={`clickable-box ${focusedBox?.section === 'nextmoves' && focusedBox?.label === 'Funding Roadmap' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setFocusedBox({ section: 'nextmoves', label: 'Funding Roadmap' })
                }}
              >
                <TerminalBox label="Funding Roadmap" variant="warning">
                  <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.25rem', color: colors.cyan }}>
                      {mockData.simulation.fundingRoadmap.approach}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockData.simulation.fundingRoadmap.milestones.map((milestone: any, i: number) => (
                      <div key={i} style={{ padding: '1rem', backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{milestone.stage}</div>
                          <div style={{ color: colors.green, fontFamily: 'JetBrains Mono, monospace', fontSize: '1.125rem', fontWeight: 'bold' }}>
                            {milestone.amount}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.5rem' }}>
                          Timing: {milestone.timing}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                          Goal: {milestone.goal}
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalBox>
              </div>
              )}

              <TerminalBox label="Export Options" variant="default">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <button style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.cyan}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
                  >
                    PDF Report
                  </button>
                  <button style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.cyan}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
                  >
                    Landing Page
                  </button>
                  <button style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.cyan}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
                  >
                    Raw Data CSV
                  </button>
                </div>
              </TerminalBox>
            </div>
          )}
        </div>
      </div>

      {/* AGENT PANEL - 30% */}
      <div style={{ width: '30%', borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', backgroundColor: colors.surface }}>
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>
          <div style={{ color: colors.green }}>$ shipit agent</div>
        </div>

        {/* Messages - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div ref={messagesEndRef} />
          {agentMessages.map((msg, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textDim, marginBottom: '0.25rem' }}>
                {msg.role === 'user' ? '> user' : '> agent'}
              </div>
              <TerminalBox variant={msg.role === 'user' ? 'default' : 'info'}>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {msg.content}
                </div>
              </TerminalBox>
            </div>
          ))}

          {/* Thinking Display */}
          <TerminalBox label="Planning" variant="info" glow>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: colors.cyan }}>●</span>
                <div>
                  <div>I need to find the most recent AAPL stock price.</div>
                  <div style={{ color: colors.textDim, marginTop: '0.25rem' }}>
                    └─ Apple (AAPL) current price: $208.59, down 1.09% today.
                  </div>
                </div>
              </div>
            </div>
          </TerminalBox>

          {/* Answer Box */}
          <TerminalBox label="Answer" variant="default" glow>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: colors.textPrimary }}>
              Apple Inc. (AAPL) is currently trading at $208.59, down 1.09% today.

              <ul style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: colors.textSecondary, paddingLeft: 0, listStyle: 'none' }}>
                <li>• 7-day change: -2.49%</li>
                <li>• 30-day change: +6.86%</li>
                <li>• Year-to-date change: -16.51%</li>
                <li>• 52-week high: $260.10</li>
                <li>• 52-week low: $164.07</li>
              </ul>
            </div>
          </TerminalBox>

          {/* Redeploy Prompt */}
          <div className="animate-pulse-glow">
            <TerminalBox label="Changes Detected" variant="error">
              <div style={{ fontSize: '0.875rem', color: colors.textPrimary, marginBottom: '0.75rem' }}>
                • Business model: Free → $50/seat B2B
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.75rem' }}>
                Affected sections:
                <div style={{ marginLeft: '0.5rem', marginTop: '0.25rem' }}>
                  <div>⟳ Vision</div>
                  <div>⟳ Battlefield</div>
                  <div>⟳ Verdict</div>
                  <div style={{ color: colors.textDim }}>─ Market</div>
                </div>
              </div>
              <button style={{
                width: '100%',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                padding: '0.5rem',
                backgroundColor: colors.magenta,
                color: colors.background,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ⟳ Redeploy
              </button>
            </TerminalBox>
          </div>
        </div>

        {/* Input - Fixed at bottom */}
        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '1rem', backgroundColor: colors.surface }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: colors.background,
            border: `1px solid ${inputFocused ? colors.green : colors.border}`,
            transition: 'border-color 0.2s'
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: colors.green }}>
              &gt;
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about the analysis..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.textPrimary,
                border: 'none',
                outline: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            />
          </div>
          <div style={{ marginTop: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: focusedBox ? colors.amber : colors.textDim }}>
            Mode: {focusedBox ? `${sections.find(s => s.id === focusedBox.section)?.label} | ${focusedBox.label}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
