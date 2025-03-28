import { MonthlyData } from '../../../types/timeline';

export const mayData: MonthlyData = {
  milestones: [
    {
      id: 'may-m1',
      title: 'Test Score Improvement',
      description: 'Focus on raising scores in weak areas',
      progress: 0,
      completed: false,
      relatedWeeks: [1, 2]
    },
    {
      id: 'may-m2',
      title: 'Summer Planning',
      description: 'Finalize summer enrichment activities',
      progress: 0,
      completed: false,
      relatedWeeks: [3, 4]
    }
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Score Analysis',
      description: 'Deep dive into test performance',
      tasks: [
        {
          id: 'may-w1-t1',
          title: 'Practice Test Review',
          description: 'Analyze recent test performance and identify patterns',
          dueDate: '2025-05-07',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'may-w1-t2',
          title: 'Study Plan Update',
          description: 'Revise study plan based on recent performance',
          dueDate: '2025-05-07',
          completed: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Focused Practice',
      description: 'Target specific areas for improvement',
      tasks: [
        {
          id: 'may-w2-t1',
          title: 'Math Drills',
          description: 'Complete targeted math practice exercises',
          dueDate: '2025-05-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        },
        {
          id: 'may-w2-t2',
          title: 'Reading Comprehension',
          description: 'Practice advanced reading passages',
          dueDate: '2025-05-14',
          completed: false,
          priority: 'high',
          category: 'test-prep'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Summer Planning',
      description: 'Organize summer activities and study schedule',
      tasks: [
        {
          id: 'may-w3-t1',
          title: 'Summer Schedule',
          description: 'Create detailed summer study and activity schedule',
          dueDate: '2025-05-21',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'may-w3-t2',
          title: 'Program Registration',
          description: 'Complete registration for summer programs',
          dueDate: '2025-05-21',
          completed: false,
          priority: 'medium',
          category: 'extracurricular'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'End of School Year',
      description: 'Wrap up current school year strong',
      tasks: [
        {
          id: 'may-w4-t1',
          title: 'Final Grades Review',
          description: 'Ensure all assignments are completed and submitted',
          dueDate: '2025-05-28',
          completed: false,
          priority: 'high',
          category: 'academic'
        },
        {
          id: 'may-w4-t2',
          title: 'Teacher Meetings',
          description: 'Meet with teachers to discuss progress and recommendations',
          dueDate: '2025-05-28',
          completed: false,
          priority: 'high',
          category: 'document'
        }
      ]
    }
  ],
  events: [
    {
      id: 'may-e1',
      title: 'Summer Program Registration Deadline',
      date: 'May 15, 2025',
      type: 'deadline'
    },
    {
      id: 'may-e2',
      title: 'School Year Ends',
      date: 'May 28, 2025',
      type: 'school'
    }
  ]
};