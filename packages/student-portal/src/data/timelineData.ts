import { Task } from '../types';

export interface MonthlyData {
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    completed: boolean;
  }>;
  tasks: Task[];
  events: Array<{
    id: string;
    title: string;
    date: string;
    type: 'test' | 'deadline' | 'school' | 'general';
  }>;
}

export const TIMELINE_DATA: Record<string, MonthlyData> = {
  'September-2024': {
    milestones: [
      {
        id: '1',
        title: 'Application Portal Opens',
        description: 'Begin gathering documents and preparing materials',
        progress: 0,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Create Application Accounts',
        description: 'Set up accounts on school application portals',
        dueDate: '2024-09-15',
        completed: false,
        priority: 'high',
        category: 'document',
      }
    ],
    events: [
      {
        id: '1',
        title: 'Application Portal Opens',
        date: 'September 1, 2024',
        type: 'general',
      }
    ],
  },
  'October-2024': {
    milestones: [
      {
        id: '1',
        title: 'Test Preparation',
        description: 'Begin ISEE/SSAT preparation',
        progress: 30,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Schedule ISEE/SSAT Test',
        description: 'Register for December test date',
        dueDate: '2024-10-15',
        completed: false,
        priority: 'high',
        category: 'test-prep',
      }
    ],
    events: [
      {
        id: '1',
        title: 'Test Registration Deadline',
        date: 'October 15, 2024',
        type: 'deadline',
      }
    ],
  },
  'November-2024': {
    milestones: [
      {
        id: '1',
        title: 'Essay Writing',
        description: 'Draft and revise application essays',
        progress: 50,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Complete Essay Drafts',
        description: 'Write first drafts of all required essays',
        dueDate: '2024-11-30',
        completed: false,
        priority: 'high',
        category: 'academic',
      }
    ],
    events: [
      {
        id: '1',
        title: 'Essay Workshop',
        date: 'November 15, 2024',
        type: 'general',
      }
    ],
  },
  'December-2024': {
    milestones: [
      {
        id: '1',
        title: 'Test Taking',
        description: 'Take ISEE/SSAT and complete interviews',
        progress: 80,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Take ISEE/SSAT',
        description: 'Complete standardized testing',
        dueDate: '2024-12-15',
        completed: false,
        priority: 'high',
        category: 'test-prep',
      }
    ],
    events: [
      {
        id: '1',
        title: 'ISEE/SSAT Test Date',
        date: 'December 15, 2024',
        type: 'test',
      }
    ],
  },
  'January-2025': {
    milestones: [
      {
        id: '1',
        title: 'Final Submission',
        description: 'Submit all applications and materials',
        progress: 90,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Submit Applications',
        description: 'Final review and submission of all materials',
        dueDate: '2025-01-15',
        completed: false,
        priority: 'high',
        category: 'document',
      }
    ],
    events: [
      {
        id: '1',
        title: 'Application Deadline',
        date: 'January 15, 2025',
        type: 'deadline',
      }
    ],
  },
  'March-2025': {
    milestones: [
      {
        id: '1',
        title: 'Decision Period',
        description: 'Receive and review admission decisions',
        progress: 0,
        completed: false,
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Review Decisions',
        description: 'Compare offers and make final choice',
        dueDate: '2025-03-31',
        completed: false,
        priority: 'high',
        category: 'general',
      }
    ],
    events: [
      {
        id: '1',
        title: 'Decision Notification',
        date: 'March 10, 2025',
        type: 'deadline',
      }
    ],
  }
};