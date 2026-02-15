import { NextRequest, NextResponse } from 'next/server'
import { flashModelJSON, flashModel } from '@/lib/gemini'
import type { SimulationData } from '@/types/simulation'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentData, focusedBlock, sources } = body as {
      message: string
      currentData: SimulationData
      focusedBlock?: { section: string; label: string }
      sources?: { title: string; snippet: string; link: string }[]
    }

    if (!message || !currentData) {
      return NextResponse.json(
        { error: 'Message and currentData are required' },
        { status: 400 }
      )
    }

    // First, determine if this is a question or an edit request
    const classifyResult = await flashModelJSON.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `Classify this user message as either a "question" (asking about the data/analysis) or an "edit" (requesting changes to the report).

User message: "${message}"
${focusedBlock ? `Context: User is viewing the "${focusedBlock.label}" block in the "${focusedBlock.section}" section.` : ''}

Return JSON: { "type": "question" | "edit", "reasoning": "brief explanation" }` }]
      }]
    })

    let classification: { type: 'question' | 'edit' }
    try {
      classification = JSON.parse(classifyResult.response.text())
    } catch {
      classification = { type: 'question' }
    }

    if (classification.type === 'question') {
      // Answer the question using the report data
      // Build sources section for the prompt
      const sourcesText = sources && sources.length > 0
        ? `\n## Research Sources\nThese are the actual URLs from our web research. ALWAYS cite relevant ones.\n${sources.slice(0, 30).map((s, i) => `${i + 1}. ${s.title} — ${s.link}\n   ${s.snippet}`).join('\n')}`
        : ''

      // Context instruction depends on whether user has a block focused
      const contextInstruction = focusedBlock
        ? `The user is looking at the "${focusedBlock.label}" block right now. They can see it. Refer to it as "this" or "here" — do NOT restate the block name, section name, or say "The ${focusedBlock.label} in the ${focusedBlock.section} section shows...". Just talk about the data directly, as if you're both looking at the same screen.`
        : ''

      const answerResult = await flashModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `You're a sharp startup mentor reviewing this founder's validation report with them. Be conversational, direct, and insightful — like a smart friend who happens to know a lot about startups.

## Report Data
${JSON.stringify(currentData, null, 2)}
${sourcesText}

${contextInstruction}

## User Question
"${message}"

RULES:
- Be conversational and direct. Talk like a knowledgeable mentor, not a report generator.
- Reference specific numbers, names, and findings — but weave them naturally into your response.
- Keep it to 2-4 sentences. Punchy and useful. No filler, no "Great question!" openers.
- NEVER say "the report doesn't state", "does not have a directly cited source", or "not explicitly mentioned". You have ALL the data — interpret and explain it confidently.
- When citing sources: list them at the end as plain text like this:
  Sources: Title One (url), Title Two (url)
  Pick the 2-3 most relevant sources from the Research Sources list above. Every answer should include sources if the Research Sources list is available.
- If asked about positioning: reference competitor coordinates, strategic gaps, saturation score, and moat analysis.
- If asked "how" or "what should I do": give actionable advice grounded in the report's strengths, risks, and next steps.
- ALL data in this report was synthesized from real web research. Never disclaim the data's origin — just cite the sources.` }]
        }]
      })

      return NextResponse.json({
        response: answerResult.response.text(),
        type: 'answer'
      })
    } else {
      // Edit request — determine affected sections and generate changes
      const editResult = await flashModelJSON.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `A user wants to edit their startup validation report. Analyze the edit request and determine which sections need to be regenerated.

## Section → Data Mapping (use this to determine affected sections)
- "vision": name, tagline, valueProposition, businessModel, features, ahaMoment, targetUsers, unitEconomicsSnapshot, problemSolutionMap
- "market": market (demandTrend, workforceCapacity, opportunityGap, userQuotes, fundingTotal, jobPostings), marketExtended (marketSize, fundingActivity, jobPostingsTrend, regulatoryLandscape, hypeVsReality)
- "battlefield": competitors, secondaryCompetitors, strategicPosition, featureMatrix, competitorFunding, saturationScore, moatAnalysis, caseStudies
- "verdict": strengths, risks, hardQuestion, verdict, unitEconomics, bullBearCase, profitabilityPath, defensibilityScore, finalVerdict, fatalFlaw, successPattern, riskBaseline, techEvolution, nextSteps, recommendedBlocks
- "advisors": advisors (advisor personas with names, bios, openingMessages, systemContext)

## Current Report
Name: "${currentData.name}"
Tagline: "${currentData.tagline}"

## Edit Request
"${message}"

Return JSON:
{
  "editDescription": "Short description of the change",
  "editInstruction": "Detailed instruction for the AI regenerator. Be very specific: what exactly should change, what values to use, what to keep the same.",
  "affectedSections": ["section1", "section2"],
  "response": "Brief message to the user (1-2 sentences) explaining what will change"
}

RULES for affectedSections:
- If the user changes the NAME or TAGLINE → "vision" MUST be included (that's where name/tagline live)
- If name/tagline changes → also include "advisors" (they reference the startup name in bios/messages)
- If business model or pricing changes → include "vision" + "verdict" (unit economics)
- If the user changes competitive positioning → include "battlefield" + "verdict"
- "verdict" should be included if ANY core data changes since it summarizes everything
- Do NOT include sections that won't actually be impacted` }]
        }]
      })

      let editData
      try {
        editData = JSON.parse(editResult.response.text())
      } catch {
        return NextResponse.json({
          response: "I understand you want to make a change. Could you be more specific about what you'd like to update?",
          type: 'answer'
        })
      }

      return NextResponse.json({
        response: editData.response,
        type: 'edit',
        editDescription: editData.editDescription,
        editInstruction: editData.editInstruction || editData.editDescription,
        affectedSections: editData.affectedSections,
      })
    }
  } catch (error) {
    console.error('[agent] Error:', error)
    return NextResponse.json(
      { error: 'Agent failed to respond. Please try again.' },
      { status: 500 }
    )
  }
}
