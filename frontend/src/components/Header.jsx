import React from 'react';
import { Sun, Moon, Trophy} from 'lucide-react';

// Header Component
export function Header({ darkMode, toggleTheme }) {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-slate-900 shadow-2xl">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Soccer Central
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Upcoming Matches & Live Updates
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-300 group-hover:rotate-12 transition-transform duration-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-100 group-hover:-rotate-12 transition-transform duration-300" />
            )}
            <span className="text-white font-medium">
              {darkMode ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}