# Pipeline Architecture Plan

## Context

The dashboard frontend is complete with 5 sections (Vision, Market, Battlefield, Verdict, Advisors) consuming a `SimulationData` object (~130 data points). Currently everything runs on mock data. We need to build the AI pipeline that takes a user's startup idea and generates a complete, research-backed report.

**Key requirements:**
- Deterministic: same prompt → same report (temperature 0)
- Incremental: agent edits only regenerate affected sections
- Gemini-powered (hackathon: "best use of Gemini")
- Persistent (reports saved, reloadable)

---

## Critical Blocker: Hardcoded Competitor Types

Before the pipeline can work, **FeatureMatrix** and **CompetitorFundingPoint** types are hardcoded to specific competitor names (`papa`, `careDotCom`, `candoo`, `honor`). The pipeline generates reports for ANY startup — these must be dynamic.

### Current (broken for pipeline):
```typescript
interface FeatureMatrix {
  features: string[]
  you: boolean[]
  papa: boolean[]       // ← hardcoded
  careDotCom: boolean[] // ← hardcoded
  candoo: boolean[]     // ← hardcoded
}

interface CompetitorFundingPoint {
  date: string
  papa: number          // ← hardcoded
  careDotCom: number    // ← hardcoded
  honor: number         // ← hardcoded
}
```

### Fix:
```typescript
interface FeatureMatrix {
  features: string[]
  competitors: { name: string; values: boolean[] }[]  // dynamic
}

interface CompetitorFundingPoint {
  date: string
  competitors: { name: string; value: number }[]  // dynamic
}
```

**Files to update:**
- `src/types/simulation.ts` — new type definitions
- `src/components/cards/FeatureMatrixCard.tsx` — render dynamic columns
- `src/components/charts/FundingVelocityChart.tsx` — render dynamic lines
- `src/contexts/SimulationContext.tsx` — update mock data format

---

## Tech Stack

| Role | Tool | Why |
|------|------|-----|
| **AI Engine** | Gemini 2.0 Flash | Required (hackathon). Fast, cheap, good structured output. Temp 0 for determinism. |
| **Web Research** | Serper API | Already configured. Returns structured search results. Gemini calls it via function calling. |
| **Persistence** | MongoDB | Already configured + installed. Store reports, research cache, edit history. Meaningful integration. |
| **Advisor Voice** | ElevenLabs | Natural fit for advisor personas — voice chat in the advisors section. Significant integration. |
| **Hosting** | Vercel | Already a Next.js app. Free tier works. |

**Not using:** Snowflake (forced fit), DigitalOcean (just hosting), Cloudflare (no longer needed)

### Why this wins "Best Use of Gemini":
Gemini isn't just called once — it powers 4 distinct capabilities:
1. **Research agent** — function calling with Serper to gather market data
2. **Structured generation** — JSON schema output for each section
3. **Interactive agent** — chat in the agent panel, context-aware edits
4. **Advisor personas** — roleplay as different stakeholders

---

## Pipeline Architecture

```
User enters startup idea
        │
        ▼
┌─ STAGE 1: RESEARCH ──────────────────────────┐
│  Gemini + Serper function calling              │
│  • Search competitors, funding, market size    │
│  • Search user complaints/reviews              │
│  • Search regulatory landscape                 │
│  • Search case studies of similar startups     │
│  → Output: ResearchContext (raw data bundle)   │
│  → Save to MongoDB                             │
└───────────────────────────────────────────────┘
        │
        ▼
┌─ STAGE 2: GENERATE (parallel) ───────────────┐
│  Gemini JSON mode, temp 0, per-section        │
│                                                │
│  ┌─────────┐ ┌────────┐ ┌─────────────┐      │
│  │ Vision  │ │ Market │ │ Battlefield │      │
│  └────┬────┘ └───┬────┘ └──────┬──────┘      │
│       │          │              │              │
│       ▼          ▼              ▼              │
│  ┌─────────┐ ┌──────────┐                     │
│  │ Verdict │ │ Advisors │                     │
│  └─────────┘ └──────────┘                     │
│  (Verdict depends on other sections' output)   │
│  → Output: Complete SimulationData             │
│  → Save to MongoDB                             │
└───────────────────────────────────────────────┘
        │
        ▼
   Frontend renders report
```

### Stage 1: Research (single Gemini call with function calling)

One Gemini call with `tools` that call Serper. Gemini decides what to search for based on the prompt.

**Function tools available to Gemini:**
- `search_competitors(query)` — find competitors, their funding, pricing
- `search_market_data(query)` — market size, trends, growth
- `search_user_complaints(query)` — Reddit, forums, app reviews
- `search_regulatory(query)` — licensing, compliance requirements
- `search_case_studies(query)` — similar startups, outcomes

Each tool wraps a Serper API call with tailored search params. Gemini orchestrates multiple searches, then returns a structured `ResearchContext` JSON.

**Why function calling instead of separate Serper calls:** Gemini decides what to search based on the startup idea. A dog-walking app needs different searches than a fintech startup. This is a strong "best use of Gemini" signal.

### Stage 2: Section Generation (parallel Gemini calls)

Each section gets its own Gemini call with:
- The `ResearchContext` from Stage 1
- A section-specific system prompt
- A JSON schema defining the exact output structure
- Temperature 0

**Execution order:**
1. Vision, Market, Battlefield → run in parallel
2. Verdict → runs after all above complete (needs strengths/risks/defensibility from their outputs)
3. Advisors → runs after Verdict (personas reference research findings)

Each call uses `responseMimeType: "application/json"` + `responseSchema` for guaranteed valid JSON matching our TypeScript types.

### Stage 3: Save & Return

- Assemble all sections into one `SimulationData` object
- Save to MongoDB with: `{ _id, prompt, research, sections, createdAt, version }`
- Return to frontend

---

## Incremental Updates (Agent Edits)

When a user says "change the business model to subscription" in the agent panel:

```
User message in Agent Panel
        │
        ▼
┌─ Gemini analyzes edit ───────────────────────┐
│  Input: user message + current SimulationData │
│  Output: {                                     │
│    affectedSections: ['vision', 'verdict'],    │
│    editDescription: 'Change to subscription',  │
│    updatedFields: { businessModel: '...' }     │
│  }                                             │
└───────────────────────────────────────────────┘
        │
        ▼
┌─ Re-generate affected sections only ─────────┐
│  • Load existing research from MongoDB         │
│  • Re-run ONLY vision + verdict generation     │
│  • Keep market, battlefield, advisors as-is    │
│  • Merge into updated SimulationData           │
│  • Save new version to MongoDB                 │
└───────────────────────────────────────────────┘
        │
        ▼
   Frontend re-renders changed sections
```

**Determinism guarantee:** Same research data + same prompt + temp 0 = same output. Edits only change the sections they affect. Everything else stays identical because the research context and generation params are the same.

---

## API Routes

### `POST /api/analyze` — Full pipeline
```typescript
// Input
{ idea: string }

// Output (streamed as sections complete)
{ status: 'researching' | 'generating' | 'complete', simulation: SimulationData }
```
- Runs full Stage 1 → Stage 2 → Stage 3
- Streams progress updates via SSE or polling
- Returns complete SimulationData

### `POST /api/agent` — Agent chat + edits
```typescript
// Input
{ message: string, simulationId: string, currentData: SimulationData }

// Output
{ response: string, updatedSimulation?: SimulationData, affectedSections?: string[] }
```
- Gemini with full report context
- Detects if message is a question vs an edit request
- Questions: returns answer referencing report data
- Edits: returns updated SimulationData with only affected sections changed

### `POST /api/advisor-chat` — Advisor persona responses
```typescript
// Input
{ advisorId: string, messages: ChatMessage[], simulationData: SimulationData }

// Output
{ response: string }
```
- Gemini with advisor's `systemContext` as system prompt
- Full report data injected so the persona can reference real research
- Replaces current placeholder responses

### `POST /api/advisor-voice` — ElevenLabs TTS (if included)
```typescript
// Input
{ text: string, advisorId: string }

// Output
audio/mpeg stream
```
- Maps advisor IDs to ElevenLabs voice IDs
- Returns audio stream for the advisor's response

---

## MongoDB Schema

```typescript
// reports collection
{
  _id: ObjectId,
  prompt: string,           // original user input
  research: ResearchContext, // cached research data
  simulation: SimulationData,
  versions: [{              // edit history
    timestamp: Date,
    edit: string,
    affectedSections: string[]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

This enables:
- Reload a previous report
- Incremental updates using cached research
- Edit history tracking

---

## Frontend Integration

### SimulationContext changes:
- `loadSimulation(idea)` → calls `POST /api/analyze`, shows progressive loading
- `editSimulation(message)` → calls `POST /api/agent`, merges partial updates
- Add `simulationId` state for MongoDB reference

### AgentPanel changes:
- `handleSendMessage()` → calls `POST /api/agent` instead of hardcoded response
- Show "thinking..." state while waiting
- Display which sections were affected by an edit
- "Redeploy" button triggers re-render with updated data

### AdvisorChat changes:
- Replace `getPlaceholderResponse()` with `POST /api/advisor-chat`
- Add voice toggle button if ElevenLabs integrated
- Stream responses for natural feel

### Progressive loading:
- Show sections as they complete (Vision first, then Market, etc.)
- Skeleton states for sections still generating
- Total pipeline: ~15-25 seconds (research ~10s, generation ~10s parallel)

---

## ElevenLabs Integration (Advisors Voice)

**Each advisor gets a distinct voice.** When user clicks a "voice" toggle in chat:
1. Advisor text response generated by Gemini
2. Text sent to ElevenLabs TTS API
3. Audio plays in browser
4. Visual indicator shows "speaking" state

**Voice mapping:**
- Maria Santos (Target Customer) → warm female voice
- James Liu (Skeptical VC) → confident male voice
- Tyler Park (Competitor Customer) → casual younger voice

**Implementation:** Add audio playback to AdvisorChat component, voice toggle button, `/api/advisor-voice` route.

---

## Implementation Order

### Phase 1: Type fixes (prerequisite)
- Make FeatureMatrix and CompetitorFundingPoint dynamic
- Update FeatureMatrixCard and FundingVelocityChart components
- Update mock data

### Phase 2: Research layer
- Create `/api/analyze/route.ts`
- Implement Serper search wrapper functions
- Implement Gemini research agent with function calling
- Define ResearchContext type

### Phase 3: Generation layer
- Create section-specific Gemini prompts + JSON schemas
- Implement parallel section generation
- Implement Verdict generation (depends on other sections)
- Assemble full SimulationData

### Phase 4: MongoDB persistence
- Create database connection utility
- Save/load reports
- Version tracking

### Phase 5: Frontend integration
- Connect SimulationContext to real API
- Progressive loading states
- Error handling

### Phase 6: Agent panel
- Create `/api/agent/route.ts`
- Edit detection + partial regeneration
- Real-time agent responses

### Phase 7: Advisor chat
- Create `/api/advisor-chat/route.ts`
- Replace placeholder responses with Gemini
- Wire up to frontend

### Phase 8: ElevenLabs voice
- Create `/api/advisor-voice/route.ts`
- Add voice toggle + audio playback to AdvisorChat
- Map advisors to voices

---

## Concerns & Mitigations

| Concern | Mitigation |
|---------|------------|
| Gemini rate limits | Use Flash (higher limits), add retry with backoff |
| Pipeline latency (15-25s) | Progressive loading — show sections as they complete |
| Invalid JSON from Gemini | Use `responseSchema` for strict output, validate + retry once |
| Research quality varies | Fallback to Gemini estimation when search data is thin, label as "estimated" |
| Cost per report | Flash is ~$0.01-0.03 per report (5-6 calls). Very cheap. |
| Determinism edge cases | Temp 0 + same research context + same schema = consistent. Not byte-identical but structurally identical. |

---

## Verification

1. Enter same prompt twice → reports should be structurally identical
2. Edit business model via agent → only Vision + Verdict regenerate
3. All 5 sections render correctly with real AI data
4. Advisor chat gives contextual responses referencing actual research
5. MongoDB stores and reloads reports
6. Pipeline completes in <30 seconds
7. Voice works for advisors (if ElevenLabs included)
