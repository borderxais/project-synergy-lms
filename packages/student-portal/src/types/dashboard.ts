// Define shared types for dashboard components

export interface ScheduleItem {
    day: string;
    time: string;
    subject: string;
    type: 'fencing' | 'education' | 'recess' | 'college' | 'club';
    location?: string;
    notes?: string[];
  }
  
  export interface Course {
    id: string;
    name: string;
    instructor: string;
    progress: number;
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
    category?: string;
  }