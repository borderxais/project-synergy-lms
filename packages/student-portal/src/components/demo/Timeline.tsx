import React from 'react';
import { Card } from '../ui/Card';

interface TimelineMonth {
  name: string;
  year: number;
}

interface TimelineProps {
  selectedMonth: TimelineMonth;
  onMonthSelect: (month: TimelineMonth) => void;
}

const TIMELINE_MONTHS: TimelineMonth[] = [
  { name: 'Jan', year: 2025 },
  { name: 'Feb', year: 2025 },
  { name: 'Mar', year: 2025 },
  { name: 'Apr', year: 2025 },
  { name: 'May', year: 2025 },
  { name: 'June', year: 2025 },
  { name: 'July', year: 2025 },
  { name: 'Aug', year: 2025 },
  { name: 'Sep', year: 2025 },
  { name: 'Oct', year: 2025 },
];

export function Timeline({ selectedMonth, onMonthSelect }: TimelineProps) {
  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {TIMELINE_MONTHS.map(month => (
            <button
              key={`${month.name}-${month.year}`}
              onClick={() => onMonthSelect(month)}
              className={`py-2 px-4 text-sm font-medium rounded-md transition-colors
                ${selectedMonth.name === month.name && selectedMonth.year === month.year
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {month.name} {month.year}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}