import { flashModelJSON } from './gemini'
import type { ResearchContext } from '@/types/research'
import type { SimulationData } from '@/types/simulation'

/**
 * Generate a section by sending research context + section-specific prompt to Gemini.
 * Returns parsed JSON matching the section's schema.
 */
async function generateSection<T>(
  systemPrompt: string,
  researchContext: ResearchContext,
  sectionLabel: string,
  expectedKeys?: string[]
): Promise<T> {
  const result = await flashModelJSON.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\n## Research Data\n\n${JSON.stringify(researchContext, null, 2)}` }]
    }]
  })

  const text = result.response.text()
  try {
    let parsed = JSON.parse(text)

    // If Gemini wrapped the response in an extra key (e.g., {"vision": {...}}),
    // unwrap it by checking if expected keys are missing at the top level
    if (expectedKeys && expectedKeys.length > 0) {
      const hasExpected = expectedKeys.some(k => k in parsed)
      if (!hasExpected) {
        const keys = Object.keys(parsed)
        if (keys.length === 1 && typeof parsed[keys[0]] === 'object') {
          console.warn(`[${sectionLabel}] Unwrapping nested response from key "${keys[0]}"`)
          parsed = parsed[keys[0]]
        }
      }
    }

    return parsed as T
  } catch {
    console.error(`Failed to parse ${sectionLabel} generation output`)
    throw new Error(`Invalid JSON from Gemini for ${sectionLabel}`)
  }
}

// ========== SECTION PROMPTS ==========

const VISION_PROMPT = `You are generating the "Vision" section of a startup validation report. Based on the research data provided, generate a JSON object with these EXACT fields:

{
  "name": "Short startup name (2-3 words max)",
  "tagline": "One-line tagline describing the value proposition",
  "valueProposition": "2-3 sentence value proposition",
  "businessModel": "Business model description (e.g., 'Commission-based marketplace (15% fee)')",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "ahaMoment": "The moment when users first experience the core value",
  "targetUsers": {
    "primary": {
      "name": "Primary user segment name",
      "description": "Who they are",
      "pains": ["Pain 1", "Pain 2", "Pain 3"],
      "gains": ["Gain 1", "Gain 2", "Gain 3"]
    },
    "secondary": {
      "name": "Secondary user segment name",
      "description": "Who they are",
      "pains": ["Pain 1", "Pain 2", "Pain 3"],
      "gains": ["Gain 1", "Gain 2", "Gain 3"]
    }
  },
  "unitEconomicsSnapshot": {
    "customerPays": 0,
    "platformKeeps": 0,
    "workerGets": 0,
    "breakdown": "Customer pays $X → Platform takes $Y (Z%) → Provider earns $W"
  },
  "problemSolutionMap": {
    "problem": "Core problem statement",
    "solution": "How this startup solves it",
    "value": "The value created"
  }
}

IMPORTANT:
- name: Create a distinctive, memorable brand name. Do NOT use the pattern "[Domain] AI" or "AI [Domain]" (e.g., "AI Pet Health", "Auto Finance AI"). Instead create something catchy and brandable (e.g., "PetPulse", "Finley", "ChefNest"). Also ensure the name does NOT conflict with existing well-known companies in the same space.
- tagline: Make it specific to what makes this startup unique, not a generic statement. Bad: "Smart health for happy pets." Good: "Your pet's vitals, on your wrist."
- ahaMoment: Describe a specific, emotionally vivid moment, not a generic benefit statement.
- Be specific to the actual startup idea. Use research data for realistic pricing and positioning. All monetary values should be numbers (not strings).

Return ONLY the JSON.`

// Market prompt is built dynamically in generateMarket() to inject real data
function buildMarketPrompt(research: ResearchContext): string {
  const realData = research.realMarketData
  const hasGoogleTrends = realData?.googleTrends && realData.googleTrends.data.length > 0

  // Build the real trends data instruction
  let trendsInstruction = ''
  if (hasGoogleTrends) {
    const td = realData!.googleTrends!
    const trendsJson = JSON.stringify(td.data)
    trendsInstruction = `
## REAL Google Trends Data (USE THIS — do not fabricate)
Keyword: "${td.keyword}"
Data: ${trendsJson}

For trendsData and demandTrend: You MUST use these exact values from Google Trends. Map them directly:
- trendsData: use { "date": year, "value": value } format
- demandTrend: use { "year": year, "value": value } format
- demandTrendSubtitle: "'${td.keyword}' search interest (Google Trends)"
- For hypeVsReality: use the Google Trends values as the "hype" dimension. For "reality", estimate actual market adoption/revenue growth as a percentage of hype (typically 60-85% of hype in mature markets, 30-50% in overhyped markets). Base your reality estimate on the research data about actual market performance.`
  } else {
    trendsInstruction = `
NOTE: Google Trends data was unavailable. For trendsData and demandTrend, estimate realistic values based on the research data. NOT every market has a smooth upward curve — some had a COVID dip in 2020, some spiked and cooled off. Reflect the real shape of THIS market's trend.`
  }

  // Build job posting stats context
  let jobStatsInstruction = ''
  if (realData?.jobPostingStats && realData.jobPostingStats.length > 0) {
    const snippets = realData.jobPostingStats.slice(0, 4).map(s => `- ${s.title}: ${s.snippet} (${s.link})`).join('\n')
    jobStatsInstruction = `
## Real Job Posting Data (from web search — use these as basis)
${snippets}
Use these sources to ground your jobPostings number and jobPostingsTrend. Extract real numbers from the snippets where possible.`
  }

  // Build workforce stats context
  let workforceInstruction = ''
  if (realData?.workforceStats && realData.workforceStats.length > 0) {
    const snippets = realData.workforceStats.slice(0, 4).map(s => `- ${s.title}: ${s.snippet} (${s.link})`).join('\n')
    workforceInstruction = `
## Real Workforce/Labor Data (from web search — use these as basis)
${snippets}
Use these sources to ground your workforceCapacity numbers. Extract real statistics from the snippets where possible.`
  }

  return `You are generating the "Market" section of a startup validation report. Based on the research data provided, generate a JSON object with these EXACT fields:

{
  "market": {
    "trendsData": [
      { "date": "2019", "value": 0 },
      { "date": "2020", "value": 0 },
      { "date": "2021", "value": 0 },
      { "date": "2022", "value": 0 },
      { "date": "2023", "value": 0 },
      { "date": "2024", "value": 0 }
    ],
    "demandTrend": [
      { "year": "2019", "value": 0 },
      { "year": "2020", "value": 0 },
      { "year": "2021", "value": 0 },
      { "year": "2022", "value": 0 },
      { "year": "2023", "value": 0 },
      { "year": "2024", "value": 0 }
    ],
    "demandTrendSubtitle": "Short description of what the demand trend measures",
    "workforceSubtitle": "Short description of the workforce being measured, e.g. 'Licensed home health aides'",
    "workforceCapacity": [
      { "city": "San Francisco", "count": 185000 },
      { "city": "New York", "count": 320000 },
      { "city": "Austin", "count": 95000 },
      { "city": "Chicago", "count": 145000 }
    ],
    "opportunityGap": [
      { "year": "2019", "demand": 55, "supply": 20 },
      { "year": "2020", "demand": 62, "supply": 28 },
      { "year": "2021", "demand": 70, "supply": 35 },
      { "year": "2022", "demand": 78, "supply": 42 },
      { "year": "2023", "demand": 85, "supply": 48 },
      { "year": "2024", "demand": 92, "supply": 55 }
    ],
    "fundingTotal": "$2.3B+",
    "jobPostings": 2500,
    "userQuotes": [
      {
        "platform": "reddit",
        "content": "A real user complaint or need from the research data",
        "insight": "What this tells us about market demand",
        "url": "https://reddit.com/r/relevant_subreddit/..."
      },
      {
        "platform": "twitter",
        "content": "Another real user sentiment from research",
        "insight": "What this reveals about user needs",
        "url": "https://twitter.com/..."
      },
      {
        "platform": "appstore",
        "content": "A product review or complaint about existing solutions",
        "insight": "What gap this highlights",
        "url": "https://apps.apple.com/..."
      }
    ]
  },
  "marketExtended": {
    "marketSize": {
      "tam": 0,
      "sam": 0,
      "som": 0
    },
    "fundingActivity": {
      "total": "$2.3B+",
      "recentRounds": [
        { "company": "Acme Health", "amount": "$150M", "date": "2023", "stage": "Series C" },
        { "company": "BetaLogistics", "amount": "$45M", "date": "2022", "stage": "Series B" },
        { "company": "NovaTech", "amount": "$12M", "date": "2024", "stage": "Series A" }
      ]
    },
    "jobPostingsTrend": [
      { "year": "2021", "postings": 1200 },
      { "year": "2022", "postings": 1800 },
      { "year": "2023", "postings": 2400 },
      { "year": "2024", "postings": 2900 },
      { "year": "2025", "postings": 3400 }
    ],
    "regulatoryLandscape": [
      { "state": "CA", "complexity": "High", "licensing": "Required", "notes": "CCPA data privacy requirements apply to consumer data collection" },
      { "state": "NY", "complexity": "Medium", "licensing": "Required", "notes": "DFS oversight for financial-adjacent services" },
      { "state": "TX", "complexity": "Low", "licensing": "Varies", "notes": "Fewer state-level requirements, federal rules still apply" }
    ],
    "hypeVsReality": [
      { "year": "2019", "hype": 30, "reality": 25 },
      { "year": "2020", "hype": 40, "reality": 33 },
      { "year": "2021", "hype": 55, "reality": 42 },
      { "year": "2022", "hype": 68, "reality": 56 },
      { "year": "2023", "hype": 80, "reality": 68 },
      { "year": "2024", "hype": 90, "reality": 80 }
    ]
  }
}
${trendsInstruction}
${jobStatsInstruction}
${workforceInstruction}

IMPORTANT:
- workforceSubtitle: a short phrase describing the workforce being counted (e.g., "Licensed home health aides", "Freelance web developers"). Be specific to the startup's domain.
- workforceCapacity: cities with relevant available workforce. Use 3-5 cities. Use realistic, VARIED numbers grounded in the workforce data sources above. Do NOT invent numbers — base them on the real statistics provided.
- opportunityGap: "demand" = unmet market need level (0-100), "supply" = existing solutions coverage (0-100). Use EXACTLY the field names "demand" and "supply". Include 5-6 data points from 2019-2024.
- jobPostings: current active job postings in this space (must be > 0). Ground this in the job posting data sources above.
- userQuotes: Include 3-5 quotes from the research data. Use the actual platform name from each URL.
- fundingTotal: total VC funding in this market. Use a realistic aggregate from research data.
- fundingActivity.recentRounds: 3-4 real funding rounds. Use ACTUAL company names and amounts from research. If uncertain, use "Undisclosed" for amount.
- TAM/SAM/SOM: raw numbers (e.g., 50000000000 for $50B). CRITICAL: TAM > SAM > SOM > 0 always.
- jobPostingsTrend: 5 data points from 2021-2025. Ground in the job posting sources above.
- regulatoryLandscape: 3-4 entries with specific regulation descriptions.
- hypeVsReality: 5-6 data points. If Google Trends data is provided, use those values for "hype".

Return ONLY the JSON.`
}

const BATTLEFIELD_PROMPT = `You are generating the "Battlefield" (competitive analysis) section of a startup validation report. Based on the research data provided, generate a JSON object with these EXACT fields:

{
  "competitors": [
    { "name": "Competitor1", "x": 80, "y": 70, "funding": "$XXM", "pricing": "Premium" },
    { "name": "Competitor2", "x": 50, "y": 40, "funding": "$XXM", "pricing": "Mid-range" },
    { "name": "YOU", "x": 45, "y": 35, "funding": "$0", "pricing": "Your Position" }
  ],
  "secondaryCompetitors": [
    { "name": "Adjacent1", "x": 60, "y": 50, "funding": "$XXM", "pricing": "Task-Based" },
    { "name": "YOU", "x": 45, "y": 35, "funding": "$0", "pricing": "Your Position" }
  ],
  "strategicPosition": {
    "opportunity": "Specific market gap this startup can exploit",
    "risk": "Biggest competitive threat"
  },
  "featureMatrix": {
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
    "competitors": [
      { "name": "You", "values": [true, true, true, true, true, false] },
      { "name": "Competitor1", "values": [true, false, false, true, true, true] },
      { "name": "Competitor2", "values": [true, false, false, true, false, false] }
    ]
  },
  "competitorFunding": [
    {
      "date": "2019",
      "competitors": [
        { "name": "Competitor1", "value": 10 },
        { "name": "Competitor2", "value": 50 }
      ]
    },
    {
      "date": "2023",
      "competitors": [
        { "name": "Competitor1", "value": 200 },
        { "name": "Competitor2", "value": 100 }
      ]
    }
  ],
  "saturationScore": {
    "score": 60,
    "label": "Moderately Crowded",
    "description": "Assessment of market saturation"
  },
  "moatAnalysis": {
    "networkEffects": 40,
    "brandTrust": 30,
    "switchingCosts": 25,
    "dataAdvantage": 20,
    "regulatoryBarriers": 50
  },
  "caseStudies": [
    {
      "name": "Instacart",
      "years": "2012-2021",
      "outcome": "succeeded",
      "timeline": [
        { "date": "2012", "event": "Founded, launched in SF" },
        { "date": "2015", "event": "Raised $220M Series C, expanded to 15 cities" },
        { "date": "2021", "event": "Valued at $39B, IPO filed" }
      ],
      "lesson": "Dominated by owning logistics layer, not inventory"
    },
    {
      "name": "Homejoy",
      "years": "2012-2015",
      "outcome": "failed",
      "timeline": [
        { "date": "2012", "event": "Launched home cleaning marketplace" },
        { "date": "2013", "event": "Raised $38M, expanded to 30+ cities" },
        { "date": "2015", "event": "Shut down — worker misclassification lawsuits" }
      ],
      "lesson": "Scaling before solving unit economics and legal risks killed it"
    }
  ]
}

IMPORTANT:
- competitors x/y: x = market coverage (0-100), y = feature completeness (0-100)
- Include 3-5 primary competitors + "YOU" positioned strategically
- For competitor funding values, use realistic amounts based on research. If a competitor's funding is unknown, use "Undisclosed" instead of "$0". Only "YOU" should have "$0" funding.
- secondaryCompetitors: adjacent market players, can be empty array if not applicable
- featureMatrix: 5-7 features, "You" should be first competitor
- competitorFunding: funding in $M over 4-5 time periods. Only include competitors with significant funding.
- saturationScore.score: 0-100 (0=blue ocean, 100=saturated)
- moatAnalysis values: 0-100 for each dimension
- caseStudies: 2-3 case studies of REAL, named companies in the SAME industry as the startup idea. Use actual company names with specific, verifiable details (founding year, funding raised, key milestones). Do NOT use vague descriptions like "unspecified AI startup" or made-up names. Outcome must be one of: "succeeded", "failed", "acquired", "pivoted". CRITICAL: Do NOT reuse the examples from this prompt (Instacart, Homejoy). Find companies that are directly relevant to THIS specific startup's industry. For example, if the idea is about food delivery, use companies like DoorDash, Munchery, or Sprig — not Instacart or Homejoy.
- featureMatrix: "You" should NOT have all features set to true. Be realistic — a new startup won't have everything on day one. Give "You" 4-5 out of 6-7 features as true, and give competitors credit for features they actually have based on the research data.

Return ONLY the JSON.`

const VERDICT_PROMPT = `You are generating the "Verdict" section of a startup validation report. You have access to the research data AND the previously generated sections. Generate a JSON object with these EXACT fields:

{
  "strengths": [
    { "title": "STRENGTH TITLE", "description": "Why this is a strength", "source": "Data source" }
  ],
  "risks": [
    { "title": "RISK TITLE", "description": "Why this is a risk", "source": "Data source" }
  ],
  "hardQuestion": "The single hardest question this founder must answer (under 15 words, sharp and specific)",
  "verdict": "2-3 sentence overall assessment",
  "unitEconomics": {
    "ltv": 0,
    "cac": 0,
    "ratio": 0,
    "paybackMonths": 0,
    "grossMargin": 0
  },
  "bullBearCase": {
    "bull": {
      "scenario": "Best case scenario description",
      "outcome": "What success looks like",
      "probability": "XX%"
    },
    "bear": {
      "scenario": "Worst case scenario description",
      "outcome": "What failure looks like",
      "probability": "XX%"
    }
  },
  "profitabilityPath": [
    { "milestone": "Launch MVP", "months": 0, "mrr": 0 },
    { "milestone": "First 100 customers", "months": 3, "mrr": 5000 },
    { "milestone": "Break even", "months": 12, "mrr": 50000 },
    { "milestone": "Profitable", "months": 18, "mrr": 100000 },
    { "milestone": "Scale mode", "months": 24, "mrr": 250000 }
  ],
  "defensibilityScore": {
    "networkEffects": 60,
    "brandTrust": 45,
    "switchingCosts": 35,
    "dataAsset": 30,
    "scale": 25,
    "overallScore": 39,
    "label": "Moderate Moat"
  },
  "finalVerdict": {
    "recommendation": "Go / Validate First / Pivot / No-Go",
    "confidence": "High / Medium-High / Medium / Low",
    "reasoning": "2-3 sentence reasoning based on data",
    "goNoGo": "GO if [specific condition]"
  },
  "fatalFlaw": {
    "title": "The biggest potential fatal flaw",
    "description": "Why this could kill the startup",
    "example": "Historical example of this flaw causing failure"
  },
  "successPattern": {
    "title": "The pattern winners followed",
    "description": "What successful companies in this space did right",
    "keyMetrics": "Specific metrics that mattered"
  },
  "riskBaseline": {
    "failed": {
      "name": "Failed Company",
      "burnRate": "$XXK/mo",
      "growthRate": "XX% MoM",
      "marketCoverage": "X cities",
      "runway": "XX months"
    },
    "yourPlan": {
      "name": "Your Roadmap",
      "burnRate": "$XXK/mo",
      "growthRate": "XX% MoM",
      "marketCoverage": "X cities",
      "runway": "XX+ months"
    }
  },
  "techEvolution": [
    { "year": "2010", "tech": "Technology at the time", "impact": "Effect on this market" },
    { "year": "2024", "tech": "Current technology", "impact": "Current effect" }
  ],
  "nextSteps": [
    { "priority": "critical", "title": "Step title", "description": "What to do" },
    { "priority": "important", "title": "Step title", "description": "What to do" },
    { "priority": "helpful", "title": "Step title", "description": "What to do" }
  ],
  "recommendedBlocks": ["market-regulatory", "battlefield-case-studies", "verdict-bull-bear"]
}

IMPORTANT:
- strengths: 3-4 evidence-backed strengths with real sources
- risks: 3-4 evidence-backed risks with real sources
- hardQuestion: the single toughest question — under 15 words, sharp and specific. NOT a long sentence.
- unitEconomics: LTV and CAC in dollars, ratio = LTV/CAC, grossMargin as percentage (0-100)
- profitabilityPath: 5 milestones with months (from start) and MRR in dollars
- defensibilityScore: all values 0-100, overallScore is weighted average
- label: "No Moat" (0-20), "Weak Moat" (21-40), "Moderate Moat" (41-60), "Strong Moat" (61-80), "Fortress" (81-100)
- finalVerdict.recommendation must be one of: "Go", "Validate First", "Pivot", "No-Go"
- nextSteps: 3-5 items, priority must be "critical", "important", or "helpful"
- techEvolution: 3-4 points showing technology progression
- bullBearCase: Vary the probabilities based on the actual analysis. A crowded market with strong competitors = higher bear probability. A blue-ocean opportunity = higher bull probability. Do NOT default to 25%/35% — actually think about the specific idea's odds. Bull + bear should sum to 50-70% (remaining is the base/middle case).
- recommendedBlocks: Choose which optional blocks are most relevant for THIS specific startup idea. The selection should be DIFFERENT for different types of startups. Pick 5-8 from this list:
  "vision-target-users", "market-regulatory", "market-hype-reality", "battlefield-feature-matrix", "battlefield-funding-velocity", "battlefield-saturation", "battlefield-moat-analysis", "battlefield-case-studies", "verdict-bull-bear", "verdict-profitability-path", "verdict-defensibility", "verdict-fatal-flaw", "advisors-competitor-user"
  Rules for selection:
  - SKIP "market-regulatory" for pure software/SaaS startups with no licensing requirements
  - SKIP "battlefield-funding-velocity" if competitors are bootstrapped or funding data is sparse
  - INCLUDE "market-regulatory" for healthcare, fintech, food, legal, or regulated industries
  - INCLUDE "battlefield-moat-analysis" for network-effect or data-driven businesses
  - INCLUDE "verdict-defensibility" for commodity/low-switching-cost markets
  - INCLUDE "advisors-competitor-user" when there are strong existing competitors with vocal users
  - A hardware startup needs different blocks than a SaaS startup. A marketplace needs different blocks than a B2B tool.
  Do NOT always pick the same blocks — tailor the selection to the specific idea.

Return ONLY the JSON.`

const ADVISORS_PROMPT = `You are generating advisor personas for a startup validation report. Based on the research data, create 3 realistic advisor personas who can provide different perspectives on this startup idea.

Generate a JSON object with this EXACT structure:

{
  "advisors": [
    {
      "id": "target-customer",
      "name": "Full Name",
      "title": "Job Title",
      "company": "Context (e.g., 'Lives in suburban Boston')",
      "avatar": "XX",
      "color": "#3fb950",
      "bio": "2-3 sentence bio explaining their background and why they'd use/evaluate this product",
      "expertise": ["Area 1", "Area 2", "Area 3"],
      "openingMessage": "A realistic first message from this person — showing their perspective, concerns, and interest. Should be 2-3 sentences.",
      "systemContext": "You are [Name], a [role]. [Brief instruction for how to respond in character].",
      "voiceGender": "female"
    },
    {
      "id": "skeptical-vc",
      "name": "Full Name",
      "title": "Partner",
      "company": "VC Firm Name",
      "avatar": "XX",
      "color": "#58a6ff",
      "bio": "2-3 sentence bio as an investor who has seen similar startups",
      "expertise": ["Unit economics", "Marketplace dynamics", "Competitive moats"],
      "openingMessage": "A tough, skeptical opening from a VC who has seen similar ideas fail. Reference specific competitors from the research.",
      "systemContext": "You are [Name], a skeptical VC. You ask tough questions about market size, defensibility, and unit economics.",
      "voiceGender": "male"
    },
    {
      "id": "competitor-customer",
      "name": "Full Name",
      "title": "Job Title",
      "company": "Uses [Competitor] for X months",
      "avatar": "XX",
      "color": "#f778ba",
      "bio": "2-3 sentence bio as someone who uses a competing product",
      "expertise": ["User experience", "Pricing sensitivity", "Product quality"],
      "openingMessage": "A casual message from someone who uses a competitor but has specific complaints. Reference real competitor names.",
      "systemContext": "You are [Name], a [competitor] customer who is somewhat dissatisfied. You are open to alternatives but need convincing.",
      "voiceGender": "male"
    }
  ]
}

IMPORTANT:
- avatar: exactly 2 uppercase letters (initials)
- colors: use exactly "#3fb950" (green), "#58a6ff" (blue), "#f778ba" (pink)
- IDs must be exactly: "target-customer", "skeptical-vc", "competitor-customer"
- voiceGender: must be "male" or "female" — MUST match the persona's name and identity. If the name is typically male, use "male". If female, use "female".
- Make personas specific to this startup's market and competitors
- Opening messages should feel natural and reference real research findings
- Names should be diverse and realistic

Return ONLY the JSON.`

// ========== SECTION GENERATORS ==========

interface VisionOutput {
  name: string
  tagline: string
  valueProposition: string
  businessModel: string
  features: string[]
  ahaMoment: string
  targetUsers: SimulationData['targetUsers']
  unitEconomicsSnapshot: SimulationData['unitEconomicsSnapshot']
  problemSolutionMap: SimulationData['problemSolutionMap']
}

interface MarketOutput {
  market: SimulationData['market']
  marketExtended: SimulationData['marketExtended']
}

interface BattlefieldOutput {
  competitors: SimulationData['competitors']
  secondaryCompetitors: SimulationData['secondaryCompetitors']
  strategicPosition: SimulationData['strategicPosition']
  featureMatrix: SimulationData['featureMatrix']
  competitorFunding: SimulationData['competitorFunding']
  saturationScore: SimulationData['saturationScore']
  moatAnalysis: SimulationData['moatAnalysis']
  caseStudies: SimulationData['caseStudies']
}

interface VerdictOutput {
  strengths: SimulationData['strengths']
  risks: SimulationData['risks']
  hardQuestion: string
  verdict: string
  unitEconomics: SimulationData['unitEconomics']
  bullBearCase: SimulationData['bullBearCase']
  profitabilityPath: SimulationData['profitabilityPath']
  defensibilityScore: SimulationData['defensibilityScore']
  finalVerdict: SimulationData['finalVerdict']
  fatalFlaw: SimulationData['fatalFlaw']
  successPattern: SimulationData['successPattern']
  riskBaseline: SimulationData['riskBaseline']
  techEvolution: SimulationData['techEvolution']
  nextSteps: SimulationData['nextSteps']
  recommendedBlocks: string[]
}

interface AdvisorsOutput {
  advisors: SimulationData['advisors']
}

export async function generateVision(research: ResearchContext): Promise<VisionOutput> {
  return generateSection<VisionOutput>(VISION_PROMPT, research, 'Vision', ['name', 'tagline', 'valueProposition'])
}

export async function generateMarket(research: ResearchContext): Promise<MarketOutput> {
  const marketPrompt = buildMarketPrompt(research)
  return generateSection<MarketOutput>(marketPrompt, research, 'Market', ['market', 'marketExtended'])
}

export async function generateBattlefield(research: ResearchContext): Promise<BattlefieldOutput> {
  return generateSection<BattlefieldOutput>(BATTLEFIELD_PROMPT, research, 'Battlefield', ['competitors', 'featureMatrix'])
}

export async function generateVerdict(
  research: ResearchContext,
  previousSections: { vision: VisionOutput; market: MarketOutput; battlefield: BattlefieldOutput }
): Promise<VerdictOutput> {
  const enrichedResearch = {
    ...research,
    previousSections
  }
  return generateSection<VerdictOutput>(VERDICT_PROMPT, enrichedResearch as unknown as ResearchContext, 'Verdict', ['strengths', 'risks', 'hardQuestion'])
}

export async function generateAdvisors(
  research: ResearchContext,
  battlefield: BattlefieldOutput
): Promise<AdvisorsOutput> {
  const enrichedResearch = {
    ...research,
    competitors: battlefield.competitors
  }
  return generateSection<AdvisorsOutput>(ADVISORS_PROMPT, enrichedResearch as unknown as ResearchContext, 'Advisors', ['advisors'])
}

/**
 * Ensure TAM > SAM > SOM > 0. If Gemini violates this, fix it.
 */
function fixMarketSize(ms: { tam: number; sam: number; som: number }) {
  let { tam, sam, som } = ms
  // Ensure all are positive
  if (tam <= 0) tam = 50000000000 // $50B fallback
  if (sam <= 0) sam = Math.round(tam * 0.2)
  if (som <= 0) som = Math.round(sam * 0.03)
  // Ensure TAM > SAM > SOM
  if (sam >= tam) sam = Math.round(tam * 0.2)
  if (som >= sam) som = Math.round(sam * 0.03)
  return { tam, sam, som }
}

// ========== SECTION PAYLOAD MAPPERS ==========

/** Extract vision fields from VisionOutput for streaming */
export function mapVisionPayload(v: VisionOutput): Partial<SimulationData> {
  return {
    name: v.name, tagline: v.tagline, valueProposition: v.valueProposition,
    businessModel: v.businessModel, features: v.features, ahaMoment: v.ahaMoment,
    targetUsers: v.targetUsers, unitEconomicsSnapshot: v.unitEconomicsSnapshot,
    problemSolutionMap: v.problemSolutionMap,
  }
}

/** Extract market fields from MarketOutput for streaming */
export function mapMarketPayload(m: MarketOutput): Partial<SimulationData> {
  return {
    market: m.market,
    marketExtended: { ...m.marketExtended, marketSize: fixMarketSize(m.marketExtended.marketSize) },
  }
}

/** Extract battlefield fields from BattlefieldOutput for streaming */
export function mapBattlefieldPayload(b: BattlefieldOutput): Partial<SimulationData> {
  return {
    competitors: b.competitors, secondaryCompetitors: b.secondaryCompetitors,
    strategicPosition: b.strategicPosition, featureMatrix: b.featureMatrix,
    competitorFunding: b.competitorFunding, saturationScore: b.saturationScore,
    moatAnalysis: b.moatAnalysis, caseStudies: b.caseStudies,
  }
}

/** Extract verdict fields from VerdictOutput for streaming */
export function mapVerdictPayload(v: VerdictOutput): Partial<SimulationData> {
  return {
    strengths: v.strengths, risks: v.risks, hardQuestion: v.hardQuestion,
    verdict: v.verdict, unitEconomics: v.unitEconomics, bullBearCase: v.bullBearCase,
    profitabilityPath: v.profitabilityPath, defensibilityScore: v.defensibilityScore,
    finalVerdict: v.finalVerdict, fatalFlaw: v.fatalFlaw, successPattern: v.successPattern,
    riskBaseline: v.riskBaseline, techEvolution: v.techEvolution, nextSteps: v.nextSteps,
    recommendedBlocks: v.recommendedBlocks,
  }
}

/** Extract advisors fields from AdvisorsOutput for streaming */
export function mapAdvisorsPayload(a: AdvisorsOutput): Partial<SimulationData> {
  return { advisors: a.advisors }
}

// ========== ASSEMBLY ==========

/** Assemble complete SimulationData from individual section outputs */
export function assembleSimulation(
  vision: VisionOutput,
  market: MarketOutput,
  battlefield: BattlefieldOutput,
  verdict: VerdictOutput,
  advisors: AdvisorsOutput
): SimulationData {
  return {
    ...mapVisionPayload(vision),
    ...mapMarketPayload(market),
    ...mapBattlefieldPayload(battlefield),
    ...mapVerdictPayload(verdict),
    ...mapAdvisorsPayload(advisors),
  } as SimulationData
}

// ========== SELECTIVE REGENERATION ==========

// For regeneration (edits), use a minimal research context — no real market data available
const MARKET_PROMPT_FALLBACK = buildMarketPrompt({
  realMarketData: { googleTrends: null, jobPostingStats: [], workforceStats: [] },
} as unknown as ResearchContext)

const SECTION_PROMPTS: Record<string, string> = {
  vision: VISION_PROMPT,
  market: MARKET_PROMPT_FALLBACK,
  battlefield: BATTLEFIELD_PROMPT,
  verdict: VERDICT_PROMPT,
  advisors: ADVISORS_PROMPT,
}

/** Regenerate a single section with an edit instruction prepended */
export async function regenerateSection(
  sectionName: string,
  currentData: SimulationData,
  editInstruction: string
): Promise<Partial<SimulationData>> {
  const basePrompt = SECTION_PROMPTS[sectionName]
  if (!basePrompt) throw new Error(`Unknown section: ${sectionName}`)

  const editPrefix = `IMPORTANT EDIT INSTRUCTION: ${editInstruction}

The user has requested changes. Here is the current data for context:
${JSON.stringify(currentData, null, 2)}

Regenerate this section incorporating the requested changes while keeping the overall analysis consistent.

`
  const modifiedPrompt = editPrefix + basePrompt

  // Build a minimal research context from currentData
  const minimalResearch = {
    idea: currentData.name || '',
    competitors: currentData.competitors?.map(c => ({
      name: c.name, description: '', funding: c.funding, pricing: c.pricing, strengths: [] as string[], weaknesses: [] as string[],
    })) || [],
    market: { marketSize: '', growthRate: '', keyTrends: [] as string[], targetDemographics: [] as string[] },
    userComplaints: [] as { source: string; content: string; theme: string }[],
    caseStudies: [] as { name: string; outcome: string; keyDetails: string; lesson: string }[],
    regulatory: [] as { area: string; requirements: string; complexity: string }[],
    rawSearchResults: [] as { title: string; snippet: string; link: string }[],
    timestamp: new Date().toISOString(),
  } as unknown as ResearchContext

  switch (sectionName) {
    case 'vision': {
      const result = await generateSection<VisionOutput>(modifiedPrompt, minimalResearch, 'Vision (edit)', ['name', 'tagline', 'valueProposition'])
      return mapVisionPayload(result)
    }
    case 'market': {
      const result = await generateSection<MarketOutput>(modifiedPrompt, minimalResearch, 'Market (edit)', ['market', 'marketExtended'])
      return mapMarketPayload(result)
    }
    case 'battlefield': {
      const result = await generateSection<BattlefieldOutput>(modifiedPrompt, minimalResearch, 'Battlefield (edit)', ['competitors', 'featureMatrix'])
      return mapBattlefieldPayload(result)
    }
    case 'verdict': {
      const result = await generateSection<VerdictOutput>(modifiedPrompt, minimalResearch, 'Verdict (edit)', ['strengths', 'risks', 'hardQuestion'])
      return mapVerdictPayload(result)
    }
    case 'advisors': {
      const result = await generateSection<AdvisorsOutput>(modifiedPrompt, minimalResearch, 'Advisors (edit)', ['advisors'])
      return mapAdvisorsPayload(result)
    }
    default:
      return {}
  }
}

// ========== MAIN PIPELINE ==========

/**
 * Stage 2: Generate all sections from research context (non-streaming fallback).
 */
export async function generateAllSections(research: ResearchContext): Promise<SimulationData> {
  const [vision, market, battlefield] = await Promise.all([
    generateVision(research),
    generateMarket(research),
    generateBattlefield(research)
  ])

  const verdict = await generateVerdict(research, { vision, market, battlefield })
  const advisors = await generateAdvisors(research, battlefield)

  return assembleSimulation(vision, market, battlefield, verdict, advisors)
}
