'use client';

import { useState } from 'react';
import ApplicationModal from './ApplicationModal';

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

export default function ContestCard({ contest }: { contest: Contest }) {
  const [showApplication, setShowApplication] = useState(false);
  const daysUntilExpiry = Math.ceil(
    (new Date(contest.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 7;

  const estimatedValue = contest.estimatedValue ? parseInt(contest.estimatedValue) : null;

  return (
    <>
      <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition border border-slate-600 hover:border-slate-500">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex-1">{contest.title}</h3>
          {isExpiringSoon && (
            <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded whitespace-nowrap">
              Expires soon
            </span>
          )}
        </div>

        {contest.description && (
          <p className="text-sm text-slate-300 mb-3 line-clamp-2">{contest.description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-400">Prize:</span>
            <span className="text-sm text-slate-200 text-right">
              {contest.prizeDescription}
            </span>
          </div>

          {estimatedValue && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Est. Value:</span>
              <span className="text-sm font-semibold text-green-400">${estimatedValue.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-400">Expires:</span>
            <span className={`text-sm font-medium ${isExpiringSoon ? 'text-red-300' : 'text-slate-200'}`}>
              {new Date(contest.endDate).toLocaleDateString()} ({daysUntilExpiry} days)
            </span>
          </div>

          {contest.amoeMethod && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-400">AMOE:</span>
              <span className="text-xs text-slate-300 text-right max-w-xs">
                {contest.amoeMethod}
              </span>
            </div>
          )}

          {contest.physicalRequirements && (
            <div className="mt-3 p-2 bg-blue-900 bg-opacity-30 rounded text-xs text-blue-200 border border-blue-800">
              ✉️ Physical entry required: {contest.physicalRequirements}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowApplication(true)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium transition"
          >
            Apply
          </button>
          <button
            onClick={() => setShowApplication(true)}
            className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded font-medium transition"
            title="Portfolio feature: auto-generate entry instructions"
          >
            ⚙️ Auto-Guide
          </button>
        </div>
      </div>

      {showApplication && (
        <ApplicationModal
          contest={contest}
          onClose={() => setShowApplication(false)}
        />
      )}
    </>
  );
}
