import { NextRequest, NextResponse } from 'next/server'
import { regenerateSection } from '@/lib/generate'
import type { SimulationData, SectionName } from '@/types/simulation'

export const maxDuration = 60

// Sections that should be regenerated before others (dependency order)
const SECTION_ORDER: SectionName[] = ['vision', 'market', 'battlefield', 'verdict', 'advisors']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sections, currentData, editInstruction } = body as {
      sections: SectionName[]
      currentData: SimulationData
      editInstruction: string
    }

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: 'No sections specified' }, { status: 400 })
    }
    if (!currentData) {
      return NextResponse.json({ error: 'Current data required' }, { status: 400 })
    }
    if (!editInstruction || typeof editInstruction !== 'string') {
      return NextResponse.json({ error: 'Edit instruction required' }, { status: 400 })
    }

    // Sort sections by dependency order
    const orderedSections = SECTION_ORDER.filter(s => sections.includes(s))

    // Regenerate sections sequentially (later sections may depend on earlier ones)
    const updates: Record<string, Partial<SimulationData>> = {}
    let workingData = { ...currentData }

    for (const section of orderedSections) {
      const result = await regenerateSection(section, workingData, editInstruction)
      updates[section] = result
      // Merge into working data so subsequent sections see the updates
      workingData = { ...workingData, ...result }
    }

    return NextResponse.json({ updates })
  } catch (error) {
    console.error('[regenerate] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Regeneration failed' },
      { status: 500 }
    )
  }
}
