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
        ? `\n## Research Sources (actual URLs from our web research)\n${sources.slice(0, 30).map((s, i) => `${i + 1}. [${s.title}](${s.link}) — ${s.snippet}`).join('\n')}`
        : ''

      const answerResult = await flashModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `You are an expert startup mentor with deep knowledge of this founder's validation report. Answer their question with SPECIFIC data from the report.

## Report Data
${JSON.stringify(currentData, null, 2)}
${sourcesText}

${focusedBlock ? `The user is currently looking at: "${focusedBlock.label}" in the "${focusedBlock.section}" section. Focus your answer on this specific block's data.` : ''}

## User Question
"${message}"

RULES:
- ALWAYS reference specific numbers, names, and findings from the report data above
- If asked about sources/where data comes from: cite the ACTUAL research source URLs listed above. Format as "Source: [title](url)". These are real web pages we searched during research. If no sources are provided, explain the data was synthesized from web search results.
- If asked about positioning: reference the competitor map coordinates, the strategic gap/risk analysis, saturation score, and moat analysis from the report
- If asked "how" or "what should I do": give actionable advice based on the strengths, risks, next steps, and case studies in the report
- Be direct and specific (3-5 sentences). No filler. Cite exact data points.
- Do NOT say "the report doesn't state" — the data IS the report, interpret it` }]
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
