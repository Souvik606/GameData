import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export default function LeagueFilter({ leagues, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedObj = leagues.find(l => String(l.league.id) === String(selected));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 mb-8" ref={ref}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-white">
          Filter by League
        </span>
      </div>

      <div className="relative">
        {/* Trigger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-white font-medium focus:outline-none"
        >
          <div className="flex items-center space-x-3">
            {selectedObj ? (
              <img
                src={selectedObj.league.logo}
                alt={selectedObj.league.name}
                className="w-6 h-6 object-contain rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" />
            )}
            <span>
              {selectedObj
                ? `${selectedObj.league.name}${selectedObj.league.type ? ` (${selectedObj.league.type})` : ''}`
                : 'All Leagues'}
            </span>
          </div>
          <ChevronDown className={`h-5 w-5 transform transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Options */}
        {open && (
          <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg">
            {/* “All Leagues” option */}
            <li
              onClick={() => { onChange(''); setOpen(false); }}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" />
              <span className="text-gray-800 dark:text-white">All Leagues</span>
            </li>

            {/* League options */}
            {leagues.map(l => (
              <li
                key={l.league.id}
                onClick={() => { onChange(l.league.id); setOpen(false); }}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <img
                  src={l.league.logo}
                  alt={l.league.name}
                  className="w-6 h-6 object-contain rounded-full"
                />
                <span className="text-gray-800 dark:text-white">
                  {l.league.name}{l.league.type ? ` (${l.league.type})` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
