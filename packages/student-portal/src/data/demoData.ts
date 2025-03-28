export const DEMO_DATA = {
  user: {
    firstName: 'Demo',
    lastName: 'User',
    grade: 7,
    currentSchool: 'Current Middle School',
    targetSchools: ['Phillips Academy', 'Choate', 'Deerfield']
  },
  progress: 45,
  documents: [
    {
      name: 'Birth Certificate',
      status: 'not_uploaded',
    },
    {
      name: 'Current School Transcript',
      status: 'verified',
      message: 'Verified on Mar 15, 2024'
    },
    {
      name: 'Teacher Recommendation 1',
      status: 'uploaded',
      message: 'Awaiting verification'
    },
    {
      name: 'Teacher Recommendation 2',
      status: 'not_uploaded'
    }
  ],
  resources: [
    {
      id: '1',
      title: 'ISEE Practice Test',
      type: 'practice_test',
      description: 'Full-length practice test with answers'
    },
    {
      id: '2',
      title: 'Interview Tips',
      type: 'video',
      description: 'Expert advice for school interviews'
    },
    {
      id: '3',
      title: 'Essay Writing Guide',
      type: 'document',
      description: 'Step-by-step guide to writing your essays'
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Complete ISEE Registration',
      description: 'Register for the December test date',
      dueDate: '2024-10-15',
      completed: false,
      priority: 'high',
      category: 'test-prep'
    },
    {
      id: '2',
      title: 'Request Teacher Recommendations',
      description: 'Ask two teachers for recommendation letters',
      dueDate: '2024-10-30',
      completed: false,
      priority: 'high',
      category: 'document'
    },
    {
      id: '3',
      title: 'Start Essay Draft',
      description: 'Begin working on application essays',
      dueDate: '2024-11-15',
      completed: false,
      priority: 'medium',
      category: 'academic'
    }
  ]
};