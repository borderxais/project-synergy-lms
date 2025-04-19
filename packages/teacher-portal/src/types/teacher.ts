import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissionCount: number;
  totalStudents: number;
  status: 'pending' | 'grading' | 'completed';
}

export interface Student {
  id: string;
  name: string;
  emotionalState: 'positive' | 'neutral' | 'negative';
  attendance: number;
  participation: number;
  recentPerformance: 'improving' | 'stable' | 'declining';
  total?: number; // add this line
}


export interface TeachingInsight {
  id: string;
  type: 'improvement' | 'warning' | 'suggestion';
  content: string;
  impact: 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
}

export interface Course {
  id: string;
  name: string;
  studentCount: number;
}


export interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

export interface ClassMetric {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}