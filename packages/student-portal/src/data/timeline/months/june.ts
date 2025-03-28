import { MonthlyData } from '../../../types/timeline';

export const juneData: MonthlyData = {
  milestones: [
    {
      id: 'jun-m1',
      title: 'Intensive Test Preparation',
      description: 'Begin focused summer test prep program',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'jun-m2',
      title: 'Document Organization',
      description: 'Gather and organize all application materials',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Summer Kickoff',
      description: 'Begin summer preparation schedule',
      tasks: [
        {
          id: 'jun-w1-t1',
          title: 'Test Prep Schedule',
          description: 'Create detailed summer test preparation schedule',
          dueDate: '2025-06-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'jun-w1-t2',
          title: 'Reading List',
          description: 'Start summer reading program with selected books',
          dueDate: '2025-06-07',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Full Test Practice',
      description: 'Complete timed practice tests',
      tasks: [
        {
          id: 'jun-w2-t1',
          title: 'Full ISEE Practice',
          description: 'Take complete timed ISEE practice test',
          dueDate: '2025-06-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'jun-w2-t2',
          title: 'Test Analysis',
          description: 'Review and analyze practice test results',
          dueDate: '2025-06-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Document Collection',
      description: 'Begin gathering application materials',
      tasks: [
        {
          id: 'jun-w3-t1',
          title: 'Document Inventory',
          description: 'Create checklist of required documents and their status',
          dueDate: '2025-06-21',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'jun-w3-t2',
          title: 'Transcript Request',
          description: 'Submit official transcript request to current school',
          dueDate: '2025-06-21',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Summer Progress',
      description: 'Review first month of summer preparation',
      tasks: [
        {
          id: 'jun-w4-t1',
          title: 'Progress Review',
          description: 'Evaluate progress in test preparation and academics',
          dueDate: '2025-06-28',
          completed: false,
          priority: 'medium',
          category: 'academic'
        },
        {
          id: 'jun-w4-t2',
          title: 'Document Organization',
          description: 'Organize collected documents and identify missing items',
          dueDate: '2025-06-28',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    }
  ],
  events: [
    {
      id: 'jun-e1',
      title: 'Summer Programs Begin',
      date: 'June 1, 2025',
      type: 'general'
    },
    {
      id: 'jun-e2',
      title: 'Practice Test Day',
      date: 'June 14, 2025',
      type: 'test'
    }
  ]
};