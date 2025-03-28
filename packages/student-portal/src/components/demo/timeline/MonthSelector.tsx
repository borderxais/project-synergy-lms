import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelineMonth } from '../../../types/timeline';

interface MonthSelectorProps {
  selectedMonth: TimelineMonth;
  onMonthSelect: (month: TimelineMonth) => void;
  monthsWithTasks: Set<string>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthSelector({ selectedMonth, onMonthSelect, monthsWithTasks }: MonthSelectorProps) {
  // Calculate the range of months to display (3 months before and after the selected month)
  const getVisibleMonths = (): TimelineMonth[] => {
    const currentMonthIndex = MONTHS.indexOf(selectedMonth.name);
    const currentYear = selectedMonth.year;
    const months: TimelineMonth[] = [];

    // Add previous 3 months
    for (let i = -3; i <= 3; i++) {
      let monthIndex = currentMonthIndex + i;
      let year = currentYear;

      // Handle year wrap-around
      if (monthIndex < 0) {
        monthIndex += 12;
        year -= 1;
      } else if (monthIndex >= 12) {
        monthIndex -= 12;
        year += 1;
      }

      months.push({
        name: MONTHS[monthIndex],
        year
      });
    }

    return months;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentMonthIndex = MONTHS.indexOf(selectedMonth.name);
    let newMonthIndex = direction === 'next' ? currentMonthIndex + 1 : currentMonthIndex - 1;
    let newYear = selectedMonth.year;

    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear -= 1;
    } else if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear += 1;
    }

    onMonthSelect({
      name: MONTHS[newMonthIndex],
      year: newYear
    });
  };

  const visibleMonths = getVisibleMonths();

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <button
        onClick={() => navigateMonth('prev')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2 overflow-x-auto py-2 px-4">
        {visibleMonths.map(month => {
          const monthKey = `${month.name}-${month.year}`;
          return (
            <button
              key={monthKey}
              onClick={() => onMonthSelect(month)}
              className="relative py-2 px-4 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
            >
              <div className={`
                ${selectedMonth.name === month.name && selectedMonth.year === month.year
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {month.name} {month.year}
                {monthsWithTasks.has(monthKey) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigateMonth('next')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}