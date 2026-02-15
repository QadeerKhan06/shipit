# ShipIt - Cursor for Startups

AI-powered startup idea validation tool that simulates a startup's future using real market data, competitor research, and historical case studies.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- API Keys:
  - Google Gemini API key
  - Serper API key (or Tavily as alternative)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local .env.local.example
```

Edit `.env.local` with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
MONGODB_URI=mongodb+srv://...
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
shipit/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── simulation/[id]/   # Dashboard page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Section components
│   │   ├── charts/           # Chart components
│   │   ├── cards/            # Card components
│   │   ├── agent/            # Agent panel components
│   │   └── ui/               # UI primitives
│   ├── lib/                  # Utilities and wrappers
│   │   ├── gemini.ts        # Gemini API wrapper
│   │   ├── search.ts        # Web search wrapper
│   │   ├── mongodb.ts       # MongoDB connection
│   │   └── prompts/         # AI prompts
│   ├── stores/              # Zustand state management
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## Features

- **Vision**: Crystallize startup idea with product blueprint
- **Market Reality**: Real market data, trends, and user quotes
- **Battlefield**: Competitive landscape visualization
- **History**: Real case studies of similar startups
- **Verdict**: Evidence-based assessment with risks and strengths
- **Next Moves**: Actionable steps based on insights

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts, React Flow
- **AI**: Google Gemini API
- **Search**: Serper/Tavily API
- **Database**: MongoDB Atlas
- **State**: Zustand
- **Deployment**: Vercel

## Design Theme

Hybrid terminal aesthetic combining CLI/terminal elements with modern data visualization.

**Color Palette:**
- Background: `#0d1117`
- Surface: `#161b22`
- Border: `#30363d`
- Accent Cyan: `#58a6ff`
- Accent Magenta: `#f778ba`
- Accent Green: `#3fb950`

**Fonts:**
- Monospace: JetBrains Mono
- Sans-serif: Inter

## License

MIT
