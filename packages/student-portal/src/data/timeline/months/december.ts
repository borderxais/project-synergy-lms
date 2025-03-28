import { MonthlyData } from '../../../types/timeline';

export const decemberData: MonthlyData = {
  milestones: [
    {
      id: 'dec-m1',
      title: 'Foundation Setting',
      description: 'Set the foundation for the preparation process',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Initial Assessment',
      description: 'Review current standing and gather materials',
      tasks: [
        {
          id: 'dec-w1-t1',
          title: 'Academic Review',
          description: 'Review past report cards and teacher feedback to identify strengths and areas for improvement',
          dueDate: '2024-12-07',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'dec-w1-t2',
          title: 'Study Space Setup',
          description: 'Set up a dedicated study space with essential supplies',
          dueDate: '2024-12-07',
          completed: false,
          priority: 'medium',
          category: 'academic'
        },
        {
          id: 'dec-w1-t3',
          title: 'Document Collection',
          description: 'Start gathering key documents: locate birth certificate and arrange for translation if needed',
          dueDate: '2024-12-07',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Preparation Launch',
      description: 'Begin initial preparation activities',
      tasks: [
        {
          id: 'dec-w2-t1',
          title: 'Reading Program',
          description: 'Begin daily reading (20-30 minutes) with an age-appropriate book',
          dueDate: '2024-12-14',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'dec-w2-t2',
          title: 'Journal Entry',
          description: 'Write a holiday journal entry about a recent activity or trip',
          dueDate: '2024-12-14',
          completed: false,
          priority: 'medium',
          category: 'academic'
        },
        {
          id: 'dec-w2-t3',
          title: 'Goal Setting',
          description: 'Discuss the upcoming prep plan and set small, realistic goals for January',
          dueDate: '2024-12-14',
          completed: false,
          priority: 'high',
          category: 'academic'
        }
      ]
    }
  ],
  events: [
    {
      id: 'dec-e1',
      title: 'Preparation Journey Begins',
      date: 'December 1, 2024',
      type: 'general'
    }
  ]
};