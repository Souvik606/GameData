import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeagueFilter from '../components/LeagueFilter';
import DateCarousel from '../components/DateCarousel';
import MatchCard from '../components/MatchCard';
import { addDays, format, isBefore, startOfDay } from 'date-fns';

export default function Home() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rangeIndex, setRangeIndex] = useState(0);
  const [matches, setMatches] = useState([]);

  // Build 7-day window
  const daysPerPage = 7;
  const today = startOfDay(new Date());
  const startDate = addDays(today, rangeIndex * daysPerPage);
  const dates = Array.from({ length: daysPerPage }).map((_, i) => {
    const dt = addDays(startDate, i);
    return {
      iso: format(dt, 'yyyy-MM-dd'),
      day: format(dt, 'EEE'),
      date: format(dt, 'd'),
      month: format(dt, 'MMM'),
    };
  });
  const canGoBack = isBefore(today, startDate);

  // Fetch leagues once
  useEffect(() => {
    axios.get('http://localhost:5000/api/leagues')
      .then(r => setLeagues(r.data))
      .catch(console.error);
  }, []);

  // Fetch matches on date or league change
  useEffect(() => {
    const params = new URLSearchParams({ date });
    if (selectedLeague) params.append('leagueId', selectedLeague);

    axios.get(`http://localhost:5000/api/matches?${params}`)
      .then(r => setMatches(r.data))
      .catch(console.error);
  }, [date, selectedLeague]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-white">
        Upcoming Matches
      </h1>

      <LeagueFilter
        leagues={leagues}
        selected={selectedLeague}
        onChange={setSelectedLeague}
      />

      <DateCarousel
        dates={dates}
        selectedDate={date}
        onSelect={setDate}
        onNext={() => setRangeIndex(i => i + 1)}
        onPrev={() => canGoBack && setRangeIndex(i => i - 1)}
        canGoBack={canGoBack}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length
          ? matches.map(m => <MatchCard key={m.id} match={m} />)
          : <p className="text-center col-span-full text-gray-500 dark:text-slate-400">
            No matches available for this date.
          </p>}
      </div>
    </div>
  );
}
