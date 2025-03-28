import React from 'react';
import { MilestonesList } from './milestones/MilestonesList';
import { WeeklyTasksList } from './tasks/WeeklyTasksList';
import { MonthlyData } from '../../types/timeline';

interface MainContentProps {
  monthlyData: MonthlyData;
  monthKey: string;
}

export function MainContent({ monthlyData, monthKey }: MainContentProps) {
  return (
    <div className="space-y-8">
      <MilestonesList 
        milestones={monthlyData?.milestones || []} 
        monthKey={monthKey} 
      />
      <WeeklyTasksList 
        weeks={monthlyData?.weeks || []} 
        monthKey={monthKey} 
      />
    </div>
  );
}