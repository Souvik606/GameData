import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export default function LeagueFilter({ leagues, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // now leagues is [ {id,name,type,logo}, … ]
  const selectedObj = leagues.find(l => String(l.id) === String(selected));

  return (
    <div ref={ref} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-white">
          Filter by League
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            {selectedObj ? (
              <img src={selectedObj.logo} alt="" className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" />
            )}
            <span className="text-gray-800 dark:text-white font-medium">
              {selectedObj
                ? `${selectedObj.name}${selectedObj.type ? ` (${selectedObj.type})` : ''}`
                : 'All Leagues'}
            </span>
          </div>
          <ChevronDown className={`h-5 w-5 transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-auto bg-white dark:bg-slate-800 border rounded-xl shadow-lg">
            <li
              onClick={() => { onChange(''); setOpen(false); }}
              className="flex items-center px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <div className="w-6 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" />
              <span className="ml-3 text-gray-800 dark:text-white">All Leagues</span>
            </li>
            {leagues.map(l => (
              <li
                key={l.id}
                onClick={() => { onChange(l.id); setOpen(false); }}
                className="flex items-center px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <img src={l.logo} alt="" className="w-6 h-6 rounded-full" />
                <span className="ml-3 text-gray-800 dark:text-white">
                  {l.name}{l.type && ` (${l.type})`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
