import { NextRequest, NextResponse } from 'next/server'
import { conductResearch } from '@/lib/research'
import { generateAllSections } from '@/lib/generate'
import { saveReport } from '@/lib/mongodb'

export const maxDuration = 60 // Allow up to 60s for full pipeline

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea } = body

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a startup idea' },
        { status: 400 }
      )
    }

    const trimmedIdea = idea.trim()

    // Stage 1: Research
    console.log('[analyze] Stage 1: Researching...')
    const research = await conductResearch(trimmedIdea)
    console.log(`[analyze] Research complete: ${research.rawSearchResults.length} search results gathered`)

    // Stage 2: Generate sections
    console.log('[analyze] Stage 2: Generating sections...')
    const simulation = await generateAllSections(research)
    console.log('[analyze] Generation complete')

    // Stage 3: Save to MongoDB
    let reportId: string | null = null
    try {
      reportId = await saveReport(trimmedIdea, research, simulation)
      console.log(`[analyze] Saved to MongoDB: ${reportId}`)
    } catch (dbError) {
      // Don't fail the whole pipeline if MongoDB is unavailable
      console.warn('[analyze] MongoDB save failed (non-critical):', dbError)
    }

    return NextResponse.json({
      status: 'complete',
      simulation,
      reportId,
      research: {
        searchResultCount: research.rawSearchResults.length,
        competitorsFound: research.competitors.length,
        timestamp: research.timestamp
      }
    })
  } catch (error) {
    console.error('[analyze] Pipeline error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
