// Define shared types for dashboard components

export interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  type: 'fencing' | 'recess' | 'college' | 'club' | 'math' | 'english' | 'science' | 'history' | 'language';
  notes?: string[];
  customColor?: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  type: 'fencing' | 'recess' | 'college' | 'club' | 'math' | 'english' | 'science' | 'history' | 'language';
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

export interface TodoItem {
  id: string;
  day: string;
  title: string;
  completed: boolean;
  suggestions: string[];
}