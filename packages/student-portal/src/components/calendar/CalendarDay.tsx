import React from 'react';
import { CalendarEvent } from '../../types';

interface CalendarDayProps {
  day: number;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarDay({ day, events, onEventClick }: CalendarDayProps) {
  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'test':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-24 border border-gray-200 p-1">
      <div className="text-sm font-medium mb-1">{day}</div>
      <div className="space-y-1">
        {events.slice(0, 2).map((event) => (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className={`w-full text-left text-xs p-1 rounded ${getEventColor(
              event.type
            )} truncate`}
          >
            {event.title}
          </button>
        ))}
        {events.length > 2 && (
          <div className="text-xs text-gray-500">
            +{events.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
}