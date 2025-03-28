import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { Card } from '../ui/Card';
import { getMonthName, getDaysInMonth, getFirstDayOfMonth } from '../../utils/date';
import { CalendarDay } from './CalendarDay';
import { EventDetails } from './EventDetails';

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, direction === 'next' ? month + 1 : month - 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {getMonthName(currentDate)} {year}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
          
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="h-24 bg-gray-50" />
          ))}
          
          {days.map((day) => (
            <CalendarDay
              key={day}
              day={day}
              events={events.filter((event) => {
                const eventDate = new Date(event.dueDate);
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === month &&
                  eventDate.getFullYear() === year
                );
              })}
              onEventClick={setSelectedEvent}
            />
          ))}
        </div>
      </Card>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}