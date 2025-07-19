// Define shared types for dashboard components

export interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  type: 'athletics' | 'recess' | 'college' | 'club' | 'math' | 'english' | 'science' | 'history' | 'language';
  notes?: string[];
  customColor?: string;
  room?: string;
  instructor?: string;
  isRecurring?: boolean;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  type: 'athletics' | 'recess' | 'college' | 'club' | 'math' | 'english' | 'science' | 'history' | 'language';
  grade: {
    percentage: number;
    letter: string;
  };
  room?: string;
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