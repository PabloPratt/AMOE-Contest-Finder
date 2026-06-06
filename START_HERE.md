# 🎉 Welcome to Contest Finder!

Your AI-powered promotional contest discovery tool is ready to go!

## What You Just Got

A complete, production-ready application that:
- 🤖 Uses Claude AI to find promotional contests with AMOE options
- 🏆 Focuses on World Cup contests (easily expandable to others)
- 📋 Filters & sorts by expiration or prize value
- 📧 Generates step-by-step entry instructions
- 💾 Stores everything in PostgreSQL

## Quick Start (5 minutes)

### 1. Setup Database
```bash
# If you don't have PostgreSQL installed:
# macOS: brew install postgresql@15
# Ubuntu: sudo apt-get install postgresql
# Windows: https://www.postgresql.org/download/windows/

# Create database
createdb contest_finder

# Test connection
psql contest_finder -c "SELECT version();"
```

### 2. Configure Environment
```bash
# Edit .env.local
nano .env.local

# You should see:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/contest_finder
# ANTHROPIC_API_KEY=your_key_here
```

Get your Anthropic API key from: https://console.anthropic.com/

### 3. Start Server
```bash
npm run dev
```

### 4. Open Browser
Visit: http://localhost:3000

### 5. Find Contests!
- Click "Scrape Contests"
- Select a source
- Click "Scout Contests"
- Watch the magic happen! ✨

## Project Files Overview

### Core Components
| File | Purpose |
|------|---------|
| `app/page.tsx` | Main UI - contest listing & controls |
| `components/ContestCard.tsx` | Individual contest display |
| `components/ScraperPanel.tsx` | AI scout controls |
| `components/ApplicationModal.tsx` | Entry form & results |
| `lib/agents/contest-scout.ts` | AI agent logic |
| `lib/db.ts` | Database connection |
| `db/schema.ts` | Database tables |

### API Endpoints
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contests` | GET | List & filter contests |
| `/api/scrape` | POST | Run AI scout |
| `/api/apply` | POST | Record applications |

## How It Works

```
User clicks "Scrape Contests"
    ↓
AI Scout Agent analyzes contest website
    ↓
Extracts contests with AMOE options
    ↓
Saves to PostgreSQL database
    ↓
UI refreshes with new contests
```

When applying:
```
User clicks "Apply" or "Auto-Guide"
    ↓
Fills in name/email
    ↓
AI generates step-by-step entry instructions
    ↓
User sees exactly what to do (mail-in addresses, deadlines, etc.)
```

## Key Features Explained

### 🤖 AI Scout
- Uses Claude Opus with "extended thinking"
- Intelligently searches contest websites
- Verifies AMOE eligibility (no purchase required)
- Extracts prize values and entry methods

### 📊 Smart Sorting
- **Expiring Soon**: Sorts by deadline (don't miss opportunities)
- **Highest Value**: Sorts by estimated prize value

### 📝 Auto-Guide
- For contests requiring mail-in entries
- Shows exact mailing address
- Lists what to include in envelope
- Creates actionable checklist

## Database Schema

### contests table
Stores all discovered contests with:
- Title, prize description, estimated value
- Expiration date (critical!)
- AMOE method details
- Physical requirements (if any)
- Source website
- Verification score (AI confidence)

### scrape_logs table
Tracks when/where/how scraping happened

### user_applications table
Records which contests you've entered

## Important Notes

✅ **This is production-ready** - Proper error handling, validation, type safety

✅ **Fully typed** - TypeScript throughout for safety

✅ **Scalable** - Can add more sources, events, etc.

✅ **Portfolio-ready** - Shows full-stack + AI + database skills

⚠️ **Auto-guide is for planning** - Doesn't actually mail entries (intentional for portfolio)

## Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
psql postgres -c "SELECT 1"

# If not running:
# macOS: brew services start postgresql@15
# Ubuntu: sudo systemctl start postgresql
```

### "Invalid API key"
- Check `.env.local` has your actual key (not placeholder)
- Get key from: https://console.anthropic.com/
- Make sure it's not expired

### "No contests found"
- This is normal on first run - try scraping
- Try different sources
- Check your API key has quota

## Next Steps

1. ✅ Get it running locally
2. ✅ Try scraping a few times
3. ✅ Test the auto-guide feature
4. ✅ Explore the database schema
5. ⭐ Consider deploying (see DEPLOYMENT.md)
6. 🌟 Add more contest sources
7. 🚀 Expand to other events (Super Bowl, Olympics, etc.)

## Documentation Files

| File | Contains |
|------|----------|
| `README.md` | Complete feature overview |
| `SETUP.md` | Detailed setup instructions |
| `PROJECT_SUMMARY.md` | Technical architecture |
| `DEPLOYMENT.md` | How to deploy to production |
| `START_HERE.md` | This file! |

## Common Questions

**Q: Is this actually entering contests?**
A: No, the app finds contests and generates instructions. The "auto-guide" feature shows what you'd need to do, but doesn't actually submit entries. This is intentional - it's a planning/discovery tool.

**Q: Can I expand to other contests?**
A: Absolutely! Just change the search query in ScraperPanel from "world cup" to whatever you want.

**Q: How do I deploy this?**
A: See DEPLOYMENT.md - instructions for Vercel, Railway, Docker, etc.

**Q: What's the database size?**
A: Minimal - each contest is ~2KB. Can store thousands easily.

**Q: Can I run this 24/7?**
A: Yes! Add scheduled scraping (see DEPLOYMENT.md for cron setup).

## Support

- 📚 Read the docs (README.md, PROJECT_SUMMARY.md)
- 🔍 Check SETUP.md for detailed setup
- 🚀 See DEPLOYMENT.md for production
- 💬 Check error messages - they're descriptive

## You're All Set! 🎉

You now have a powerful tool for finding promotional contests. The AI does the heavy lifting of analyzing contest rules and extracting AMOE options.

**Go find those contests!** 💰🎯

Questions? Check the documentation files or review the code - it's well-commented and organized.

---

**P.S.** This is a solid portfolio piece! It demonstrates:
- Full-stack development (React + Next.js + PostgreSQL)
- AI integration (Claude API with extended thinking)
- Type safety (TypeScript throughout)
- Modern UI (Tailwind CSS)
- Database design (Drizzle ORM)
- Production thinking (error handling, logging)

Good luck! 🚀
