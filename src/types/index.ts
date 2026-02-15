// Core simulation type
export interface Simulation {
  id: string
  idea: string
  createdAt: Date
  updatedAt: Date
  version: number

  // Extracted
  name: string
  tagline: string
  valueProposition: string
  targetUsers: {
    primary: UserPersona
    secondary?: UserPersona
  }
  businessModel: string
  features: string[]

  // Research
  market: MarketData
  competitors: Competitor[]
  caseStudies: CaseStudy[]

  // Synthesis
  strengths: Evidence[]
  risks: Evidence[]
  hardQuestion: string
  verdict: string
  nextSteps: ActionItem[]
}

export interface UserPersona {
  name: string
  description: string
  gains: string[]
  pains: string[]
}

export interface MarketData {
  trendsData: { date: string; value: number }[]
  trendsGrowth: string
  fundingTotal: string
  fundingRounds: { company: string; amount: string; date: string }[]
  jobPostings: number
  userQuotes: Quote[]
}

export interface Quote {
  source: string
  platform: 'reddit' | 'appstore' | 'twitter' | 'news' | 'other'
  content: string
  upvotes?: number
  insight: string
  url: string
}

export interface Competitor {
  name: string
  description: string
  funding: string
  pricing: string
  position: { x: number; y: number }
  strengths: string[]
  weaknesses: string[]
  url: string
  logoUrl?: string
}

export interface CaseStudy {
  name: string
  years: string
  outcome: 'failed' | 'pivoted' | 'succeeded'
  timeline: { date: string; event: string }[]
  quote?: { text: string; source: string; url: string }
  lesson: string
  lessonType: 'warning' | 'encouraging'
}

export interface Evidence {
  title: string
  description: string
  source: string
  url?: string
}

export interface ActionItem {
  priority: 'critical' | 'important' | 'helpful'
  title: string
  description: string
  timeEstimate: string
}

// Agent types
export interface AgentMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export interface ThinkingStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  result?: string
}

export interface DetectedChange {
  field: string
  oldValue: string
  newValue: string
}

export interface RedeployRequest {
  changes: DetectedChange[]
  affectedSections: string[]
}

// Section types
export type SectionName = 'vision' | 'market' | 'battlefield' | 'history' | 'verdict' | 'nextmoves'

export type AgentMode = 'edit' | 'research' | 'analysis' | 'learning' | 'strategy' | 'planning'
