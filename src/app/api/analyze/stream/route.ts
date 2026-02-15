import { NextRequest } from 'next/server'
import { conductResearch } from '@/lib/research'
import {
  generateVision,
  generateMarket,
  generateBattlefield,
  generateVerdict,
  generateAdvisors,
  mapVisionPayload,
  mapMarketPayload,
  mapBattlefieldPayload,
  mapVerdictPayload,
  mapAdvisorsPayload,
  assembleSimulation,
} from '@/lib/generate'
import { saveReport } from '@/lib/mongodb'

export const maxDuration = 120

// Helper to send an SSE event as newline-delimited JSON
function sendEvent(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const payload = JSON.stringify({ event, data }) + '\n'
  controller.enqueue(new TextEncoder().encode(payload))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { idea } = body

  if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Please provide a startup idea' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const trimmedIdea = idea.trim()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stage 1: Research (with granular progress)
        sendEvent(controller, 'stage', {
          stage: 'researching',
          message: 'Starting research pipeline...',
        })

        const research = await conductResearch(trimmedIdea, (progressMsg) => {
          sendEvent(controller, 'progress', { message: progressMsg })
        })

        sendEvent(controller, 'research_complete', {
          searchResultCount: research.rawSearchResults.length,
          competitorsFound: research.competitors.length,
        })

        // Stage 2: Generate sections (vision/market/battlefield in parallel)
        sendEvent(controller, 'stage', {
          stage: 'generating',
          message: 'Generating vision, market analysis, competitive landscape...',
        })

        // Track individual section outputs for verdict/advisors dependencies
        let visionOutput: Awaited<ReturnType<typeof generateVision>>
        let marketOutput: Awaited<ReturnType<typeof generateMarket>>
        let battlefieldOutput: Awaited<ReturnType<typeof generateBattlefield>>

        // Run parallel generation, emitting each section as it resolves
        sendEvent(controller, 'progress', { message: 'Generating vision & identity...' })
        const visionPromise = generateVision(research).then(result => {
          visionOutput = result
          sendEvent(controller, 'section_complete', {
            section: 'vision',
            payload: mapVisionPayload(result),
          })
          return result
        })

        sendEvent(controller, 'progress', { message: 'Analyzing market data & trends...' })
        const marketPromise = generateMarket(research).then(result => {
          marketOutput = result
          sendEvent(controller, 'section_complete', {
            section: 'market',
            payload: mapMarketPayload(result),
          })
          return result
        })

        sendEvent(controller, 'progress', { message: 'Mapping competitive landscape...' })
        const battlefieldPromise = generateBattlefield(research).then(result => {
          battlefieldOutput = result
          sendEvent(controller, 'section_complete', {
            section: 'battlefield',
            payload: mapBattlefieldPayload(result),
          })
          return result
        })

        await Promise.all([visionPromise, marketPromise, battlefieldPromise])

        // Stage 3: Verdict (needs vision/market/battlefield)
        sendEvent(controller, 'stage', {
          stage: 'generating_verdict',
          message: 'Synthesizing verdict and final analysis...',
        })

        const verdictOutput = await generateVerdict(research, {
          vision: visionOutput!,
          market: marketOutput!,
          battlefield: battlefieldOutput!,
        })
        sendEvent(controller, 'section_complete', {
          section: 'verdict',
          payload: mapVerdictPayload(verdictOutput),
        })

        // Stage 4: Advisors
        sendEvent(controller, 'stage', {
          stage: 'generating_advisors',
          message: 'Creating advisor personas...',
        })

        const advisorsOutput = await generateAdvisors(research, battlefieldOutput!)
        sendEvent(controller, 'section_complete', {
          section: 'advisors',
          payload: mapAdvisorsPayload(advisorsOutput),
        })

        // Stage 5: Save to MongoDB
        sendEvent(controller, 'progress', { message: 'Saving report...' })
        const fullSimulation = assembleSimulation(
          visionOutput!,
          marketOutput!,
          battlefieldOutput!,
          verdictOutput,
          advisorsOutput
        )

        let reportId: string | null = null
        try {
          reportId = await saveReport(trimmedIdea, research, fullSimulation)
        } catch (dbError) {
          console.warn('[stream] MongoDB save failed (non-critical):', dbError)
        }

        sendEvent(controller, 'complete', { reportId })
        controller.close()
      } catch (error) {
        console.error('[stream] Pipeline error:', error)
        sendEvent(controller, 'error', {
          message: error instanceof Error ? error.message : 'Analysis failed',
        })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
