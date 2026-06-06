# Complete File Structure

```
contest-finder/
│
├── 📄 Configuration Files
│   ├── .env.local                 # Environment variables (DB, API keys)
│   ├── next.config.ts             # Next.js configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── package.json               # Dependencies and scripts
│   └── .gitignore                 # Git exclusions
│
├── 📚 Documentation Files
│   ├── README.md                  # Complete feature overview & setup
│   ├── START_HERE.md              # Quick start guide (read first!)
│   ├── SETUP.md                   # Detailed setup instructions
│   ├── PROJECT_SUMMARY.md         # Technical architecture & data flow
│   ├── TECH_STACK.md              # Technology decisions & stack info
│   ├── DEPLOYMENT.md              # Production deployment guide
│   └── FILE_STRUCTURE.md          # This file
│
├── 🎨 Frontend Application
│   │
│   ├── app/
│   │   ├── layout.tsx             # Root layout wrapper
│   │   ├── page.tsx               # Main page - contest listing UI
│   │   ├── globals.css            # Global styles
│   │   │
│   │   └── api/                   # API Routes
│   │       ├── contests/
│   │       │   └── route.ts       # GET /api/contests - list & filter
│   │       ├── scrape/
│   │       │   └── route.ts       # POST /api/scrape - run AI scout
│   │       └── apply/
│   │           └── route.ts       # POST /api/apply - record applications
│   │
│   └── components/                # React components
│       ├── ContestCard.tsx        # Individual contest display
│       ├── FilterBar.tsx          # Sort & filter controls
│       ├── ApplicationModal.tsx   # Entry form & result display
│       └── ScraperPanel.tsx       # AI scout control panel
│
├── 🔧 Backend & Database
│   │
│   ├── lib/
│   │   ├── db.ts                  # Database connection & initialization
│   │   ├── utils.ts               # Helper functions (date, currency, etc)
│   │   │
│   │   └── agents/
│   │       └── contest-scout.ts   # AI agent implementations
│   │                              #  - scoutContestSource()
│   │                              #  - analyzeContestRules()
│   │                              #  - findExpiringSoon()
│   │
│   └── db/
│       └── schema.ts              # Database schema (Drizzle ORM)
│                                  #  - contests table
│                                  #  - scrape_logs table
│                                  #  - user_applications table
│
├── 📦 Node Modules & Build
│   ├── node_modules/              # Dependencies (ignored in git)
│   ├── .next/                     # Build output (ignored in git)
│   └── dist/                      # Optional compiled output
│
└── 🔄 Development
    ├── public/                    # Static files (logo, favicon)
    └── .git/                      # Git repository

```

## File Purposes

### Configuration & Setup
| File | Purpose |
|------|---------|
| `.env.local` | Database URL, API keys, environment config |
| `package.json` | Dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript strict mode, paths, etc. |
| `next.config.ts` | Next.js plugins, settings, optimization |
| `tailwind.config.ts` | Color schemes, spacing, fonts |

### Documentation (Read These!)
| File | Start With | Then Read |
|------|-----------|-----------|
| `START_HERE.md` | ✅ Quick setup | README.md |
| `README.md` | Feature overview | PROJECT_SUMMARY.md |
| `PROJECT_SUMMARY.md` | Architecture | TECH_STACK.md |
| `SETUP.md` | Detailed setup | DEPLOYMENT.md |
| `DEPLOYMENT.md` | Production | - |

### Application Pages
| File | Route | Purpose |
|------|-------|---------|
| `app/page.tsx` | `/` | Main contest browser UI |
| `app/layout.tsx` | Global | Page wrapper, providers |
| `app/globals.css` | Global | Global styles |

### API Endpoints
| File | Route | Method | Purpose |
|------|-------|--------|---------|
| `app/api/contests/route.ts` | `/api/contests` | GET | List & filter contests |
| `app/api/scrape/route.ts` | `/api/scrape` | POST | Run AI scout |
| `app/api/apply/route.ts` | `/api/apply` | POST | Record applications |

### UI Components
| File | Component | Purpose |
|------|-----------|---------|
| `components/ContestCard.tsx` | ContestCard | Display single contest |
| `components/FilterBar.tsx` | FilterBar | Sort controls |
| `components/ScraperPanel.tsx` | ScraperPanel | Scout controls |
| `components/ApplicationModal.tsx` | ApplicationModal | Entry form |

### AI & Agents
| File | Function | Purpose |
|------|----------|---------|
| `lib/agents/contest-scout.ts` | scoutContestSource() | Find contests |
| | analyzeContestRules() | Verify AMOE |
| | findExpiringSoon() | Urgent contests |

### Database
| File | Component | Purpose |
|------|-----------|---------|
| `lib/db.ts` | getDb() | Database connection |
| `db/schema.ts` | contests | Contest storage |
| | scrape_logs | Audit trail |
| | user_applications | Activity log |

### Utilities
| File | Exports | Purpose |
|------|---------|---------|
| `lib/utils.ts` | formatDate() | Format dates |
| | daysUntilExpiry() | Calculate days left |
| | formatCurrency() | Format money |
| | isExpiringSoon() | Check urgency |
| | isExpired() | Check if past deadline |

## Line Counts

```
Frontend:
  app/page.tsx                    ~80 lines
  components/ContestCard.tsx      ~70 lines
  components/ApplicationModal.tsx ~110 lines
  components/FilterBar.tsx        ~30 lines
  components/ScraperPanel.tsx     ~70 lines
  Total Frontend                  ~360 lines

Backend:
  lib/agents/contest-scout.ts     ~160 lines
  lib/db.ts                       ~20 lines
  lib/utils.ts                    ~40 lines
  app/api/contests/route.ts       ~40 lines
  app/api/scrape/route.ts         ~130 lines
  app/api/apply/route.ts          ~120 lines
  db/schema.ts                    ~60 lines
  Total Backend                   ~570 lines

Documentation:
  README.md                       ~200 lines
  SETUP.md                        ~150 lines
  PROJECT_SUMMARY.md              ~350 lines
  DEPLOYMENT.md                   ~300 lines
  TECH_STACK.md                   ~200 lines
  START_HERE.md                   ~250 lines
  Total Docs                      ~1,450 lines

TOTAL PROJECT                     ~2,380 lines (excluding docs)
```

## Key Code Locations

### Adding a new contest source
1. Update `CONTEST_SOURCES` in `components/ScraperPanel.tsx`
2. Update scraping logic in `lib/agents/contest-scout.ts`

### Changing database schema
1. Edit `db/schema.ts`
2. Run migrations when database tooling is set up

### Modifying contest display
1. Edit `components/ContestCard.tsx` for layout
2. Edit `app/page.tsx` for grid/list changes

### Adding new API endpoints
1. Create file in `app/api/[feature]/route.ts`
2. Implement handler function
3. Add to frontend as needed

### Styling changes
1. Edit `app/globals.css` for global styles
2. Use Tailwind classes in components
3. Edit `tailwind.config.ts` for theme

## Dependencies Tree

```
Next.js (14+)
├── React (18+)
├── TypeScript (5+)
├── Tailwind CSS (3+)
└── PostCSS (8+)

Database Layer
├── PostgreSQL (external)
├── Drizzle ORM
└── pg (PostgreSQL client)

AI Integration
└── @anthropic-ai/sdk

Utilities
└── uuid

Development
├── ESLint
├── TypeScript
└── Turbopack (built-in)
```

## How to Navigate the Code

### To understand the project:
1. Read `START_HERE.md` (3 min)
2. Read `README.md` (5 min)
3. Look at `app/page.tsx` (UI structure)
4. Look at `lib/agents/contest-scout.ts` (AI logic)

### To modify functionality:
1. Find the relevant file above
2. Check if it's documented
3. Edit and test locally
4. Deploy when ready

### To add features:
1. Create component or API route
2. Wire it into page.tsx or existing routes
3. Add to schema if it needs storage
4. Test in browser

## File Dependencies

```
app/page.tsx
├── components/ContestCard.tsx
├── components/FilterBar.tsx
├── components/ScraperPanel.tsx
└── /api/contests (GET)
    └── lib/db.ts
        └── db/schema.ts

components/ContestCard.tsx
├── components/ApplicationModal.tsx
└── /api/apply (POST)

components/ApplicationModal.tsx
└── /api/apply (POST)
    ├── lib/agents/contest-scout.ts
    └── lib/db.ts

components/ScraperPanel.tsx
└── /api/scrape (POST)
    ├── lib/agents/contest-scout.ts
    └── lib/db.ts

lib/agents/contest-scout.ts
└── @anthropic-ai/sdk
```

## Git Ignore

Files not in repository:
- `node_modules/` - Dependencies
- `.next/` - Build output
- `.env.local` - Secrets (NEVER commit!)
- `.env*.local` - Environment files
- `dist/` - Compiled output
- `*.log` - Logs

---

All files are well-organized, typed, and documented. Happy exploring! 🔍
