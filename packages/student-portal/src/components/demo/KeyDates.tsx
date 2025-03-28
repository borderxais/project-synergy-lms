import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface KeyDate {
  id: string;
  title: string;
  date: string;
  type: 'test' | 'deadline' | 'school' | 'general';
}

interface KeyDatesProps {
  dates: KeyDate[];
}

export function KeyDates({ dates }: KeyDatesProps) {
  const getTypeStyles = (type: KeyDate['type']) => {
    switch (type) {
      case 'test':
        return 'bg-green-100 text-green-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'school':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Key Dates</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {dates.map((date) => (
          <div
            key={date.id}
            className="flex items-start space-x-3 p-3 rounded-md bg-gray-50"
          >
            <div className="flex-shrink-0">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{date.title}</p>
              <p className="text-xs text-gray-500">{date.date}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyles(
                date.type
              )}`}
            >
              {date.type}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}