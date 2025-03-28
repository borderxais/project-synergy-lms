import { MonthlyData } from '../../../types/timeline';

export const januaryData: MonthlyData = {
  milestones: [
    {
      id: 'jan-m1',
      title: 'Foundation Building',
      description: 'Establish core academic skills and study habits',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'jan-m2',
      title: 'Test Introduction',
      description: 'Familiarize with ISEE/SSAT format and content',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Academic Assessment',
      description: 'Review current academic standing',
      tasks: [
        {
          id: 'jan-w1-t1',
          title: 'Skills Assessment',
          description: 'Complete initial assessment in math and reading',
          dueDate: '2025-01-07',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'jan-w1-t2',
          title: 'Study Schedule',
          description: 'Create weekly study schedule and goals',
          dueDate: '2025-01-07',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Reading Development',
      description: 'Build strong reading comprehension skills',
      tasks: [
        {
          id: 'jan-w2-t1',
          title: 'Reading Log',
          description: 'Start daily reading log with comprehension notes',
          dueDate: '2025-01-14',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'jan-w2-t2',
          title: 'Vocabulary Building',
          description: 'Begin learning common ISEE/SSAT vocabulary words',
          dueDate: '2025-01-14',
          completed: false,
          priority: 'medium',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Test Overview',
      description: 'Introduction to standardized tests',
      tasks: [
        {
          id: 'jan-w3-t1',
          title: 'Test Research',
          description: 'Research ISEE/SSAT format and requirements',
          dueDate: '2025-01-21',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'jan-w3-t2',
          title: 'Practice Questions',
          description: 'Complete sample questions from each test section',
          dueDate: '2025-01-21',
          completed: false,
          priority: 'medium',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Planning Ahead',
      description: 'Set goals and create action plan',
      tasks: [
        {
          id: 'jan-w4-t1',
          title: 'School Research',
          description: 'Begin researching potential target schools',
          dueDate: '2025-01-28',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'jan-w4-t2',
          title: 'Progress Review',
          description: 'Review January progress and set February goals',
          dueDate: '2025-01-28',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    }
  ],
  events: [
    {
      id: 'jan-e1',
      title: 'Preparation Journey Begins',
      date: 'January 1, 2025',
      type: 'general'
    },
    {
      id: 'jan-e2',
      title: 'First Progress Check',
      date: 'January 28, 2025',
      type: 'general'
    }
  ]
};