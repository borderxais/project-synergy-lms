import React from 'react';
import { MilestoneCard } from './MilestoneCard';
import { MonthlyData } from '../../../types/timeline';

interface MilestonesListProps {
  milestones: MonthlyData['milestones'];
}

export function MilestonesList({ milestones }: MilestonesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Monthly Milestones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map(milestone => (
          <MilestoneCard
            key={milestone.id}
            title={milestone.title}
            description={milestone.description}
            progress={milestone.progress}
            completed={milestone.completed}
          />
        ))}
      </div>
    </div>
  );
}