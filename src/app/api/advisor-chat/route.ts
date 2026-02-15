import { NextRequest, NextResponse } from 'next/server'
import { flashModel } from '@/lib/gemini'
import type { SimulationData, AdvisorPersona } from '@/types/simulation'

export const maxDuration = 15

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { advisorId, messages, simulationData } = body as {
      advisorId: string
      messages: { role: string; content: string }[]
      simulationData: SimulationData
    }

    if (!advisorId || !messages || !simulationData) {
      return NextResponse.json(
        { error: 'advisorId, messages, and simulationData are required' },
        { status: 400 }
      )
    }

    // Find the advisor persona
    const advisor = simulationData.advisors?.find((a: AdvisorPersona) => a.id === advisorId)
    if (!advisor) {
      return NextResponse.json(
        { error: 'Advisor not found' },
        { status: 404 }
      )
    }

    // Build conversation history for Gemini
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }]
    }))

    const lastMessage = messages[messages.length - 1]

    const systemPrompt = `${advisor.systemContext}

## Your Background
Name: ${advisor.name}
Title: ${advisor.title}
Company/Context: ${advisor.company}
Bio: ${advisor.bio}
Expertise: ${advisor.expertise.join(', ')}

## Startup Being Discussed
Name: ${simulationData.name}
Tagline: ${simulationData.tagline}
Value Proposition: ${simulationData.valueProposition}
Business Model: ${simulationData.businessModel}
Key Features: ${simulationData.features.join(', ')}

## Key Data Points
- Market: ${simulationData.market.fundingTotal} in competitor funding, ${simulationData.market.jobPostings} job postings
- Competitors: ${simulationData.competitors.map(c => `${c.name} (${c.funding})`).join(', ')}
- Verdict: ${simulationData.verdict}
- Hard Question: ${simulationData.hardQuestion}

## Instructions
Stay in character as ${advisor.name}. Reference specific data from the report when relevant.
Keep responses conversational (2-4 sentences) — you're having a real conversation, not giving a lecture.
Be genuine and specific, not generic. React to what the founder says.`

    const chat = flashModel.startChat({
      history: [
        { role: 'user', parts: [{ text: `System: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: advisor.openingMessage }] },
        ...chatHistory
      ]
    })

    const result = await chat.sendMessage(lastMessage.content)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error('[advisor-chat] Error:', error)
    return NextResponse.json(
      { error: 'Advisor failed to respond. Please try again.' },
      { status: 500 }
    )
  }
}
