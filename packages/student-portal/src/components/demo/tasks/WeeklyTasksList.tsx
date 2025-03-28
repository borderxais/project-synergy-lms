import React from 'react';
import { Card } from '../../ui/Card';
import { WeekTasks } from './WeekTasks';
import { MonthlyData } from '../../../types/timeline';

interface WeeklyTasksListProps {
  weeks: MonthlyData['weeks'];
  monthKey: string;
}

export function WeeklyTasksList({ weeks = [], monthKey }: WeeklyTasksListProps) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Tasks</h2>
        <Card>
          <p className="text-gray-500 text-center py-4">No tasks available for this week.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Weekly Tasks</h2>
      {weeks.map((week) => (
        <Card key={week.weekNumber} className="overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-700">Week {week.weekNumber}</h3>
            <p className="text-xs text-gray-500">{week.description}</p>
          </div>
          <WeekTasks tasks={week.tasks} monthKey={monthKey} />
        </Card>
      ))}
    </div>
  );
}