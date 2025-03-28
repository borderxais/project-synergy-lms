import { MonthlyData } from '../../../types/timeline';

export const aprilData: MonthlyData = {
  milestones: [
    {
      id: 'apr-m1',
      title: 'First Full Practice Test',
      description: 'Complete and analyze a full-length practice test',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'apr-m2',
      title: 'Writing Portfolio',
      description: 'Develop writing samples and begin essays',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Test Preparation',
      description: 'Prepare for first full practice test',
      tasks: [
        {
          id: 'apr-w1-t1',
          title: 'Full Practice Test',
          description: 'Take complete ISEE/SSAT practice test under timed conditions',
          dueDate: '2025-04-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'apr-w1-t2',
          title: 'Test Analysis',
          description: 'Review and analyze test results with detailed notes',
          dueDate: '2025-04-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Targeted Practice',
      description: 'Focus on areas identified in practice test',
      tasks: [
        {
          id: 'apr-w2-t1',
          title: 'Math Review',
          description: 'Practice problems in identified weak areas',
          dueDate: '2025-04-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'apr-w2-t2',
          title: 'Vocabulary Building',
          description: 'Learn and practice new vocabulary words',
          dueDate: '2025-04-14',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Essay Writing',
      description: 'Begin working on application essays',
      tasks: [
        {
          id: 'apr-w3-t1',
          title: 'Essay Brainstorming',
          description: 'Generate topics for application essays',
          dueDate: '2025-04-21',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'apr-w3-t2',
          title: 'First Draft',
          description: 'Write first draft of main application essay',
          dueDate: '2025-04-21',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Writing Review',
      description: 'Review and refine written materials',
      tasks: [
        {
          id: 'apr-w4-t1',
          title: 'Essay Revision',
          description: 'Revise and edit first draft with feedback',
          dueDate: '2025-04-28',
          completed: false,
          priority: 'high',
          category: 'document'
        },
        {
          id: 'apr-w4-t2',
          title: 'Writing Portfolio',
          description: 'Organize writing samples and achievements',
          dueDate: '2025-04-28',
          completed: false,
          priority: 'medium',
          category: 'document'
        }
      ]
    }
  ],
  events: [
    {
      id: 'apr-e1',
      title: 'Full Practice Test Day',
      date: 'April 15, 2025',
      type: 'test'
    },
    {
      id: 'apr-e2',
      title: 'Essay Workshop',
      date: 'April 21, 2025',
      type: 'general'
    }
  ]
};