import React from 'react';
import { Progress } from '../ui/Progress';

interface DemoHeaderProps {
  firstName: string;
  selectedMonth: {
    name: string;
    year: number;
  };
  progress: number;
}

export function DemoHeader({ firstName, selectedMonth, progress }: DemoHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to the Demo, My Friend!
        </h1>
        <p className="text-gray-600">
          Viewing timeline for {selectedMonth.name} {selectedMonth.year}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Overall Progress</span>
        <Progress value={progress} size="lg" />
      </div>
    </div>
  );
}