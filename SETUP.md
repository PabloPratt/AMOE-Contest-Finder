# 🚀 Quick Start Guide

## Step 1: Clone & Install

```bash
cd contest-finder
npm install
```

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL
```bash
# Create database
createdb contest_finder

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/contest_finder"
ANTHROPIC_API_KEY="your-key-here"
```

### Option B: Docker
```bash
docker run --name contest-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=contest_finder \
  -p 5432:5432 \
  -d postgres:15
```

## Step 3: Get Your API Keys

1. **Anthropic API Key** (Claude)
   - Visit: https://console.anthropic.com/
   - Create new API key
   - Paste in `.env.local`

## Step 4: Initialize Database

The schema is already created in `/db/schema.ts`. To initialize tables:

```bash
# Using Drizzle (recommended when we add migrations)
# For now, tables will be created on first API call
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 6: Start Scouting Contests!

1. Click "Scrape Contests" button
2. Select a contest source
3. Click "Scout Contests"
4. Watch the AI find World Cup contests with AMOE options
5. Click on any contest to apply or generate entry instructions

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists: `psql postgres -c "SELECT datname FROM pg_database WHERE datname = 'contest_finder';"`

### API Key Error
```
Error: Invalid API key
```
- Verify your ANTHROPIC_API_KEY is correct in .env.local
- Check it's not expired
- Generate a new one at https://console.anthropic.com/

### No Contests Found
- Try different contest sources
- Check that your AI key has sufficient quota
- Verify network connection (agent makes requests)

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│  - Contest listing & filtering                      │
│  - Application modal                                │
│  - Scraper control panel                            │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP
┌──────────────────▼──────────────────────────────────┐
│            Next.js API Routes                       │
│  - /api/contests (list & filter)                   │
│  - /api/scrape (run scout agent)                   │
│  - /api/apply (record applications)                │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
    │Claude│  │  DB  │  │ JSON │
    │  API │  │  ORM │  │ Logic│
    └──────┘  └──────┘  └──────┘
```

## Key Components

### Contest Scout Agent (`lib/agents/contest-scout.ts`)
- Uses Claude Opus with extended thinking
- Searches contest sources intelligently
- Verifies AMOE eligibility
- Analyzes contest rules

### Database Layer (`lib/db.ts`, `db/schema.ts`)
- PostgreSQL with Drizzle ORM
- 3 main tables: contests, scrape_logs, user_applications
- Type-safe queries

### UI Components (`components/`)
- `ContestCard` - Individual contest display
- `FilterBar` - Sorting controls
- `ApplicationModal` - Entry form
- `ScraperPanel` - Scout control

## Next Steps

1. Run the dev server
2. Scrape some contests
3. Explore the data in your database
4. Test the auto-guide feature
5. Expand contest sources
6. Add scheduling for automatic scrapes

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/contest_finder
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=development
```

Good luck finding those contests! 🎉
