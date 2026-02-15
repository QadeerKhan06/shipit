/**
 * Google Trends integration — fetches real search interest data
 * for grounding demand trend and hype vs reality charts.
 */

interface TrendsTimelinePoint {
  time: string
  formattedTime: string
  formattedAxisTime: string
  value: number[]
  hasData: boolean[]
  isPartial: boolean
}

interface TrendsResult {
  default: {
    timelineData: TrendsTimelinePoint[]
    averages: number[]
  }
}

export interface YearlyTrendPoint {
  year: string
  value: number  // 0-100 scale (Google Trends normalized)
}

/**
 * Fetch Google Trends interest-over-time data for a keyword.
 * Returns yearly averages from 2019-2024.
 * Falls back to null if the API fails (rate limit, etc).
 */
export async function fetchGoogleTrends(keyword: string): Promise<YearlyTrendPoint[] | null> {
  try {
    const googleTrends = require('google-trends-api')

    const result = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date('2019-01-01'),
      endTime: new Date('2024-12-31'),
      granularTimeResolution: false,
    })

    const parsed: TrendsResult = JSON.parse(result)
    const timeline = parsed.default?.timelineData

    if (!timeline || timeline.length === 0) return null

    // Aggregate monthly data points into yearly averages
    const yearlyMap: Record<string, { sum: number; count: number }> = {}

    for (const point of timeline) {
      const date = new Date(parseInt(point.time) * 1000)
      const year = date.getFullYear().toString()

      if (!yearlyMap[year]) yearlyMap[year] = { sum: 0, count: 0 }
      yearlyMap[year].sum += point.value[0]
      yearlyMap[year].count++
    }

    const years = ['2019', '2020', '2021', '2022', '2023', '2024']
    const result_points: YearlyTrendPoint[] = []

    for (const year of years) {
      if (yearlyMap[year] && yearlyMap[year].count > 0) {
        result_points.push({
          year,
          value: Math.round(yearlyMap[year].sum / yearlyMap[year].count),
        })
      }
    }

    return result_points.length >= 3 ? result_points : null
  } catch (err) {
    console.warn('[trends] Google Trends fetch failed:', err instanceof Error ? err.message : err)
    return null
  }
}

/**
 * Fetch trends for multiple keywords and return the best result.
 * Tries each keyword in order; returns the first successful one.
 */
export async function fetchTrendsForIdea(
  keywords: string[]
): Promise<{ keyword: string; data: YearlyTrendPoint[] } | null> {
  for (const keyword of keywords) {
    const data = await fetchGoogleTrends(keyword)
    if (data) {
      return { keyword, data }
    }
  }
  return null
}
