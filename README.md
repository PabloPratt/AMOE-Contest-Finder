# 🏆 Contest Finder - AI-Powered Promotional Contest Discovery

An advanced tool for discovering and managing World Cup promotional contests with AMOE (Any Manner Of Entry) options. Uses agentic AI to intelligently scrape, analyze, and help you enter contests.

## Features

### 🤖 AI Contest Scout
- Uses Claude AI with extended thinking to find and verify contests
- Analyzes contest rules for AMOE eligibility
- Extracts prize values, entry methods, and physical requirements
- High confidence scoring for contest validity

### 📊 Smart Filtering & Sorting
- **Sort by expiration date** - Never miss a deadline
- **Sort by prize value** - Focus on the biggest rewards
- Automatic filtering of expired contests
- Real-time contest status tracking

### ⚙️ Portfolio-Showcase Automation
- **Auto-guide feature** - Generates detailed step-by-step entry instructions
- Shows mailing addresses and entry requirements
- Creates actionable checklists for physical entries
- Perfect for demonstrating automation capabilities

### 💾 Contest Database
- Persistent storage of all discovered contests
- Tracks AMOE methods and physical requirements
- Verification scores and confidence metrics
- Application history and tracking

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key (Claude)

### Installation

```bash
# Install dependencies
npm install

# Set up environment
# Edit .env.local with your credentials:
# - DATABASE_URL=postgresql://user:pass@localhost:5432/contest_finder
# - ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

Visit `http://localhost:3000` to start finding contests!

## How It Works

### 1. Scraping Contests
Click "Scrape Contests" → Select a source → "Scout Contests"

The AI agent will:
- Search the selected source for World Cup promotional contests
- Verify AMOE eligibility
- Extract prize values and entry methods
- Save valid contests to the database

### 2. Filtering & Sorting
- **⏰ Expiring Soon**: Sort by deadline to prioritize urgent entries
- **💰 Highest Value**: Focus on the biggest prize pools

### 3. Applying / Auto-Guide
- Click "Apply" to record your entry attempt
- Check "Generate detailed entry instructions" for the auto-guide feature
- Receive step-by-step instructions for physical entries

## Architecture

### Frontend
- Next.js 14+ with App Router
- React components for contest discovery and filtering
- Real-time UI updates with Tailwind CSS

### Backend
- Next.js API Routes
- PostgreSQL with Drizzle ORM
- Claude AI (Opus) for intelligent analysis

### AI System
- **Contest Scout Agent**: Finds and validates contests
- **Rules Analyzer**: Extracts AMOE methods and requirements
- **Auto-Guide Generator**: Creates entry instructions

## Database Schema

### contests
- Title, description, source URL
- Prize info and estimated values
- Expiration dates and eligibility rules
- AMOE method details
- Verification scores

### scrape_logs
- Track scraping operations
- Success/failure status
- Contest counts per source

### user_applications
- Track your contest applications
- Store generated automation instructions
- Application status tracking

## Configuration

### Supported Contest Sources
- Sweepstakes Today (sweepstakestoday.com)
- Contest Girl (contestgirl.com)
- Sweepstakes.com
- Online Crossing (onlinecrossing.com)

Easily add more sources by updating `CONTEST_SOURCES` in components/ScraperPanel.tsx

## Future Enhancements

- 🌐 Expand beyond World Cup to other major events
- 🔄 Automated scheduled scraping
- 📧 Email notifications for expiring contests
- 🎯 Personalized contest recommendations
- 💳 Integration with actual contest entry systems
- 🌍 International contest support

## Important Note

The automation/auto-guide features are designed as portfolio demonstrations of AI capability. They provide detailed instructions but do not actually submit entries or send physical mail. This is a planning and discovery tool first and foremost.

## License

MIT
