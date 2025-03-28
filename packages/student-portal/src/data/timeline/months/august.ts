import { MonthlyData } from '../../../types/timeline';

export const augustData: MonthlyData = {
  milestones: [
    {
      id: 'aug-m1',
      title: 'Final Test Preparation',
      description: 'Complete test preparation and achieve target scores',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'aug-m2',
      title: 'Application Readiness',
      description: 'Ensure all components are ready for submission',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Test Registration',
      description: 'Complete test registration process',
      tasks: [
        {
          id: 'aug-w1-t1',
          title: 'Test Registration',
          description: 'Register for official ISEE/SSAT test date',
          dueDate: '2025-08-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'aug-w1-t2',
          title: 'Final Practice',
          description: 'Complete last full practice test',
          dueDate: '2025-08-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Document Review',
      description: 'Final review of all application materials',
      tasks: [
        {
          id: 'aug-w2-t1',
          title: 'Document Check',
          description: 'Review all required documents for completeness',
          dueDate: '2025-08-14',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'aug-w2-t2',
          title: 'Essay Polish',
          description: 'Final review and polish of application essays',
          dueDate: '2025-08-14',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'School Research',
      description: 'Final research on target schools',
      tasks: [
        {
          id: 'aug-w3-t1',
          title: 'School Profiles',
          description: 'Create detailed profiles of target schools',
          dueDate: '2025-08-21',
          completed: false,
          priority: 'medium',
          category: 'academic'
        },
        {
          id: 'aug-w3-t2',
          title: 'Application Timeline',
          description: 'Create timeline for each school\'s requirements',
          dueDate: '2025-08-21',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Final Preparations',
      description: 'Complete all pre-application tasks',
      tasks: [
        {
          id: 'aug-w4-t1',
          title: 'Application Review',
          description: 'Final review of all application components',
          dueDate: '2025-08-28',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'aug-w4-t2',
          title: 'Recommendation Follow-up',
          description: 'Confirm status of recommendation letters',
          dueDate: '2025-08-28',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    }
  ],
  events: [
    {
      id: 'aug-e1',
      title: 'Test Registration Opens',
      date: 'August 1, 2025',
      type: 'deadline'
    },
    {
      id: 'aug-e2',
      title: 'Final Document Review',
      date: 'August 28, 2025',
      type: 'deadline'
    }
  ]
};