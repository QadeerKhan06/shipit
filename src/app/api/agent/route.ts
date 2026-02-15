import { NextRequest, NextResponse } from 'next/server'
import { flashModelJSON, flashModel } from '@/lib/gemini'
import type { SimulationData } from '@/types/simulation'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentData, focusedBlock } = body as {
      message: string
      currentData: SimulationData
      focusedBlock?: { section: string; label: string }
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
      const answerResult = await flashModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `You are a startup mentor helping a founder understand their validation report. Answer their question using the report data below.

## Report Data
${JSON.stringify(currentData, null, 2)}

${focusedBlock ? `The user is currently looking at: "${focusedBlock.label}" in the "${focusedBlock.section}" section.` : ''}

## User Question
${message}

Be concise (2-4 sentences), specific to their data, and actionable. Reference specific numbers and findings from the report.` }]
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

## Current Report
${JSON.stringify(currentData, null, 2)}

## Edit Request
"${message}"

Return JSON with this structure:
{
  "editDescription": "Short description of the change",
  "affectedSections": ["vision", "market", "battlefield", "verdict", "advisors"],
  "changes": {
    "description": "What will change in the report"
  },
  "response": "Brief message to the user explaining what will change"
}

Only include sections in affectedSections that would actually need to change. Most edits affect 1-3 sections. The "verdict" section is almost always affected since it summarizes everything.` }]
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
        affectedSections: editData.affectedSections,
        changes: editData.changes
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
