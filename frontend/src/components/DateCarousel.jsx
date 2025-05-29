import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateCarousel({
                                       dates,
                                       selectedDate,
                                       onSelect,
                                       onNext,
                                       onPrev,
                                       canGoBack,
                                     }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const selectedButton = container.querySelector(`[data-date="${selectedDate}"]`);
    if (selectedButton) {
      const containerWidth = container.offsetWidth;
      const buttonLeft = selectedButton.offsetLeft;
      const buttonWidth = selectedButton.offsetWidth;

      const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [selectedDate, dates]);

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 mb-6">
      {/* Arrows */}
      <button
        onClick={onPrev}
        disabled={!canGoBack}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-300 ${
          canGoBack
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:scale-110'
            : 'bg-gray-200 dark:bg-slate-600 text-gray-400 dark:text-slate-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex justify-center gap-8 space-x-3 overflow-x-auto py-2 px-10 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' },
        }}
      >
        {dates.map(d => {
          const isSelected = d.iso === selectedDate;
          return (
            <button
              key={d.iso}
              data-date={d.iso}
              onClick={() => onSelect(d.iso)}
              className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300
                ${isSelected
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg scale-110'
                : 'bg-white dark:bg-slate-700 border-blue-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:scale-105 hover:shadow-md'}
              `}
            >
              <span className="text-sm font-bold">{d.day}</span>
              <span className="text-base font-semibold">{d.date}</span>
              <span className="text-xs font-medium">{d.month}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
