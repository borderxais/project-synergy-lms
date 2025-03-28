import React from 'react';
import { Progress } from './ui/Progress';
import { Card } from './ui/Card';

interface MonthlyProgressProps {
  month: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
}

export function MonthlyProgress({ month, progress, tasks }: MonthlyProgressProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg">{month}</h3>
        <p className="text-sm text-gray-600">
          {tasks.completed} of {tasks.total} tasks completed
        </p>
      </div>
      <Progress value={progress} size="sm" />
    </Card>
  );
}