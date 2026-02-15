# ShipIt - Complete Project Documentation

## Overview

**ShipIt** is a startup idea validation tool that simulates a startup's future using AI-powered research. Users enter their startup idea, and the app generates a comprehensive analysis grounded in real market data, competitor research, and historical case studies.

**Tagline:** "Cursor for Startups" — Real-time editing and iteration of startup ideas with partial regeneration.

**Core Philosophy:** Everything shown to the user must be grounded in real, verifiable data. The AI synthesizes and analyzes, but doesn't fabricate.

---

## Visual Identity

### Design Theme: Hybrid Terminal

The app balances terminal/CLI aesthetics with modern data visualization.

**Key Principles:**
- Agent panel (right side) = Full terminal aesthetic (monospace, box borders, command prompts)
- Main content (center) = Modern cards with terminal-inspired borders
- Charts/graphs = Modern SVG visualizations with terminal color palette
- Navigation (left) = Minimal, terminal-inspired

### Color Palette

```
Background:       #0d1117 (deep dark)
Surface:          #161b22 (cards, panels)
Border:           #30363d (subtle gray)
Text Primary:     #e6edf3 (off-white)
Text Secondary:   #8b949e (gray)
Text Dim:         #484f58 (very dim)

Accent Cyan:      #58a6ff (links, highlights, in-progress)
Accent Magenta:   #f778ba (emphasis, user position, CTAs)
Accent Green:     #3fb950 (success, strengths, completed)
Accent Amber:     #d29922 (warnings, risks)
Accent Red:       #f85149 (errors, failures)
```

### Typography

- **Monospace:** JetBrains Mono — for terminal elements, labels, headers
- **Sans-serif:** Inter — for body text, descriptions, readable content

---

## Application Layout

```
┌──────────┬──────────────────────────────────────────┬────────────────────┐
│          │                                          │                    │
│   NAV    │            MAIN CONTENT                  │       AGENT        │
│   10%    │               60%                        │        30%         │
│          │                                          │                    │
│ ──────── │                                          │ ────────────────── │
│          │                                          │                    │
│ ✓ Vision │  [Current section content]               │ $ shipit agent     │
│          │                                          │                    │
│ ✓ Market │  - Section header                        │ Thinking/research  │
│          │  - Visualizations                        │ display            │
│ ◉ Battle │  - Cards and data                        │                    │
│   ←      │  - Interactive elements                  │ Chat messages      │
│ ○ History│                                          │                    │
│          │                                          │ Context-aware      │
│ ○ Verdict│                                          │ suggestions        │
│          │                                          │                    │
│ ○ Next   │                                          │ > input_           │
│          │                                          │                    │
└──────────┴──────────────────────────────────────────┴────────────────────┘
```

---

## User Flow

### 1. Landing Page
User enters their startup idea in a large text input. Detailed descriptions work better.

### 2. Loading/Research Phase
Full terminal display showing AI research in progress:
- Phase 1: Understanding (extract value prop, users, model)
- Phase 2: Researching (web search for competitors, trends, case studies)
- Phase 3: Synthesizing (combine research into insights)

### 3. Main Dashboard
Six sections displayed in scroll order, with agent panel always visible on right.

### 4. Iteration Loop
User can talk to agent to modify their idea. Agent detects changes, summarizes them, shows affected sections, and offers a "Redeploy" button for partial regeneration.

---

## The Six Sections

### Section 1: Your Vision

**Purpose:** Crystallize the user's idea. Show what they're building.

**Content:**
- Product name and tagline (generated)
- Core exchange diagram (what each side gives/gets)
- Key features as cards
- Business model flow
- Comparison table vs main competitor (text-based, not visual)

**Agent Mode:** Edit Mode — can rewrite headlines, change positioning, adjust features

**NOT a landing page.** This is a product blueprint with structured information.

---

### Section 2: Market Reality

**Purpose:** Prove demand exists with real data.

**Content:**
- Google Trends line chart (Recharts) showing search interest over time
- Stat cards: Total VC funding in space, job postings count
- "Ask the Market" — real quotes from Reddit, app reviews, forums
- Each quote has green ✅ insight showing how user's idea addresses the pain

**Data Sources:**
- Google Trends API or scraped data
- Crunchbase/news for funding
- Indeed/LinkedIn for jobs
- Reddit API or Serper search for quotes

**Agent Mode:** Research Mode — can find more quotes, explain data points, search for specific info

---

### Section 3: The Battlefield

**Purpose:** Show competitive landscape with real companies.

**Content:**
- 2D scatter plot (React Flow or custom) positioning competitors by Price (Y) vs Service Model (X)
- User's position highlighted with magenta glow
- "Your Gap" card (green) — what position you uniquely own
- "Your Risk" card (amber) — how competitors could attack
- Expandable competitor cards with deep-dive info

**Competitor Data:**
- Name, description, funding, pricing
- Strengths and weaknesses
- URL to real website
- Position coordinates for scatter plot

**Agent Mode:** Analysis Mode — can deep dive on any competitor, find more players, compare features

---

### Section 4: Lessons from History

**Purpose:** Show real case studies of similar startups that failed/pivoted/succeeded.

**Content:**
- Case study cards with:
  - Company name, years active, outcome badge (💀 Failed, 🔄 Pivoted, ✅ Succeeded)
  - Timeline graphic showing key events
  - Founder quote with source link
  - Lesson for user's idea (green ✅ if encouraging, amber ⚠️ if warning)

**Data Sources:**
- Web search for "X startup failed" or "X startup pivot"
- News articles, TechCrunch, founder interviews
- All sources must be linkable

**Agent Mode:** Learning Mode — can find more case studies, explain what went wrong, draw parallels

---

### Section 5: The Verdict

**Purpose:** Synthesize everything into clear strengths, risks, and the key question.

**Content:**
- Strength cards (green ✅) — evidence supporting the idea
- Risk cards (amber ⚠️) — evidence against the idea
- "The Hard Question" — one critical question that determines success/failure
- "Get Deeper Perspectives" — persona conversation triggers
- Final assessment — written verdict with recommendation

**Personas (inline expansion, not separate section):**
When user clicks "Talk → Investor/Customer/Competitor":
- Opens inline chat panel in main content
- Persona asks tough questions from their POV
- User can respond and have a conversation
- Collapse button to close

**Agent Mode:** Strategy Mode — can brainstorm solutions, explore pivots, challenge assumptions

---

### Section 6: Next Moves

**Purpose:** Turn insights into action.

**Content:**
- Priority action cards (numbered, with CRITICAL/IMPORTANT/HELPFUL badges)
- Each action has description and time estimate
- Export buttons: PDF Report, Landing Page HTML, Raw Data CSV
- Share link generation

**Agent Mode:** Planning Mode — can break down steps, draft emails, create interview questions

---

## The Agent Panel

### Always Visible
The agent panel is fixed on the right side (30% width), always accessible.

### Section-Aware
The agent's behavior changes based on which section the user is viewing:

| Section | Agent Mode | Capabilities |
|---------|-----------|--------------|
| Vision | Edit Mode | Rewrite content, change positioning |
| Market | Research Mode | Find more data, explain trends |
| Battlefield | Analysis Mode | Deep dive competitors, compare |
| History | Learning Mode | Find case studies, explain failures |
| Verdict | Strategy Mode | Brainstorm solutions, explore pivots |
| Next Moves | Planning Mode | Break down tasks, draft content |

### Thinking Display
When researching, show terminal-style thinking:

```
┌─ Research ────────────────┐
│ ● Searching for           │
│   competitors...          │
│ └─ Found: Papa, Candoo... │
└───────────────────────────┘
```

### Redeploy Flow
When user describes changes to their idea:

1. Agent detects changes
2. Shows changes in point form
3. Lists affected sections (⟳ will update, ─ no change)
4. Presents "[ ⟳ Redeploy ]" button
5. On click, only regenerates affected sections
6. Updated sections get "🔄 Just updated" badge with change summary

---

## Data Flow

```
User Input (idea)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     GEMINI API                              │
│                                                             │
│  Prompt 1: Extract key info (users, model, value prop)      │
│  Prompt 2: Generate search queries for research             │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                  WEB SEARCH (Serper/Tavily)                 │
│                                                             │
│  • Search: "[industry] startup competitors"                 │
│  • Search: "[industry] startup failed"                      │
│  • Search: "site:reddit.com [user pain point]"              │
│  • Search: "[competitor name] funding crunchbase"           │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     GEMINI API                              │
│                                                             │
│  Prompt 3: Synthesize research into structured JSON         │
│  Prompt 4: Generate competitor positioning                  │
│  Prompt 5: Identify strengths, risks, hard question         │
│  Prompt 6: Generate next steps                              │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB                                 │
│                                                             │
│  Store: Full simulation results                             │
│  Store: User modifications from agent                       │
│  Store: Version history for comparisons                     │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
│                                                             │
│  Render all sections with data                              │
│  Agent panel handles ongoing conversation                   │
│  Redeploy triggers partial regeneration                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | React framework with API routes |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Line charts, bar charts |
| Scatter Plot | React Flow or custom SVG | Competitive landscape |
| AI | Gemini API | Analysis, synthesis, agent |
| Web Search | Serper API or Tavily | Real-time research |
| Database | MongoDB Atlas | Store simulations |
| Deployment | Vercel | Hosting |
| State | Zustand | Client state management |
| Fonts | JetBrains Mono + Inter | Terminal + readable |

---

## Folder Structure

```
shipit/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── simulation/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Main dashboard
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts            # Initial analysis
│   │       ├── research/
│   │       │   └── route.ts            # Web search
│   │       ├── agent/
│   │       │   └── route.ts            # Agent chat
│   │       └── redeploy/
│   │           └── route.ts            # Partial regeneration
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx             # Left nav
│   │   │   ├── AgentPanel.tsx          # Right terminal
│   │   │   └── MainContent.tsx         # Center wrapper
│   │   │
│   │   ├── sections/
│   │   │   ├── VisionSection.tsx
│   │   │   ├── MarketSection.tsx
│   │   │   ├── BattlefieldSection.tsx
│   │   │   ├── HistorySection.tsx
│   │   │   ├── VerdictSection.tsx
│   │   │   └── NextMovesSection.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── TrendsChart.tsx         # Recharts line
│   │   │   ├── CompetitorMap.tsx       # Scatter plot
│   │   │   └── Timeline.tsx            # Case study
│   │   │
│   │   ├── cards/
│   │   │   ├── StrengthCard.tsx
│   │   │   ├── RiskCard.tsx
│   │   │   ├── CompetitorCard.tsx
│   │   │   ├── QuoteCard.tsx
│   │   │   └── StatCard.tsx
│   │   │
│   │   ├── agent/
│   │   │   ├── AgentMessage.tsx
│   │   │   ├── AgentThinking.tsx
│   │   │   ├── RedeployPrompt.tsx
│   │   │   └── PersonaChat.tsx
│   │   │
│   │   └── ui/
│   │       ├── TerminalBox.tsx
│   │       ├── TerminalText.tsx
│   │       ├── LoadingPhase.tsx
│   │       └── Button.tsx
│   │
│   ├── lib/
│   │   ├── gemini.ts                   # Gemini wrapper
│   │   ├── search.ts                   # Web search wrapper
│   │   ├── mongodb.ts                  # DB connection
│   │   ├── utils.ts                    # Utilities (cn, etc.)
│   │   └── prompts/
│   │       ├── extract.ts
│   │       ├── research.ts
│   │       ├── synthesize.ts
│   │       ├── agent.ts
│   │       └── personas.ts
│   │
│   ├── stores/
│   │   └── simulationStore.ts          # Zustand store
│   │
│   └── types/
│       └── index.ts                    # TypeScript types
│
├── public/
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## TypeScript Types

```typescript
// Core simulation type
interface Simulation {
  id: string
  idea: string
  createdAt: Date
  updatedAt: Date
  version: number
  
  // Extracted
  name: string
  tagline: string
  valueProposition: string
  targetUsers: {
    primary: UserPersona
    secondary?: UserPersona
  }
  businessModel: string
  features: string[]
  
  // Research
  market: MarketData
  competitors: Competitor[]
  caseStudies: CaseStudy[]
  
  // Synthesis
  strengths: Evidence[]
  risks: Evidence[]
  hardQuestion: string
  verdict: string
  nextSteps: ActionItem[]
}

interface UserPersona {
  name: string
  description: string
  gains: string[]
  pains: string[]
}

interface MarketData {
  trendsData: { date: string; value: number }[]
  trendsGrowth: string
  fundingTotal: string
  fundingRounds: { company: string; amount: string; date: string }[]
  jobPostings: number
  userQuotes: Quote[]
}

interface Quote {
  source: string
  platform: 'reddit' | 'appstore' | 'twitter' | 'news' | 'other'
  content: string
  upvotes?: number
  insight: string
  url: string
}

interface Competitor {
  name: string
  description: string
  funding: string
  pricing: string
  position: { x: number; y: number }
  strengths: string[]
  weaknesses: string[]
  url: string
  logoUrl?: string
}

interface CaseStudy {
  name: string
  years: string
  outcome: 'failed' | 'pivoted' | 'succeeded'
  timeline: { date: string; event: string }[]
  quote?: { text: string; source: string; url: string }
  lesson: string
  lessonType: 'warning' | 'encouraging'
}

interface Evidence {
  title: string
  description: string
  source: string
  url?: string
}

interface ActionItem {
  priority: 'critical' | 'important' | 'helpful'
  title: string
  description: string
  timeEstimate: string
}

// Agent types
interface AgentMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface ThinkingStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  result?: string
}

interface DetectedChange {
  field: string
  oldValue: string
  newValue: string
}

interface RedeployRequest {
  changes: DetectedChange[]
  affectedSections: string[]
}
```

---

## API Routes

### POST /api/analyze

**Purpose:** Initial analysis of user's idea

**Input:**
```json
{
  "idea": "A mobile app that connects university students with seniors..."
}
```

**Process:**
1. Extract key info with Gemini
2. Generate search queries
3. Execute web searches
4. Synthesize results
5. Save to MongoDB

**Output:**
```json
{
  "simulationId": "abc123",
  "status": "complete"
}
```

**Streaming:** Should stream progress updates for loading UI

---

### POST /api/agent

**Purpose:** Handle agent chat messages

**Input:**
```json
{
  "simulationId": "abc123",
  "message": "What if we charged universities $50 per student?",
  "currentSection": "vision"
}
```

**Process:**
1. Check if message implies changes to the idea
2. If yes, detect and summarize changes
3. If no, respond contextually based on current section

**Output (change detected):**
```json
{
  "type": "change_detected",
  "changes": [
    { "field": "businessModel", "oldValue": "Free", "newValue": "$50/seat B2B" }
  ],
  "affectedSections": ["vision", "battlefield", "verdict"],
  "summary": "Changing from free to paid B2B model"
}
```

**Output (normal response):**
```json
{
  "type": "response",
  "content": "Looking at Papa's pricing strategy..."
}
```

---

### POST /api/redeploy

**Purpose:** Partial regeneration after user changes

**Input:**
```json
{
  "simulationId": "abc123",
  "changes": [...],
  "sectionsToUpdate": ["vision", "battlefield", "verdict"]
}
```

**Process:**
1. Update stored idea with changes
2. Re-run research only for affected areas
3. Regenerate only specified sections
4. Save new version

**Output:**
```json
{
  "version": 2,
  "updatedSections": {
    "vision": { ... },
    "battlefield": { ... },
    "verdict": { ... }
  },
  "changeSummary": {
    "vision": ["Updated business model to B2B", "Added pricing section"],
    "battlefield": ["Added 3 new EdTech competitors", "Repositioned on map"],
    "verdict": ["New risk: longer sales cycles", "Updated hard question"]
  }
}
```

---

## Gemini Prompts

### Extract Prompt

```typescript
const extractPrompt = (idea: string) => `
You are analyzing a startup idea. Extract structured information.

IDEA:
${idea}

Extract and return JSON:
{
  "name": "suggested product name",
  "tagline": "one-line description",
  "valueProposition": "what value it provides",
  "primaryUser": {
    "name": "e.g., University Students",
    "description": "who they are",
    "gains": ["what they get"],
    "pains": ["problems they have"]
  },
  "secondaryUser": { ... } or null,
  "businessModel": "how it makes money or operates",
  "features": ["key features"],
  "industry": "industry category",
  "searchQueries": {
    "competitors": ["search queries to find competitors"],
    "failures": ["search queries to find failed similar startups"],
    "userPain": ["search queries to find user discussions about the problem"]
  }
}

Be specific and actionable. The search queries should find real companies and real discussions.
`
```

### Synthesize Prompt

```typescript
const synthesizePrompt = (idea: string, research: any) => `
You are synthesizing research about a startup idea.

IDEA: ${idea}

RESEARCH RESULTS:
${JSON.stringify(research, null, 2)}

Based on this research, provide:

{
  "competitors": [
    {
      "name": "real company name",
      "description": "what they do",
      "funding": "funding amount if found",
      "pricing": "their pricing model",
      "position": { "x": 0-100, "y": 0-100 },
      "strengths": ["what they do well"],
      "weaknesses": ["where they struggle"],
      "url": "their website"
    }
  ],
  "caseStudies": [
    {
      "name": "company name",
      "years": "2018-2020",
      "outcome": "failed|pivoted|succeeded",
      "timeline": [{ "date": "2018", "event": "Launched at UCLA" }],
      "quote": { "text": "actual quote", "source": "source name", "url": "link" },
      "lesson": "what the user can learn",
      "lessonType": "warning|encouraging"
    }
  ],
  "market": {
    "trendsGrowth": "+X% since year",
    "fundingTotal": "$XM+",
    "fundingRounds": [{ "company": "", "amount": "", "date": "" }],
    "jobPostings": number
  },
  "userQuotes": [
    {
      "source": "r/subreddit or App Store",
      "platform": "reddit|appstore|twitter|news",
      "content": "actual quote",
      "upvotes": number or null,
      "insight": "how this relates to the user's idea",
      "url": "link to source"
    }
  ],
  "strengths": [
    { "title": "REAL DEMAND", "description": "evidence...", "source": "source" }
  ],
  "risks": [
    { "title": "VOLUNTEER CHURN", "description": "evidence...", "source": "source" }
  ],
  "hardQuestion": "The one question that determines success or failure",
  "verdict": "2-3 sentence assessment with recommendation",
  "nextSteps": [
    {
      "priority": "critical|important|helpful",
      "title": "action name",
      "description": "what to do",
      "timeEstimate": "1 week"
    }
  ]
}

IMPORTANT:
- Only include information from the research. Do not fabricate.
- Every company, quote, and data point must be real and verifiable.
- Position coordinates: x = service model (0=group, 100=1:1 in-home), y = price (0=free, 100=premium)
- The hard question should be specific and based on the research findings.
`
```

### Agent Prompt

```typescript
const agentPrompt = (context: {
  simulation: Simulation,
  currentSection: string,
  conversationHistory: AgentMessage[],
  userMessage: string
}) => `
You are an AI agent helping a founder validate their startup idea.

CURRENT IDEA:
${context.simulation.name}: ${context.simulation.valueProposition}

CURRENT SECTION USER IS VIEWING: ${context.currentSection}

CONVERSATION HISTORY:
${context.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

USER MESSAGE: ${context.userMessage}

SECTION MODES:
- vision: Help edit/refine the product description, features, positioning
- market: Help find more data, explain trends, search for specific info
- battlefield: Deep dive on competitors, compare features, find more players
- history: Find more case studies, explain failures, draw parallels
- verdict: Brainstorm solutions to risks, explore pivots, challenge assumptions
- nextmoves: Break down tasks, draft emails, create interview questions

DETECTING CHANGES:
If the user is suggesting a change to their idea (new feature, different audience, new business model, pivot), you must:
1. Clearly identify what's changing
2. Return a structured change detection response

RESPONSE FORMAT:

If change detected:
{
  "type": "change_detected",
  "changes": [
    { "field": "businessModel", "oldValue": "...", "newValue": "..." }
  ],
  "affectedSections": ["vision", "battlefield"],
  "response": "I understand you want to change X to Y. Here's what that would affect..."
}

If normal response:
{
  "type": "response",
  "content": "Your helpful response here..."
}

Be concise, specific, and helpful. Reference the actual research data when relevant.
`
```

### Persona Prompts

```typescript
const investorPrompt = (simulation: Simulation) => `
You are a skeptical VC evaluating this startup idea.

IDEA: ${simulation.name}
${simulation.valueProposition}

BUSINESS MODEL: ${simulation.businessModel}
COMPETITORS: ${simulation.competitors.map(c => c.name).join(', ')}
RISKS IDENTIFIED: ${simulation.risks.map(r => r.title).join(', ')}

Ask tough questions about:
- Unit economics and path to profitability
- Defensibility and moat
- Market size and scalability
- Team-market fit
- Why now? Why this team?

Be direct and challenging. Don't be mean, but don't be soft either.
If the founder gives a good answer, acknowledge it and drill deeper.
If the answer is weak, point out why.
`

const customerPrompt = (simulation: Simulation) => `
You are a potential customer for this product.

PRODUCT: ${simulation.name}
${simulation.valueProposition}

YOUR PERSONA: ${simulation.targetUsers.primary.name}
YOUR PAINS: ${simulation.targetUsers.primary.pains.join(', ')}

React authentically:
- Would you actually use this?
- What would make you trust it?
- What's missing?
- What would make you tell a friend?
- What alternatives do you currently use?

Be honest. If something sounds too good to be true, say so.
If you'd actually pay for this, explain why.
`

const competitorPrompt = (simulation: Simulation) => `
You are a product manager at ${simulation.competitors[0]?.name || 'a competing company'}.

THEIR IDEA: ${simulation.name}
${simulation.valueProposition}

YOUR COMPANY: ${simulation.competitors[0]?.name}
YOUR FUNDING: ${simulation.competitors[0]?.funding}
YOUR STRENGTHS: ${simulation.competitors[0]?.strengths?.join(', ')}

Think strategically:
- How would you respond to this new entrant?
- What's their biggest vulnerability?
- Could you copy this easily?
- What would it take for them to actually threaten you?
- What advantages do you have that they can't replicate?

Be competitive but realistic. Acknowledge if they have a genuine advantage.
`
```

---

## Component Specifications

### TerminalBox

A reusable container with terminal-style borders.

```tsx
interface TerminalBoxProps {
  title?: string
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}
```

**Styling:**
- Border: 1px solid with color based on variant
- Background: surface color (#161b22)
- Title bar: slightly different background, monospace font
- Padding: p-4 for content

---

### AgentPanel

Fixed right panel with terminal aesthetic.

**Sections:**
1. Header: "$ shipit agent"
2. Thinking display (when researching)
3. Message list (scrollable)
4. Input with blinking cursor

**State:**
- messages: AgentMessage[]
- thinking: ThinkingStep[]
- isLoading: boolean
- redeployPrompt: RedeployRequest | null

---

### CompetitorMap

2D scatter plot for competitive landscape.

**Axes:**
- X: Service Model (0=Group/Class, 50=Remote 1:1, 100=In-Home 1:1)
- Y: Price (0=Free, 50=Mid-range, 100=Premium)

**Nodes:**
- Competitor nodes: cyan dots with labels
- User position: magenta with glow effect, labeled "YOU"

**Interactions:**
- Click node to expand competitor details
- Hover for quick info
- Zoom/pan optional

---

### TrendsChart

Recharts line chart for market trends.

**Features:**
- Dark background matching theme
- Cyan line for data
- Subtle grid
- Annotation capability for key events (e.g., "COVID spike")
- Gradient fill under line (optional)

---

### Timeline

Horizontal timeline for case studies.

**Elements:**
- Horizontal line with milestone markers
- Date labels above
- Event descriptions below
- Color coding: start=green, problems=amber, end=red or green based on outcome

---

## Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
MONGODB_URI=mongodb+srv://...

# Optional
TAVILY_API_KEY=your_tavily_api_key  # Alternative to Serper
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "reactflow": "^11.10.0",
    "framer-motion": "^10.16.0",
    "@google/generative-ai": "^0.1.0",
    "axios": "^1.6.0",
    "mongodb": "^6.3.0",
    "zustand": "^4.4.0",
    "react-markdown": "^9.0.0",
    "lucide-react": "^0.294.0",
    "@fontsource/jetbrains-mono": "^5.0.0",
    "@fontsource/inter": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-dim': '#484f58',
        accent: {
          cyan: '#58a6ff',
          magenta: '#f778ba',
          green: '#3fb950',
          amber: '#d29922',
          red: '#f85149',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Key Implementation Notes

### Streaming Responses

For the loading phase, use Server-Sent Events (SSE) to stream progress:

```typescript
// API route
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Send updates
  const sendUpdate = async (data: any) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  // Process in background
  processAnalysis(idea, sendUpdate).then(() => writer.close())

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

### Change Detection

Use Gemini to detect if user message implies changes:

```typescript
const detectChanges = async (message: string, currentIdea: Simulation) => {
  // Ask Gemini to analyze if this is a change request
  // Return structured change object or null
}
```

### Partial Regeneration

Only regenerate affected sections:

```typescript
const affectedSections = {
  businessModel: ['vision', 'battlefield', 'verdict'],
  targetUsers: ['vision', 'market', 'verdict'],
  features: ['vision'],
  // ... mapping of what affects what
}
```

### Real Data Verification

Every data point should have a source URL. If we can't verify something, don't include it.

---

## Demo Script

For hackathon presentation:

1. **Landing page** — Show clean terminal-inspired input
2. **Enter idea** — Type a compelling startup idea
3. **Loading phase** — Watch terminal fill with research (the wow moment)
4. **Dashboard tour** — Walk through each section
5. **Agent interaction** — Ask a question, show contextual response
6. **Make a change** — "What if we charged $50/student?"
7. **Redeploy** — Show partial regeneration
8. **Verdict** — Show the hard question and final assessment

Total demo time: 3-4 minutes

---

## Success Criteria

The project succeeds if:

1. ✅ User enters idea → sees comprehensive analysis in <30 seconds
2. ✅ All competitor/market data is real and verifiable
3. ✅ Agent responds contextually based on current section
4. ✅ Changes trigger smart partial regeneration
5. ✅ Visual design is polished and cohesive
6. ✅ Demo flows smoothly without errors

---

## Hackathon Prizes Targeted

| Prize | How We Win |
|-------|-----------|
| **1st-3rd Overall** | Unique concept, polished execution, real research |
| **Best Use of Gemini** | Core of analysis, synthesis, and agent |
| **Best Use of MongoDB** | Stores simulations, versions, history |
| **DigitalOcean/Cloudflare** | Deployment |

---

## Questions to Clarify During Build

1. How much streaming do we need? (Full SSE vs polling)
2. Should we cache research results? (MongoDB)
3. How many competitors to show? (3-5 seems right)
4. How many case studies? (2-3 is enough)
5. Should we support multiple simulations per user? (Nice to have)
6. Do we need auth? (Probably not for hackathon)

---

This documentation should give Claude Code everything needed to build ShipIt. Start with the layout and components, then integrate the API routes, then polish the visuals.
