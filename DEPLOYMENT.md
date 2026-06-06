# Deployment & Production Guide

## Local Development

### Prerequisites Checklist
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL running (`psql --version`)
- [ ] Anthropic API key (from https://console.anthropic.com/)
- [ ] Database created (`createdb contest_finder`)

### Development Setup
```bash
npm install
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/contest_finder" > .env.local
echo "ANTHROPIC_API_KEY=your-key-here" >> .env.local
npm run dev
```

Visit http://localhost:3000

## Production Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides the best experience.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to connect GitHub & deploy
```

**Environment variables on Vercel:**
1. Go to Project Settings → Environment Variables
2. Add:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ANTHROPIC_API_KEY`: Your API key

**Database options for Vercel:**
- Vercel Postgres (built-in)
- AWS RDS
- Supabase
- Railway
- PlanetScale

### Option 2: Railway.app

Simple deployment with PostgreSQL included.

```bash
npm install -g @railway/cli
railway init
railway up
```

### Option 3: Docker

Create a containerized deployment.

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t contest-finder .
docker run -p 3000:3000 -e DATABASE_URL=... -e ANTHROPIC_API_KEY=... contest-finder
```

### Option 4: Self-Hosted (VPS)

On a DigitalOcean/Linode/AWS EC2 instance:

```bash
# SSH into server
ssh user@your-server

# Install Node & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone repo
git clone <your-repo>
cd contest-finder
npm install
npm run build

# Set environment
cp .env.production .env.local

# Start with PM2
pm2 start "npm start" --name contest-finder
pm2 startup
pm2 save
```

## Environment Variables for Production

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/database
ANTHROPIC_API_KEY=sk-ant-...

# Optional
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Database Setup (Production)

### Using Vercel Postgres
```bash
npm install @vercel/postgres
# Just set DATABASE_URL in environment
```

### Using Supabase
```bash
# Create project at supabase.com
# Copy connection string: postgresql://user:pass@host:5432/database
# Set as DATABASE_URL
```

### Using AWS RDS
```bash
# Create RDS PostgreSQL instance
# Get connection string from AWS console
# Format: postgresql://username:password@host:port/database
# Set as DATABASE_URL
```

## Database Migrations

When schema changes:

```bash
# For production, ensure backups exist first
# Then update schema.ts

# Using Drizzle (when migrations are generated):
npm run db:push  # For development
npm run db:migrate  # For production
```

## Monitoring & Logs

### Vercel
- Check deployments: `vercel logs`
- View environment: `vercel env list`
- Check build: Dashboard → Deployments

### Self-hosted with PM2
```bash
pm2 logs contest-finder
pm2 monitor
pm2 status
```

### Error Tracking (Optional)
```bash
npm install @sentry/nextjs
# Configure in next.config.js
```

## Performance Optimization

### Image Optimization
Already configured in Next.js - images are optimized automatically.

### Database Optimization
```javascript
// In lib/db.ts - ensure connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Connection pool size
});
```

### API Response Caching
```typescript
// In route handlers
response.headers.set('Cache-Control', 'public, max-age=3600');
```

## Scaling Considerations

### Database
- Monitor query performance
- Add indexes to frequently queried columns
- Consider read replicas for high traffic

### API
- Cache contest list (contests don't change frequently)
- Rate limit scraping to prevent overload
- Consider queue for long-running AI operations

### Frontend
- Already optimized with Next.js
- CSS is tree-shaken by Tailwind
- Code splitting automatic

## Security Checklist

- [ ] Environment variables secured (not in git)
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] CORS configured if needed
- [ ] API keys rotated regularly
- [ ] Database backups enabled
- [ ] SQL injection prevented (Drizzle ORM handles this)
- [ ] Rate limiting on /api/scrape endpoint
- [ ] Input validation on all endpoints

## Monitoring & Alerting

### Key Metrics to Watch
1. API response time (especially /api/scrape)
2. Database connection pool
3. AI API errors (rate limits, quota)
4. Database size
5. Error rates

### Setup Monitoring
```bash
# Datadog, New Relic, or CloudWatch
npm install datadog-browser-rum

# In app/layout.tsx
import { datadogRum } from '@datadog/browser-rum';
datadogRum.init({
  applicationId: '...',
  clientToken: '...',
  site: 'datadoghq.com',
});
```

## Troubleshooting Production

### "Database connection failed"
- Verify DATABASE_URL format
- Check firewall rules for database
- Test connection: `psql $DATABASE_URL`

### "API key invalid"
- Confirm ANTHROPIC_API_KEY is set
- Check key hasn't expired
- Verify it matches environment

### "Out of memory"
- Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Optimize AI agent responses
- Reduce contest batch size

### "Slow API responses"
- Check database indexes
- Monitor AI API response times
- Consider caching strategies

## Backup & Recovery

### Database Backups
```bash
# Automated (most cloud platforms)
# Or manual:
pg_dump $DATABASE_URL > backup.sql
psql $DATABASE_URL < backup.sql
```

### Recovery Plan
1. Database down → Switch to backup RDS instance
2. API down → Automatic restart (Vercel/PM2)
3. Complete failure → Use git to redeploy

## CI/CD Integration

### GitHub Actions
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
      - run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Pre-deployment Checklist
- [ ] Tests pass
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Backup exists

## Rollback Plan

If deployment goes wrong:

```bash
# Vercel
vercel rollback

# Manual
git revert <commit-hash>
git push

# PM2
pm2 restart contest-finder
```

## Cost Estimates

### Cloud Deployments
- **Vercel (free tier)**: $0-20/month
- **Vercel Postgres**: $12-300/month (data)
- **Supabase**: Free tier + $25/month
- **Railway**: ~$5-50/month
- **AWS RDS**: $15-100/month

### Estimated Monthly
- **Small (dev/test)**: $15-30
- **Medium (production)**: $50-100
- **Large (high traffic)**: $200+

## Maintenance

### Regular Tasks
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Check API quotas (Anthropic)
- [ ] Monitor database size
- [ ] Review error logs

### Monthly
- [ ] Run full test suite
- [ ] Update dependencies
- [ ] Review database indexes
- [ ] Check backup status

Good luck with production deployment! 🚀
