import { ResourceItem } from '../types';

export const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: '1',
    title: 'ISEE Upper Level Practice Test 1',
    description: 'Complete practice test with answer key and explanations',
    category: 'test-prep',
    type: 'practice-test',
    url: '/resources/isee-practice-test-1.pdf',
    tags: ['ISEE', 'practice test', 'upper level'],
  },
  {
    id: '2',
    title: 'Interview Preparation Guide',
    description: 'Tips and common questions for school interviews',
    category: 'interview',
    type: 'document',
    url: '/resources/interview-guide.pdf',
    tags: ['interview', 'preparation', 'tips'],
  },
  {
    id: '3',
    title: 'Essay Writing Workshop',
    description: 'Video tutorial on writing compelling application essays',
    category: 'academic',
    type: 'video',
    url: 'https://example.com/essay-workshop',
    tags: ['writing', 'essay', 'tutorial'],
  },
  // Add more sample resources
];