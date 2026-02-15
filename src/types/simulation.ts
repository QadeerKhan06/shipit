// Section navigation types
export type SectionName = 'vision' | 'market' | 'battlefield' | 'verdict' | 'advisors'

// Pipeline status types
export type PipelineStatus = 'idle' | 'researching' | 'generating' | 'complete' | 'error'
export type SectionLoadStatus = 'pending' | 'loading' | 'complete' | 'error'

export interface PipelineMessage {
  id: string
  timestamp: string
  message: string
  status: 'in_progress' | 'complete' | 'error'
  section?: SectionName
  detail?: string
}

// Competitor data
export interface Competitor {
  name: string
  x: number
  y: number
  funding: string
  pricing: string
}

// Market data
export interface TrendPoint {
  date?: string
  year?: string
  value: number
}

export interface DemandTrendPoint {
  year: string
  value: number
}

export interface WorkforceCity {
  city: string
  count: number
}

export interface OpportunityGapPoint {
  year: string
  demand: number
  supply: number
}

export interface UserQuote {
  platform: string
  content: string
  insight: string
  url?: string
}

export interface MarketData {
  trendsData: TrendPoint[]
  demandTrend: DemandTrendPoint[]
  demandTrendSubtitle: string
  workforceCapacity: WorkforceCity[]
  workforceSubtitle: string
  opportunityGap: OpportunityGapPoint[]
  fundingTotal: string
  jobPostings: number
  userQuotes: UserQuote[]
}

// Case studies
export interface TimelineEvent {
  date: string
  event: string
}

export interface CaseStudy {
  name: string
  years: string
  outcome: 'succeeded' | 'failed' | 'acquired' | 'pivoted'
  timeline: TimelineEvent[]
  lesson: string
}

// Evidence (strengths/risks)
export interface Evidence {
  title: string
  description: string
  source: string
}

// Next steps
export interface NextStep {
  priority: 'critical' | 'important' | 'helpful'
  title: string
  description: string
  /** Type of action for interactive buttons */
  actionType?: 'script' | 'plan' | 'research'
  /** Pre-filled prompt for agent interaction */
  actionPrompt?: string
}

// ========== OPTIONAL BLOCK TYPES ==========

// Vision optional
export interface UserPersona {
  name: string
  description: string
  pains: string[]
  gains: string[]
}

export interface TargetUsers {
  primary: UserPersona
  secondary: UserPersona
}

export interface UnitEconomicsSnapshot {
  customerPays: number
  platformKeeps: number
  workerGets: number
  breakdown: string
}

export interface ProblemSolutionMap {
  problem: string
  solution: string
  value: string
}

// Market extended optional
export interface MarketSize {
  tam: number
  sam: number
  som: number
}

export interface FundingRound {
  company: string
  amount: string
  date: string
  stage: string
}

export interface FundingActivity {
  total: string
  recentRounds: FundingRound[]
}

export interface JobPostingTrend {
  year: string
  postings: number
}

export interface RegulatoryState {
  state: string
  complexity: 'Low' | 'Medium' | 'High'
  licensing: 'Required' | 'Not Required'
  notes: string
}

export interface HypeRealityPoint {
  year: string
  hype: number
  reality: number
}

export interface MarketExtended {
  marketSize: MarketSize
  fundingActivity: FundingActivity
  jobPostingsTrend: JobPostingTrend[]
  regulatoryLandscape: RegulatoryState[]
  hypeVsReality: HypeRealityPoint[]
}

// Battlefield optional
export interface StrategicPosition {
  opportunity: string
  risk: string
}

export interface FeatureCompetitor {
  name: string
  values: boolean[]
}

export interface FeatureMatrix {
  features: string[]
  competitors: FeatureCompetitor[]
}

export interface FundingCompetitor {
  name: string
  value: number
}

export interface CompetitorFundingPoint {
  date: string
  competitors: FundingCompetitor[]
}

export interface SaturationScore {
  score: number
  label: string
  description: string
}

export interface MoatAnalysis {
  networkEffects: number
  brandTrust: number
  switchingCosts: number
  dataAdvantage: number
  regulatoryBarriers: number
}

// History optional
export interface FatalFlaw {
  title: string
  description: string
  example: string
}

export interface SuccessPattern {
  title: string
  description: string
  keyMetrics: string
}

export interface CompanyBaseline {
  name: string
  burnRate: string
  growthRate: string
  marketCoverage: string
  runway: string
}

export interface RiskBaseline {
  failed: CompanyBaseline
  yourPlan: CompanyBaseline
}

export interface TechEvolutionPoint {
  year: string
  tech: string
  impact: string
}

// Verdict optional
export interface UnitEconomics {
  ltv: number
  cac: number
  ratio: number
  paybackMonths: number
  grossMargin: number
}

export interface CaseScenario {
  scenario: string
  outcome: string
  probability: string
}

export interface BullBearCase {
  bull: CaseScenario
  bear: CaseScenario
}

export interface ProfitabilityPoint {
  milestone: string
  months: number
  mrr: number
}

export interface DefensibilityScore {
  networkEffects: number
  brandTrust: number
  switchingCosts: number
  dataAsset: number
  scale: number
  overallScore: number
  label: string
}

export interface FinalVerdict {
  recommendation: string
  confidence: string
  reasoning: string
  goNoGo: string
}

// Next moves optional
export interface ValidationItem {
  item: string
  completed: boolean
  priority: 'critical' | 'important' | 'helpful'
  /** Data source reference (e.g., "Market: 40% growth trend") */
  dataSource?: string
  /** Specific metric or finding that supports this task */
  evidence?: string
}

export interface SprintWeek {
  week: number
  goal: string
  tasks: string[]
  metrics: string
  /** Estimated weekly burn for this phase */
  weeklyBurn?: string
  /** Research reference that informs this week's focus */
  researchRef?: string
}

export interface AcquisitionChannel {
  channel: string
  cac: number
  ltv: number
  volume: number
  viability: 'High' | 'Medium' | 'Low'
}

export interface FundingMilestone {
  stage: string
  amount: string
  timing: string
  goal: string
  /** Success criteria KPIs to unlock this stage */
  successCriteria?: string[]
}

export interface FundingRoadmap {
  approach: string
  milestones: FundingMilestone[]
}

// ========== MAIN SIMULATION TYPE ==========

export interface SimulationData {
  // Core mandatory
  name: string
  tagline: string
  valueProposition: string
  businessModel: string
  features: string[]
  competitors: Competitor[]
  secondaryCompetitors: Competitor[]
  market: MarketData
  caseStudies: CaseStudy[]
  strengths: Evidence[]
  risks: Evidence[]
  hardQuestion: string
  verdict: string
  nextSteps: NextStep[]

  // Vision optional
  targetUsers: TargetUsers
  ahaMoment: string
  unitEconomicsSnapshot: UnitEconomicsSnapshot
  problemSolutionMap: ProblemSolutionMap

  // Market optional (extended)
  marketExtended: MarketExtended

  // Battlefield optional
  strategicPosition: StrategicPosition
  featureMatrix: FeatureMatrix
  competitorFunding: CompetitorFundingPoint[]
  saturationScore: SaturationScore
  moatAnalysis: MoatAnalysis

  // History optional
  fatalFlaw: FatalFlaw
  successPattern: SuccessPattern
  riskBaseline: RiskBaseline
  techEvolution: TechEvolutionPoint[]

  // Verdict optional
  unitEconomics: UnitEconomics
  bullBearCase: BullBearCase
  profitabilityPath: ProfitabilityPoint[]
  defensibilityScore: DefensibilityScore
  finalVerdict: FinalVerdict

  // AI-recommended optional blocks
  recommendedBlocks?: string[]

  // Advisors
  advisors: AdvisorPersona[]
}

// Advisor personas
export interface AdvisorPersona {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  color: string
  bio: string
  expertise: string[]
  openingMessage: string
  systemContext: string
  voiceGender: 'male' | 'female'
}

// Agent message type
export interface AgentMessage {
  role: 'agent' | 'user' | 'system'
  content: string
  /** Optional metadata for agent context (block data, sources, etc.) */
  metadata?: Record<string, unknown>
}

// Focused box state
export interface FocusedBox {
  section: SectionName
  label: string
}

// Block configuration
export interface BlockConfig {
  id: string
  label: string
}

export interface OptionalBlocksBySection {
  vision: BlockConfig[]
  market: BlockConfig[]
  battlefield: BlockConfig[]
  verdict: BlockConfig[]
  advisors: BlockConfig[]
}
