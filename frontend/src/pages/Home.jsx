import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateCarousel from '../components/DateCarousel';
import MatchCard from '../components/MatchCard';
import { addDays, format, isBefore, startOfDay } from 'date-fns';

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rangeIndex, setRangeIndex] = useState(0);

  // Generate 7 days from current range index
  const daysPerPage = 7;
  const today = startOfDay(new Date());
  const startDate = addDays(today, rangeIndex * daysPerPage);
  const endDate = addDays(startDate, daysPerPage - 1);

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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches?date=${date}`);
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [date]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-white">
        Upcoming Matches
      </h1>

      <DateCarousel
        dates={dates}
        selectedDate={date}
        onSelect={setDate}
        onNext={() => setRangeIndex(prev => prev + 1)}
        onPrev={() => canGoBack && setRangeIndex(prev => prev - 1)}
        canGoBack={canGoBack}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length > 0 ? (
          matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-slate-400">
            No matches available for this date.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
