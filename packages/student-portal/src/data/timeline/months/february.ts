import { MonthlyData } from '../../../types/timeline';

export const februaryData: MonthlyData = {
  milestones: [
    {
      id: 'feb-m1',
      title: 'Strengthen Academic Routines',
      description: 'Build consistent study habits and improve core skills',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'feb-m2',
      title: 'Begin Light Test Preparation',
      description: 'Start regular practice with ISEE/SSAT materials',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Writing Development',
      description: 'Focus on essay structure and clarity',
      tasks: [
        {
          id: 'feb-w1-t1',
          title: 'Essay Writing Practice',
          description: 'Write a structured essay about a recent book you read',
          dueDate: '2025-02-07',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'feb-w1-t2',
          title: 'Math Word Problems',
          description: 'Complete practice set of word problems',
          dueDate: '2025-02-07',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Reading Comprehension',
      description: 'Improve reading speed and understanding',
      tasks: [
        {
          id: 'feb-w2-t1',
          title: 'Timed Reading Practice',
          description: 'Read a passage and answer questions within 15 minutes',
          dueDate: '2025-02-14',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'feb-w2-t2',
          title: 'Vocabulary Building',
          description: 'Learn and practice 15 new vocabulary words',
          dueDate: '2025-02-14',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Test Strategies',
      description: 'Learn and practice test-taking techniques',
      tasks: [
        {
          id: 'feb-w3-t1',
          title: 'ISEE Practice Section',
          description: 'Complete one full section of ISEE practice test',
          dueDate: '2025-02-21',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'feb-w3-t2',
          title: 'Review Test Strategies',
          description: 'Learn and practice elimination techniques',
          dueDate: '2025-02-21',
          completed: false,
          priority: 'medium',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Progress Check',
      description: 'Review and assess monthly progress',
      tasks: [
        {
          id: 'feb-w4-t1',
          title: 'Practice Test Review',
          description: 'Review and analyze practice test results',
          dueDate: '2025-02-28',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'feb-w4-t2',
          title: 'Monthly Reflection',
          description: 'Write a reflection on February\'s progress',
          dueDate: '2025-02-28',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    }
  ],
  events: [
    {
      id: 'feb-e1',
      title: 'First Practice Test Review',
      date: 'February 28, 2025',
      type: 'test'
    }
  ]
};