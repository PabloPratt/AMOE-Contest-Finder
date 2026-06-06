'use client';

import { useState } from 'react';

interface ScraperPanelProps {
  onComplete: () => void;
}

const CONTEST_SOURCES = [
  { value: 'sweepstakestoday.com', label: 'Sweepstakes Today' },
  { value: 'contestgirl.com', label: 'Contest Girl' },
  { value: 'sweepstakes.com', label: 'Sweepstakes.com' },
  { value: 'onlinecrossing.com', label: 'Online Crossing' },
];

export default function ScraperPanel({ onComplete }: ScraperPanelProps) {
  const [source, setSource] = useState(CONTEST_SOURCES[0].value);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const handleScrape = async () => {
    setLoading(true);
    setProgress('Starting scrape...');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: source,
          query: 'world cup AMOE sweepstakes',
        }),
      });

      const data = await response.json();
      setProgress(`Found ${data.contestsFound} contests, added ${data.contestsAdded} new ones`);
      setResult(data);

      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Scrape error:', error);
      setProgress('Error during scrape');
      setResult({ error: 'Scraping failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-slate-800 p-6 rounded-lg border border-slate-600">
      <h3 className="text-lg font-bold text-white mb-4">🤖 AI Contest Scout</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Contest Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
          >
            {CONTEST_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {result && (
          <div
            className={`p-3 rounded text-sm ${
              result.error
                ? 'bg-red-900 bg-opacity-20 border border-red-800 text-red-200'
                : 'bg-green-900 bg-opacity-20 border border-green-800 text-green-200'
            }`}
          >
            {result.error ? '✗ Error: ' : '✓ '} {progress}
          </div>
        )}

        <button
          onClick={handleScrape}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition"
        >
          {loading ? 'Scraping...' : 'Scout Contests'}
        </button>

        <p className="text-xs text-slate-400">
          This agent will use Claude AI to intelligently search for and verify World Cup promotional contests with AMOE options.
        </p>
      </div>
    </div>
  );
}
