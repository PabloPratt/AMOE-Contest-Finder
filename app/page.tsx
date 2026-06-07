'use client';

import { useEffect, useState } from 'react';
import ContestCard from '@/components/ContestCard';
import FilterBar from '@/components/FilterBar';
import ScraperPanel from '@/components/ScraperPanel';

interface Contest {
  id: string;
  title: string;
  description?: string;
  prizeDescription: string;
  estimatedValue?: string;
  endDate: string;
  physicalRequirements?: string;
  amoeMethod?: string;
  verified: boolean;
  verificationScore?: string;
}

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'endDate' | 'value'>('endDate');
  const [scraperOpen, setScraperOpen] = useState(false);

  const fetchContests = async (sortBy: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/contests?sortBy=${sortBy}&event=worldcup&skipExpired=true`
      );
      const data = await response.json();
      setContests(data);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests(sortBy);
  }, [sortBy]);

  const handleScraperComplete = () => {
    setScraperOpen(false);
    fetchContests(sortBy);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏆 Contest Finder
          </h1>
          <p className="text-slate-300">
            Discover World Cup promotional contests with AMOE (Any Manner Of Entry) options
          </p>
        </div>

        <div className="mb-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg">
          <p className="text-yellow-200 text-sm mb-3">
            ⚠️ <strong>Database Setup Required</strong><br/>
            To use this app, add a PostgreSQL database to your Vercel project.
          </p>
          <div className="text-xs text-yellow-100 space-y-2">
            <p><strong>Option 1: Quick Setup (Recommended)</strong></p>
            <p className="font-mono bg-black bg-opacity-30 p-2 rounded">
              vercel postgres create
            </p>
            <p className="mt-2"><strong>Option 2: Use Existing Database</strong></p>
            <p>Set DATABASE_URL and ANTHROPIC_API_KEY in Vercel Environment Variables</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setScraperOpen(!scraperOpen)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            disabled={true}
            title="Database must be configured first"
          >
            {scraperOpen ? 'Hide Scraper' : 'Scrape Contests'}
          </button>
        </div>

        {scraperOpen && <ScraperPanel onComplete={handleScraperComplete} />}

        <FilterBar sortBy={sortBy} onSortChange={setSortBy} />

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-slate-300 mt-4">Loading contests...</p>
          </div>
        )}

        {!loading && contests.length === 0 && (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <p className="text-slate-400 mb-4">No contests found yet</p>
            <button
              onClick={() => setScraperOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Start by scraping contests →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </div>
    </main>
  );
}
