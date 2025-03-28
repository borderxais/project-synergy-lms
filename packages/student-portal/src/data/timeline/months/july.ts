import { MonthlyData } from '../../../types/timeline';

export const julyData: MonthlyData = {
  milestones: [
    {
      id: 'jul-m1',
      title: 'Interview Preparation',
      description: 'Build confidence through mock interviews',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'jul-m2',
      title: 'Test Mastery',
      description: 'Achieve target scores in practice tests',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Interview Skills',
      description: 'Focus on interview preparation',
      tasks: [
        {
          id: 'jul-w1-t1',
          title: 'Mock Interview',
          description: 'Complete first formal mock interview session',
          dueDate: '2025-07-07',
          completed: false,
          priority: 'high',
          category: 'interview'
        },
        {
          id: 'jul-w1-t2',
          title: 'Interview Questions',
          description: 'Practice common interview questions and responses',
          dueDate: '2025-07-07',
          completed: false,
          priority: 'high',
          category: 'interview'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Test Excellence',
      description: 'Continue intensive test preparation',
      tasks: [
        {
          id: 'jul-w2-t1',
          title: 'Practice Test',
          description: 'Complete and review full practice test',
          dueDate: '2025-07-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'jul-w2-t2',
          title: 'Weak Areas Focus',
          description: 'Intensive practice on identified weak areas',
          dueDate: '2025-07-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Application Essays',
      description: 'Refine application essays',
      tasks: [
        {
          id: 'jul-w3-t1',
          title: 'Essay Review',
          description: 'Get feedback on essays from teachers or mentors',
          dueDate: '2025-07-21',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'jul-w3-t2',
          title: 'Final Drafts',
          description: 'Complete final drafts of all required essays',
          dueDate: '2025-07-21',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Progress Assessment',
      description: 'Evaluate summer progress',
      tasks: [
        {
          id: 'jul-w4-t1',
          title: 'Test Score Review',
          description: 'Analyze progress in practice test scores',
          dueDate: '2025-07-28',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'jul-w4-t2',
          title: 'Interview Practice',
          description: 'Conduct final mock interview session',
          dueDate: '2025-07-28',
          completed: false,
          priority: 'high',
          category: 'interview'
        }
      ]
    }
  ],
  events: [
    {
      id: 'jul-e1',
      title: 'Mock Interview Day',
      date: 'July 7, 2025',
      type: 'general'
    },
    {
      id: 'jul-e2',
      title: 'Final Practice Test',
      date: 'July 28, 2025',
      type: 'test'
    }
  ]
};