// Serper API wrapper for web search

const SERPER_API_KEY = process.env.SERPER_API_KEY

interface SerperResult {
  title: string
  snippet: string
  link: string
}

interface SerperResponse {
  organic: SerperResult[]
}

async function search(query: string, num: number = 10): Promise<SerperResult[]> {
  if (!SERPER_API_KEY) {
    console.warn('SERPER_API_KEY not set, returning empty results')
    return []
  }

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, num })
  })

  if (!response.ok) {
    console.error(`Serper API error: ${response.status}`)
    return []
  }

  const data: SerperResponse = await response.json()
  return data.organic || []
}

// Tailored search functions for different research needs

export async function searchCompetitors(query: string): Promise<SerperResult[]> {
  return search(`${query} competitors funding pricing comparison`, 10)
}

export async function searchMarketData(query: string): Promise<SerperResult[]> {
  return search(`${query} market size TAM growth rate trends 2024`, 10)
}

export async function searchUserComplaints(query: string): Promise<SerperResult[]> {
  return search(`${query} user complaints reviews problems frustrations`, 10)
}

export async function searchRegulatory(query: string): Promise<SerperResult[]> {
  return search(`${query} regulations licensing requirements compliance`, 6)
}

export async function searchCaseStudies(query: string): Promise<SerperResult[]> {
  return search(`${query} startup success failure case study`, 8)
}

export async function searchJobPostings(query: string): Promise<SerperResult[]> {
  return search(`${query} job postings hiring trends 2024 number of jobs`, 6)
}

export async function searchWorkforceStats(query: string): Promise<SerperResult[]> {
  return search(`${query} workforce statistics labor market professionals employees 2024`, 6)
}
