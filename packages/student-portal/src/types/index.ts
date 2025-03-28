export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'test-prep' | 'extracurricular' | 'document' | 'interview';
}

export interface CalendarEvent extends Task {
  startTime?: string;
  endTime?: string;
  location?: string;
  type: 'task' | 'deadline' | 'meeting' | 'test';
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'test-prep' | 'academic' | 'interview' | 'documents' | 'general';
  type: 'document' | 'video' | 'link' | 'practice-test';
  url: string;
  tags: string[];
}