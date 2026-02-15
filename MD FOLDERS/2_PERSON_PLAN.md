# ShipIt: 2-Person Hackathon Plan (5 Days)

**Team Split:**
- **Person 1 (You):** Frontend refactor + dynamic data integration
- **Person 2 (Friend):** Backend pipeline + data generation

**Timeline:** 5 days
**Goal:** Clean, working MVP with impressive demo

---

## Work Distribution

### 👤 Person 1: Frontend Refactor & Integration
**Responsibilities:**
- Refactor ShipItDashboard.tsx into clean component structure
- Extract all blocks into individual components
- Set up proper TypeScript types
- Create state management system
- Integrate with backend API (when ready)
- Build loading states & error handling
- Polish UI/UX

### 👤 Person 2: Backend Pipeline & Data
**Responsibilities:**
- Build `/api/analyze` endpoint
- Integrate Claude API with proper prompts
- Add real data sources (Google Trends, Reddit, etc.)
- Implement caching system
- Handle rate limiting & errors
- Optimize for speed & cost

---

## Day-by-Day Plan

### **Day 1: Foundation & Setup** 🏗️

#### Person 1 (You) - Morning (4h)
1. **Set up Next.js project**
   ```bash
   npx create-next-app@latest shipit --typescript --tailwind --app
   cd shipit
   ```

2. **Create folder structure**
   ```
   /app
     page.tsx              # Landing page
     dashboard/
       page.tsx            # Dashboard container
     api/
       analyze/
         route.ts          # API endpoint (Person 2 will implement)
     layout.tsx

   /components
     /ui
       TerminalBox.tsx     # Extract first
       Sidebar.tsx
       BlockConfigurator.tsx
     /blocks
       /vision
       /market
       /battlefield
       /history
       /verdict
       /nextmoves
     /sections
       VisionSection.tsx
       MarketSection.tsx
       BattleSection.tsx
       HistorySection.tsx
       VerdictSection.tsx
       NextMovesSection.tsx

   /types
     simulation.ts         # Main data types
     blocks.ts            # Block configs

   /lib
     utils.ts             # Helper functions

   /config
     blockRegistry.ts     # Block definitions
   ```

3. **Create type definitions** (`types/simulation.ts`)
   - Copy mockData structure
   - Create full TypeScript interfaces
   - Export Simulation interface

4. **Extract TerminalBox component**
   - Most reused component
   - Clean API: `<TerminalBox label="..." variant="...">`

#### Person 1 (You) - Afternoon (4h)
5. **Extract 5-10 simple blocks**
   - Start with Vision section (easiest)
   - ValueProposition.tsx
   - BusinessModel.tsx
   - KeyFeatures.tsx
   - TargetUsers.tsx
   - AhaMoment.tsx

   Each block:
   ```tsx
   interface ValuePropositionProps {
     data: string
   }

   export function ValueProposition({ data }: ValuePropositionProps) {
     return (
       <TerminalBox label="Value Proposition" variant="info">
         <p>{data}</p>
       </TerminalBox>
     )
   }
   ```

6. **Create VisionSection.tsx**
   - Wrapper component
   - Takes VisionData as props
   - Renders all vision blocks
   - Test with mock data

#### Person 2 (Friend) - Full Day (8h)
1. **Study mockData structure**
   - Understand what data format is needed
   - Note which fields are required vs optional

2. **Set up Claude API client** (`lib/ai.ts`)
   ```bash
   npm install @anthropic-ai/sdk
   ```

   ```typescript
   import Anthropic from '@anthropic-ai/sdk'

   const anthropic = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   })

   export async function generateSimulation(idea: string) {
     // Implementation here
   }
   ```

3. **Create master system prompt**
   - Expert startup analyst persona
   - Output format: JSON matching Simulation type
   - Include examples of good outputs

4. **Build basic `/api/analyze` endpoint**
   ```typescript
   // app/api/analyze/route.ts
   import { generateSimulation } from '@/lib/ai'

   export async function POST(req: Request) {
     const { idea } = await req.json()
     const simulation = await generateSimulation(idea)
     return Response.json(simulation)
   }
   ```

5. **Test with 3-5 ideas**
   - Verify JSON structure matches types
   - Check output quality

**End of Day 1 Sync:**
- Person 1 has 5-10 blocks extracted + types ready
- Person 2 has basic API working with Claude
- Test integration: API returns data → Dashboard displays it

---

### **Day 2: Component Extraction & AI Prompts** ⚙️

#### Person 1 (You) - Full Day (8h)
1. **Extract Market section blocks** (3h)
   - DemandTrend.tsx (line chart)
   - WorkforceCapacity.tsx (bar chart)
   - MarketOpportunityGap.tsx (area chart)
   - AskTheMarket.tsx (quotes)
   - MarketSize.tsx
   - VCFundingActivity.tsx
   - JobPostingsTrend.tsx
   - RegulatoryLandscape.tsx
   - HypeVsReality.tsx

2. **Create reusable chart components** (2h)
   - `components/charts/LineChart.tsx`
   - `components/charts/BarChart.tsx`
   - `components/charts/AreaChart.tsx`
   - Props-based configuration
   - Reuse across multiple blocks

3. **Create MarketSection.tsx** (1h)
   - Wrapper for all market blocks
   - Handle optional blocks visibility

4. **Extract Battlefield section** (2h)
   - CompetitiveLandscape.tsx (scatter plot)
   - YourGapRisk.tsx
   - FeatureMatrix.tsx
   - FundingVelocity.tsx
   - MarketSaturation.tsx
   - TrustMoatAnalysis.tsx (radar chart)

#### Person 2 (Friend) - Full Day (8h)
1. **Improve prompts for each section** (4h)
   - Vision: Clear, concise value prop and features
   - Market: Focus on realistic numbers and trends
   - Battlefield: Detailed competitive analysis
   - History: Real company examples
   - Verdict: Balanced strengths/risks
   - Next Moves: Actionable validation steps

2. **Add Google Trends integration** (2h)
   ```bash
   npm install google-trends-api
   ```

   - Fetch demand trend data for related keywords
   - Use in Demand Trend chart
   - Fallback to AI if no data

3. **Add Reddit API integration** (2h)
   ```bash
   npm install snoowrap
   ```

   - Search relevant subreddits
   - Extract pain point quotes
   - Use in "Ask the Market" block

**End of Day 2 Sync:**
- Person 1 has ~20 blocks extracted + 2 sections complete
- Person 2 has improved prompts + 2 real data sources
- Test: Generate new idea with real data

---

### **Day 3: Finish Refactor & Data Pipeline** 🚀

#### Person 1 (You) - Full Day (8h)
1. **Extract History section** (2h)
   - CaseStudyTimeline.tsx
   - FatalFlaw.tsx
   - SuccessPattern.tsx
   - RiskBaseline.tsx
   - TechnologyEvolution.tsx

2. **Extract Verdict section** (2h)
   - Strengths.tsx
   - Risks.tsx
   - UnitEconomics.tsx
   - HardQuestion.tsx
   - FinalAssessment.tsx
   - BullVsBearCase.tsx
   - PathToProfitability.tsx
   - DefensibilityScore.tsx
   - FinalVerdict.tsx

3. **Extract Next Moves section** (1h)
   - CriticalFirstSteps.tsx
   - ValidationChecklist.tsx
   - ThirtyDaySprint.tsx
   - AcquisitionStrategy.tsx
   - FundingRoadmap.tsx

4. **Create Block Registry** (1h)
   ```typescript
   // config/blockRegistry.ts
   import { DemandTrend } from '@/components/blocks/market/DemandTrend'
   // ... all imports

   export const BLOCK_REGISTRY = [
     {
       id: 'market-demand-trend',
       section: 'market',
       label: 'Demand Trend',
       component: DemandTrend,
       category: 'mandatory',
       order: 1,
       dataPath: 'market.demandTrend'
     },
     // ... all 37 blocks
   ]
   ```

5. **Set up state management** (2h)
   - Context API or Zustand
   - Manage simulation data
   - Manage enabled blocks
   - Manage focused block

#### Person 2 (Friend) - Full Day (8h)
1. **Add 3rd data source** (2h)
   - Options: Crunchbase (funding), GitHub (tech products), News API
   - Integrate and test

2. **Implement caching system** (2h)
   ```typescript
   // lib/cache.ts
   const cache = new Map<string, Simulation>()

   export function getCachedSimulation(ideaHash: string) {
     return cache.get(ideaHash)
   }

   export function cacheSimulation(ideaHash: string, simulation: Simulation) {
     cache.set(ideaHash, simulation)
   }
   ```

3. **Optimize prompts for speed** (2h)
   - Use Claude Haiku for simple blocks
   - Parallel requests where possible
   - Reduce token usage

4. **Add error handling** (2h)
   - Retry logic for failed API calls
   - Fallbacks when data sources fail
   - Validation of AI outputs

**End of Day 3 Sync:**
- Person 1 has ALL blocks extracted into components
- Person 2 has full data pipeline working with 3 sources
- Test full flow: Idea → API → Dashboard with clean components

---

### **Day 4: Integration & Polish** ✨

#### Person 1 (You) - Full Day (8h)
1. **Build main Dashboard container** (2h)
   - `app/dashboard/page.tsx`
   - Fetch data from API
   - Pass to section components
   - Handle loading/error states

2. **Create loading states** (2h)
   - Progressive loading UI
   - Show sections as they complete
   - Status messages: "Analyzing market...", "Researching competitors..."
   - Progress bar

3. **Wire up Landing Page** (2h)
   - Handle form submission
   - Call API endpoint
   - Navigate to dashboard with loading state
   - Pass data via URL params or state

4. **Polish UI/UX** (2h)
   - Fix any layout issues
   - Ensure focused mode works
   - Block configurator functionality
   - Sidebar navigation
   - Consistent spacing/colors

#### Person 2 (Friend) - Full Day (8h)
1. **Add streaming support** (3h)
   - Stream sections as they're generated
   - Use Server-Sent Events or ReadableStream
   - Update frontend progressively

2. **Data labeling system** (1h)
   - Mark blocks with "✓ Real data" or "AI-estimated"
   - Add metadata to each block's data

3. **Rate limiting & cost control** (2h)
   - Implement request throttling
   - Track API usage
   - Add usage limits per user

4. **Testing & bug fixes** (2h)
   - Test with 10+ diverse ideas
   - Fix edge cases
   - Ensure error handling works

**End of Day 4 Sync:**
- Complete end-to-end working app
- All components rendering correctly
- Data pipeline robust and tested
- UI polished

---

### **Day 5: Demo Prep & Final Features** 🎬

#### Morning (Both Together - 4h)
1. **Deploy to Vercel** (1h)
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Test production build

2. **Add share functionality** (1h)
   - Generate unique URLs for analyses
   - Copy to clipboard button
   - Simple URL routing: `/dashboard/[id]`

3. **Prepare demo ideas** (1h)
   - Generate 3-5 impressive examples
   - Cache them for demo day
   - Take screenshots as backups

4. **Final bug sweep** (1h)
   - Test on different browsers
   - Check mobile (at least landing page)
   - Fix critical issues

#### Afternoon (Split Work - 4h)

**Person 1: Polish & Extras**
1. **Add simple PDF export** (2h)
   - Use browser print → PDF
   - Style print view
   - "Export" button

2. **Mobile responsive landing page** (1h)
   - Ensure landing page works on mobile
   - Dashboard can be desktop-only

3. **Easter eggs & polish** (1h)
   - Fun details for judges
   - Keyboard shortcuts
   - Smooth animations

**Person 2: Demo & Docs**
1. **Write demo script** (2h)
   - 2-min pitch
   - 3-min live demo walkthrough
   - Q&A prep

2. **Create fallback plans** (1h)
   - Pre-generated examples
   - Video recording backup
   - Screenshot slides

3. **README & documentation** (1h)
   - Clear setup instructions
   - Environment variables guide
   - API documentation

#### Evening (Both - 2h)
1. **Practice demo together** (1h)
   - Run through 3-5 times
   - Time it
   - Get comfortable

2. **Final checks** (1h)
   - Production app working
   - All features functional
   - Backup plans ready
   - Get rest!

---

## Technical Decisions

### State Management
**Recommendation: Context API**
```typescript
// contexts/SimulationContext.tsx
interface SimulationContextType {
  simulation: Simulation | null
  setSimulation: (sim: Simulation) => void
  enabledBlocks: Set<string>
  toggleBlock: (id: string) => void
  focusedBlock: FocusedBlock | null
  setFocusedBlock: (block: FocusedBlock | null) => void
  isLoading: boolean
  error: string | null
}

export const SimulationProvider = ({ children }) => {
  // Implementation
}
```

**Why not Zustand:** Context API is simpler and sufficient for this scope.

### Component Props Pattern
```typescript
// Each block receives only its data
interface BlockProps {
  data: any  // Specific type per block
  onFocus?: () => void
  isFocused?: boolean
}

// Example
<DemandTrend
  data={simulation.market.demandTrend}
  onFocus={() => setFocusedBlock({ section: 'market', label: 'Demand Trend' })}
  isFocused={focusedBlock?.label === 'Demand Trend'}
/>
```

### API Response Format
```typescript
// Streaming response (optional)
{
  type: 'progress',
  section: 'market',
  block: 'demand-trend',
  data: { ... },
  progress: 0.35
}

// Final response
{
  type: 'complete',
  simulation: { ... },
  metadata: {
    duration: 23.5,
    tokensUsed: 45000,
    sources: ['google-trends', 'reddit', 'ai']
  }
}
```

---

## Post-Hackathon Roadmap

### Week 1-2 (If You Win/Continue)
**Person 1:**
- Add database (PostgreSQL + Prisma)
- User accounts & auth
- Save/load analyses
- Export improvements

**Person 2:**
- More data sources
- Persona agents system (7th section)
- Advanced caching (Redis)
- Analytics & itoring

### Week 3-4
**Together:**
- Mobile app / responsive design
- Team collaboration features
- Premium tier features
- Marketing site

---

## Communication Plan

### Daily Standups (15 min)
- **Morning:** What are you working on today?
- **Evening:** What did you accomplish? Any blockers?

### Key Sync Points
1. **Day 1 Evening:** Test API integration
2. **Day 2 Evening:** Test with real data sources
3. **Day 3 Evening:** Full end-to-end test
4. **Day 4 Evening:** Demo run-through
5. **Day 5 Morning:** Final deployment check

### Shared Resources
- **GitHub repo:** Both push to main (small team, YOLO)
- **Figma/Notes:** Share screenshots of bugs/ideas
- **Vercel:** Both have access to deployment
- **API Keys:** Share securely (1Password, env file)

---

## Division of Complexity

### Person 1 (Frontend) - Higher Volume, Lower Complexity
- **Tasks:** 37 block components to extract
- **Pattern:** Repetitive, clear pattern to follow
- **Autonomy:** Can work independently once pattern is set
- **Testing:** Visual testing (does it look right?)

### Person 2 (Backend) - Lower Volume, Higher Complexity
- **Tasks:** API integration, prompt engineering, data sources
- **Pattern:** More varied, requires experimentation
- **Autonomy:** Needs to research APIs, test prompts
- **Testing:** Functional testing (does data make sense?)

**Both are important, roughly equal effort!**

---

## Success Criteria

### Day 1 ✅
- [ ] Next.js project set up
- [ ] Folder structure created
- [ ] Types defined
- [ ] TerminalBox extracted
- [ ] 5 blocks extracted
- [ ] Basic API endpoint working

### Day 2 ✅
- [ ] 20+ blocks extracted
- [ ] 2 sections complete (Vision, Market)
- [ ] Google Trends integrated
- [ ] Reddit API integrated
- [ ] Improved AI prompts

### Day 3 ✅
- [ ] ALL 37 blocks extracted
- [ ] Block registry created
- [ ] State management working
- [ ] 3rd data source integrated
- [ ] Caching implemented

### Day 4 ✅
- [ ] Dashboard fully functional
- [ ] Loading states working
- [ ] Error handling robust
- [ ] UI polished
- [ ] Streaming responses (if time)

### Day 5 ✅
- [ ] Deployed to production
- [ ] Demo prepared
- [ ] 3-5 examples ready
- [ ] Backup plans in place
- [ ] Team practiced demo

---

## Quick Start (Right Now)

### Person 1 (You):
1. Create Next.js project
2. Set up folder structure
3. Create types/simulation.ts from mockData
4. Extract TerminalBox component
5. Test that it renders

### Person 2 (Friend):
1. Install Anthropic SDK
2. Get API key from console.anthropic.com
3. Create basic prompt
4. Test generating JSON from idea
5. Share sample output with Person 1

**First sync: In 2-3 hours after initial setup**

---

## Remember

- **Communicate frequently** - Share progress, blockers, wins
- **Test integration early** - Don't wait until Day 3
- **Keep it simple** - Don't over-engineer
- **Focus on the demo** - That's what judges see
- **Help each other** - If one person is blocked, pair program

**You've got this! With two people and a clear plan, this is totally doable! 🚀**
