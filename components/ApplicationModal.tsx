'use client';

import { useState } from 'react';

interface Contest {
  id: string;
  title: string;
  prizeDescription: string;
  endDate: string;
  physicalRequirements?: string;
}

interface ApplicationModalProps {
  contest: Contest;
  onClose: () => void;
}

export default function ApplicationModal({ contest, onClose }: ApplicationModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [automate, setAutomate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestId: contest.id,
          email,
          name,
          automate,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Application error:', error);
      setResult({ error: 'Failed to submit application' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">{contest.title}</h2>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {contest.physicalRequirements && (
              <div className="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-800">
                <label className="flex items-start gap-2 text-sm text-blue-200">
                  <input
                    type="checkbox"
                    checked={automate}
                    onChange={(e) => setAutomate(e.target.checked)}
                    className="mt-1"
                  />
                  <span>Generate detailed entry instructions? <span className="text-xs text-blue-300">(Portfolio demo)</span></span>
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition"
              >
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : result.error ? (
          <div className="text-red-300">
            <p className="font-semibold mb-2">Error</p>
            <p className="text-sm mb-4">{result.error}</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="text-green-300">
            <p className="font-semibold mb-3">✓ Application Recorded</p>

            {result.automationInstructions && (
              <div className="mb-4 p-3 bg-green-900 bg-opacity-20 rounded border border-green-800">
                <p className="text-xs font-semibold text-green-200 mb-2">Generated Entry Instructions:</p>
                <div className="text-xs text-green-100 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.automationInstructions.instructions}
                </div>
              </div>
            )}

            <p className="text-sm text-slate-300 mb-4">
              Application ID: <span className="font-mono text-xs">{result.applicationId.slice(0, 8)}</span>
            </p>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
