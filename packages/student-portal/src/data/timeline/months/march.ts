import { MonthlyData } from '../../../types/timeline';

export const marchData: MonthlyData = {
  milestones: [
    {
      id: 'mar-m1',
      title: 'Structured Test Practice',
      description: 'Establish regular test preparation routine',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'mar-m2',
      title: 'Academic Excellence',
      description: 'Maintain strong grades while preparing for tests',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Test Preparation',
      description: 'Focus on systematic test practice',
      tasks: [
        {
          id: 'mar-w1-t1',
          title: 'Complete Math Section',
          description: 'Take a full math section under timed conditions',
          dueDate: '2025-03-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'mar-w1-t2',
          title: 'Verbal Practice',
          description: 'Complete verbal reasoning practice set',
          dueDate: '2025-03-07',
          completed: false,
          priority: 'medium',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Academic Focus',
      description: 'Balance test prep with regular schoolwork',
      tasks: [
        {
          id: 'mar-w2-t1',
          title: 'School Project',
          description: 'Work on current school assignments',
          dueDate: '2025-03-14',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'mar-w2-t2',
          title: 'Reading Practice',
          description: 'Complete two reading comprehension passages',
          dueDate: '2025-03-14',
          completed: false,
          priority: 'medium',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Mock Interview',
      description: 'Begin interview preparation',
      tasks: [
        {
          id: 'mar-w3-t1',
          title: 'Interview Practice',
          description: 'Practice common interview questions',
          dueDate: '2025-03-21',
          completed: false,
          priority: 'high',
          category: 'interview'
        },
        {
          id: 'mar-w3-t2',
          title: 'Personal Statement',
          description: 'Start drafting personal statement',
          dueDate: '2025-03-21',
          completed: false,
          priority: 'medium',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Document Preparation',
      description: 'Begin organizing application materials',
      tasks: [
        {
          id: 'mar-w4-t1',
          title: 'Document Checklist',
          description: 'Create list of required documents',
          dueDate: '2025-03-28',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'mar-w4-t2',
          title: 'Progress Assessment',
          description: 'Review March progress and plan for April',
          dueDate: '2025-03-28',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    }
  ],
  events: [
    {
      id: 'mar-e1',
      title: 'Mock Interview Workshop',
      date: 'March 21, 2025',
      type: 'general'
    }
  ]
};