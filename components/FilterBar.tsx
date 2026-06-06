'use client';

interface FilterBarProps {
  sortBy: 'endDate' | 'value';
  onSortChange: (sort: 'endDate' | 'value') => void;
}

export default function FilterBar({ sortBy, onSortChange }: FilterBarProps) {
  return (
    <div className="mb-6 flex gap-4 bg-slate-800 p-4 rounded-lg">
      <div>
        <label className="block text-xs text-slate-400 mb-2 font-semibold">Sort By</label>
        <div className="flex gap-2">
          <button
            onClick={() => onSortChange('endDate')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              sortBy === 'endDate'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            ⏰ Expiring Soon
          </button>
          <button
            onClick={() => onSortChange('value')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              sortBy === 'value'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            💰 Highest Value
          </button>
        </div>
      </div>

      <div className="ml-auto">
        <p className="text-xs text-slate-400 mb-2">Showing World Cup AMOE Contests</p>
        <span className="inline-block px-2 py-1 text-xs bg-green-900 text-green-200 rounded">
          ✓ All AMOE Verified
        </span>
      </div>
    </div>
  );
}
