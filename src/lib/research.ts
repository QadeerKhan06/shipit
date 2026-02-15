import { flashModel } from './gemini'
import {
  searchCompetitors,
  searchMarketData,
  searchUserComplaints,
  searchRegulatory,
  searchCaseStudies,
  searchJobPostings,
  searchWorkforceStats
} from './serper'
import { fetchTrendsForIdea } from './trends'
import type { ResearchContext, SearchResult, RealMarketData } from '@/types/research'
import type { Tool, FunctionDeclarationSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'

// Shared parameter schema for all search functions
const queryParam = {
  type: SchemaType.OBJECT,
  properties: {
    query: {
      type: SchemaType.STRING,
      description: 'Search query',
    }
  },
  required: ['query']
} as FunctionDeclarationSchema

// Function declarations for Gemini function calling
const searchTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'search_competitors',
        description: 'Search for competitors in this market, their funding, pricing, and positioning',
        parameters: queryParam
      },
      {
        name: 'search_market_data',
        description: 'Search for market size, growth trends, TAM/SAM/SOM data',
        parameters: queryParam
      },
      {
        name: 'search_user_complaints',
        description: 'Search for user complaints, reviews, and pain points about existing solutions',
        parameters: queryParam
      },
      {
        name: 'search_regulatory',
        description: 'Search for regulatory requirements, licensing, and compliance in this industry',
        parameters: queryParam
      },
      {
        name: 'search_case_studies',
        description: 'Search for similar startups that succeeded, failed, pivoted, or were acquired',
        parameters: queryParam
      }
    ]
  }
]

// Execute a function call from Gemini
async function executeFunction(name: string, args: Record<string, string>): Promise<SearchResult[]> {
  const query = args.query || ''

  switch (name) {
    case 'search_competitors':
      return searchCompetitors(query)
    case 'search_market_data':
      return searchMarketData(query)
    case 'search_user_complaints':
      return searchUserComplaints(query)
    case 'search_regulatory':
      return searchRegulatory(query)
    case 'search_case_studies':
      return searchCaseStudies(query)
    default:
      return []
  }
}

/**
 * Extract 2-3 short search keywords from the idea for Google Trends.
 * e.g. "AI-powered pet health monitoring" → ["pet health monitoring", "pet health tech", "pet wearable"]
 */
function extractTrendsKeywords(idea: string): string[] {
  // Take the core concept — strip common filler words
  const cleaned = idea
    .replace(/\b(ai[- ]powered|using ai|with ai|an app|a platform|a tool|that|for|the|and|or)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Use the cleaned idea as primary keyword, plus shorter variants
  const words = cleaned.split(' ').filter(w => w.length > 2)
  const keywords: string[] = []

  // Full cleaned phrase
  if (cleaned.length > 0 && cleaned.length < 50) {
    keywords.push(cleaned)
  }

  // First 3 words
  if (words.length >= 3) {
    keywords.push(words.slice(0, 3).join(' '))
  }

  // First 2 words
  if (words.length >= 2) {
    keywords.push(words.slice(0, 2).join(' '))
  }

  return keywords.slice(0, 3)
}

/**
 * Stage 1: Research
 *
 * Uses Gemini with function calling to orchestrate web searches via Serper,
 * then synthesizes results into a structured ResearchContext.
 * Also fetches Google Trends data and targeted job/workforce stats in parallel.
 */
export type ResearchProgressCallback = (message: string) => void

export async function conductResearch(
  idea: string,
  onProgress?: ResearchProgressCallback
): Promise<ResearchContext> {
  const allSearchResults: SearchResult[] = []
  const emit = onProgress || (() => {})

  // === PARALLEL TRACK 1: Google Trends + targeted market data searches ===
  emit('Fetching Google Trends data...')
  const trendsKeywords = extractTrendsKeywords(idea)

  const realDataPromise = Promise.all([
    fetchTrendsForIdea(trendsKeywords).catch(() => null),
    searchJobPostings(idea).catch(() => []),
    searchWorkforceStats(idea).catch(() => []),
  ])

  // === PARALLEL TRACK 2: Gemini agent with function calling ===
  emit('Initializing AI research agent...')
  const chat = flashModel.startChat({
    tools: searchTools,
  })

  const researchPrompt = `You are a startup research analyst. A user wants to build: "${idea}"

Your job is to thoroughly research this startup idea using the search tools available to you. You MUST call the search tools to gather real data. Make multiple searches to cover:

1. **Competitors** — Who are the main competitors? What's their funding, pricing, market position?
2. **Market data** — How big is this market? What are the growth trends?
3. **User complaints** — What do users complain about with existing solutions? What pain points exist?
4. **Regulatory** — Are there any licensing, compliance, or regulatory requirements?
5. **Case studies** — Have similar startups succeeded or failed? What can we learn?

Make at least 5 different searches across these categories. Be specific with your search queries based on the startup idea.`

  // Send the initial prompt
  emit('Researching your startup idea...')
  let result = await chat.sendMessage(researchPrompt)

  // Friendly labels for function names
  const searchLabels: Record<string, string> = {
    search_competitors: 'Searching competitors & funding data',
    search_market_data: 'Searching market size & growth trends',
    search_user_complaints: 'Searching user complaints & pain points',
    search_regulatory: 'Searching regulatory requirements',
    search_case_studies: 'Searching startup case studies',
  }

  // Process function calls in a loop (Gemini may make multiple)
  let iterations = 0
  const maxIterations = 12 // Safety limit

  while (iterations < maxIterations) {
    const response = result.response
    const calls = response.functionCalls()

    if (!calls || calls.length === 0) break

    // Emit progress for each search being made
    for (const call of calls) {
      emit(searchLabels[call.name] || `Searching: ${call.name}`)
    }

    // Execute all function calls
    const functionResponses = await Promise.all(
      calls.map(async (call) => {
        const results = await executeFunction(call.name, call.args as Record<string, string>)
        allSearchResults.push(...results)
        return {
          functionResponse: {
            name: call.name,
            response: { results: results.map(r => ({ title: r.title, snippet: r.snippet, link: r.link })) }
          }
        }
      })
    )

    emit(`Found ${allSearchResults.length} sources so far...`)

    // Send results back to Gemini
    result = await chat.sendMessage(functionResponses)
    iterations++
  }

  // === Wait for both parallel tracks to finish ===
  emit('Gathering real market data from Google Trends...')
  const [trendsResult, jobPostingStats, workforceStats] = await realDataPromise

  // Add targeted search results to the pool
  allSearchResults.push(...jobPostingStats, ...workforceStats)

  const realMarketData: RealMarketData = {
    googleTrends: trendsResult,
    jobPostingStats,
    workforceStats,
  }

  if (trendsResult) {
    emit(`Google Trends: "${trendsResult.keyword}" — ${trendsResult.data.length} yearly data points`)
  } else {
    emit('Google Trends data unavailable, will estimate from research')
  }

  emit('Synthesizing research into structured data...')
  // Now ask Gemini to synthesize the research into structured data
  const synthesisPrompt = `Based on all the research you've gathered, synthesize your findings into a structured JSON object with these exact fields:

{
  "competitors": [
    { "name": "...", "description": "...", "funding": "...", "pricing": "...", "strengths": ["..."], "weaknesses": ["..."] }
  ],
  "market": {
    "marketSize": "...",
    "growthRate": "...",
    "keyTrends": ["..."],
    "targetDemographics": ["..."]
  },
  "userComplaints": [
    { "source": "...", "content": "...", "theme": "..." }
  ],
  "caseStudies": [
    { "name": "...", "outcome": "succeeded/failed/acquired/pivoted", "keyDetails": "...", "lesson": "..." }
  ],
  "regulatory": [
    { "area": "...", "requirements": "...", "complexity": "Low/Medium/High" }
  ]
}

Include 3-5 competitors, 3-5 user complaints, 2-3 case studies, and any relevant regulatory info. Base everything on the actual search results, not hypotheticals. Return ONLY the JSON object.`

  const synthesisResult = await chat.sendMessage(synthesisPrompt)
  const synthesisText = synthesisResult.response.text()

  // Parse the synthesized research
  let parsed
  try {
    // Strip markdown code fences if present
    const cleaned = synthesisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    console.error('Failed to parse research synthesis, using defaults')
    parsed = {
      competitors: [],
      market: { marketSize: 'Unknown', growthRate: 'Unknown', keyTrends: [], targetDemographics: [] },
      userComplaints: [],
      caseStudies: [],
      regulatory: []
    }
  }

  return {
    idea,
    competitors: parsed.competitors || [],
    market: parsed.market || { marketSize: 'Unknown', growthRate: 'Unknown', keyTrends: [], targetDemographics: [] },
    userComplaints: parsed.userComplaints || [],
    caseStudies: parsed.caseStudies || [],
    regulatory: parsed.regulatory || [],
    rawSearchResults: allSearchResults,
    realMarketData,
    timestamp: new Date().toISOString()
  }
}
