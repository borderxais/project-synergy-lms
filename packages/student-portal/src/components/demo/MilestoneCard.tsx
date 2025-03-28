import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface MilestoneProps {
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export function MilestoneCard({ title, description, completed, progress }: MilestoneProps) {
  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {completed && (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        )}
      </div>
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            {progress}% Complete
          </div>
        </div>
      </div>
    </Card>
  );
}