import React from 'react';
import { Header } from '../components/Header';
import { Calendar } from '../components/calendar/Calendar';

const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'ISEE Test',
    description: 'Upper Level ISEE Test at Testing Center',
    dueDate: '2024-04-15',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    location: 'Testing Center',
    completed: false,
    priority: 'high',
    type: 'test',
    category: 'test-prep',
  },
  {
    id: '2',
    title: 'School Interview',
    description: 'Interview with Phillips Academy Admissions',
    dueDate: '2024-04-18',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    location: 'Phillips Academy',
    completed: false,
    priority: 'high',
    type: 'meeting',
    category: 'interview',
  },
  // Add more sample events as needed
];

export function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">
            Track important dates, deadlines, and meetings
          </p>
        </div>
        <Calendar events={SAMPLE_EVENTS} />
      </main>
    </div>
  );
}