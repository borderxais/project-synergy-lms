export interface Course {
  id: string;
  name: string;
  progress: number;
  nextLesson: string;
  source: string;
  type: 'internal' | 'external';
}

export interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'programming' | 'essay';
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

export interface WeakPoint {
  id: string;
  topic: string;
  description: string;
  recommendedAction: string;
}

export interface StudyMetric {
  label: string;
  value: number;
  icon: string;
  color: string;
}