import React from 'react';
import { Clock, Trophy, MapPin } from 'lucide-react';

export default function MatchCard({ match }) {
  const dateTime = new Date(match.date);

  return (
    <div className="group flex flex-col justify-between bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1 min-h-[24rem]">

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-3 border-b border-gray-200 dark:border-slate-600 min-h-[3rem]">
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          {match.leagueLogo && (
            <img
              src={match.leagueLogo}
              alt={match.league}
              className="w-5 h-5 object-contain"
            />
          )}
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 break-words">
            {match.league}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 break-words">
          <MapPin className="h-4 w-4" />
          <span>{match.venue}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="p-4 flex-1 flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          {/* Home */}
          <div className="text-center flex-1 px-1">
            {match.homeTeam.logo ? (
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-12 h-12 object-contain mx-auto mb-1"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-lg shadow-lg">
                {match.homeTeam.name.charAt(0)}
              </div>
            )}
            <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-snug break-words">
              {match.homeTeam.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              HOME
            </span>
          </div>

          {/* VS */}
          <div className="px-2">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-3 py-1 rounded-xl">
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                VS
              </span>
            </div>
          </div>

          {/* Away */}
          <div className="text-center flex-1 px-1">
            {match.awayTeam.logo ? (
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-12 h-12 object-contain mx-auto mb-1"
              />
            ) : (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-lg shadow-lg">
                {match.awayTeam.name.charAt(0)}
              </div>
            )}
            <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-snug break-words">
              {match.awayTeam.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              AWAY
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-3 mt-auto min-h-[4rem] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-800 dark:text-white">
              {dateTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Kick-off
            </p>
          </div>
        </div>
      </div>

      {/* Hover bar */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}
