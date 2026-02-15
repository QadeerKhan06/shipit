// Research context — raw data gathered from web searches before section generation

export interface SearchResult {
  title: string
  snippet: string
  link: string
}

export interface CompetitorResearch {
  name: string
  description: string
  funding: string
  pricing: string
  strengths: string[]
  weaknesses: string[]
}

export interface MarketResearch {
  marketSize: string
  growthRate: string
  keyTrends: string[]
  targetDemographics: string[]
}

export interface UserComplaint {
  source: string
  content: string
  theme: string
}

export interface CaseStudyResearch {
  name: string
  outcome: string
  keyDetails: string
  lesson: string
}

export interface RegulatoryResearch {
  area: string
  requirements: string
  complexity: string
}

export interface ResearchContext {
  idea: string
  competitors: CompetitorResearch[]
  market: MarketResearch
  userComplaints: UserComplaint[]
  caseStudies: CaseStudyResearch[]
  regulatory: RegulatoryResearch[]
  rawSearchResults: SearchResult[]
  timestamp: string
}
