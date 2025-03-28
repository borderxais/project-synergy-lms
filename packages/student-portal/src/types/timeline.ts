import { Task } from './index';

export interface TimelineMonth {
  name: string;
  year: number;
}

export interface WeeklyTasks {
  weekNumber: number;
  title: string;
  description: string;
  tasks: Task[];
}

export interface MonthlyData {
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    completed: boolean;
    relatedWeeks: number[]; // Maps which weeks contribute to this milestone
  }>;
  weeks: WeeklyTasks[];
  events: Array<{
    id: string;
    title: string;
    date: string;
    type: 'test' | 'deadline' | 'school' | 'general';
  }>;
}

export interface KeyDate {
  id: string;
  title: string;
  date: string;
  type: 'test' | 'deadline' | 'school' | 'general';
}