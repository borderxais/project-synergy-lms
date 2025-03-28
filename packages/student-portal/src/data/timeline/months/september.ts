import { MonthlyData } from '../../../types/timeline';

export const septemberData: MonthlyData = {
  milestones: [
    {
      id: 'sep-m1',
      title: 'Application Submission',
      description: 'Submit complete applications to all target schools',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'sep-m2',
      title: 'Interview Scheduling',
      description: 'Schedule and prepare for school interviews',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Application Launch',
      description: 'Begin submitting applications',
      tasks: [
        {
          id: 'sep-w1-t1',
          title: 'Portal Setup',
          description: 'Create accounts on school application portals',
          dueDate: '2025-09-07',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'sep-w1-t2',
          title: 'Document Upload',
          description: 'Upload all prepared documents to portals',
          dueDate: '2025-09-07',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Recommendation Management',
      description: 'Manage recommendation requests',
      tasks: [
        {
          id: 'sep-w2-t1',
          title: 'Recommendation Requests',
          description: 'Submit official recommendation requests',
          dueDate: '2025-09-14',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'sep-w2-t2',
          title: 'Follow-up Communications',
          description: 'Send thank-you notes to recommenders',
          dueDate: '2025-09-14',
          completed: false,
          priority: 'medium',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Interview Preparation',
      description: 'Schedule and prepare for interviews',
      tasks: [
        {
          id: 'sep-w3-t1',
          title: 'Interview Scheduling',
          description: 'Schedule interviews with target schools',
          dueDate: '2025-09-21',
          completed: false,
          priority: 'high',
          category: 'interview'
        },
        {
          id: 'sep-w3-t2',
          title: 'Final Interview Prep',
          description: 'Review school-specific interview questions',
          dueDate: '2025-09-21',
          completed: false,
          priority: 'high',
          category: 'interview'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Final Review',
      description: 'Ensure all applications are complete',
      tasks: [
        {
          id: 'sep-w4-t1',
          title: 'Application Audit',
          description: 'Final review of all submitted materials',
          dueDate: '2025-09-28',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'sep-w4-t2',
          title: 'Confirmation Check',
          description: 'Verify receipt of all submitted materials',
          dueDate: '2025-09-28',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    }
  ],
  events: [
    {
      id: 'sep-e1',
      title: 'Application Portal Opens',
      date: 'September 1, 2025',
      type: 'deadline'
    },
    {
      id: 'sep-e2',
      title: 'First School Interview',
      date: 'September 21, 2025',
      type: 'school'
    }
  ]
};