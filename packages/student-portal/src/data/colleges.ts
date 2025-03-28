export interface College {
  name: string;
  type: 'public' | 'private';
  state: string;
  ranking?: number;
  category?: string[];
}

export const COLLEGES: College[] = [
  // Ivy League
  { name: 'Harvard University', type: 'private', state: 'MA', ranking: 1, category: ['ivy', 'top10', 'research'] },
  { name: 'Yale University', type: 'private', state: 'CT', ranking: 3, category: ['ivy', 'top10', 'research'] },
  { name: 'Princeton University', type: 'private', state: 'NJ', ranking: 2, category: ['ivy', 'top10', 'research'] },
  { name: 'Columbia University', type: 'private', state: 'NY', ranking: 7, category: ['ivy', 'top10', 'research'] },
  { name: 'University of Pennsylvania', type: 'private', state: 'PA', ranking: 6, category: ['ivy', 'top10', 'research'] },
  { name: 'Brown University', type: 'private', state: 'RI', ranking: 13, category: ['ivy', 'top30', 'research'] },
  { name: 'Dartmouth College', type: 'private', state: 'NH', ranking: 12, category: ['ivy', 'top30', 'research'] },
  { name: 'Cornell University', type: 'private', state: 'NY', ranking: 17, category: ['ivy', 'top30', 'research'] },

  // Top Private Universities
  { name: 'Stanford University', type: 'private', state: 'CA', ranking: 4, category: ['top10', 'research'] },
  { name: 'MIT', type: 'private', state: 'MA', ranking: 5, category: ['top10', 'research', 'technical'] },
  { name: 'California Institute of Technology', type: 'private', state: 'CA', ranking: 8, category: ['top10', 'technical'] },
  { name: 'Johns Hopkins University', type: 'private', state: 'MD', ranking: 9, category: ['top10', 'research'] },
  { name: 'Northwestern University', type: 'private', state: 'IL', ranking: 10, category: ['top10', 'research'] },
  { name: 'Duke University', type: 'private', state: 'NC', ranking: 11, category: ['top30', 'research'] },
  { name: 'Vanderbilt University', type: 'private', state: 'TN', ranking: 14, category: ['top30', 'research'] },
  { name: 'Rice University', type: 'private', state: 'TX', ranking: 15, category: ['top30', 'research'] },

  // UC System
  { name: 'UC Berkeley', type: 'public', state: 'CA', ranking: 20, category: ['uc', 'top30', 'research'] },
  { name: 'UCLA', type: 'public', state: 'CA', ranking: 22, category: ['uc', 'top30', 'research'] },
  { name: 'UC San Diego', type: 'public', state: 'CA', ranking: 34, category: ['uc', 'top50', 'research'] },
  { name: 'UC Davis', type: 'public', state: 'CA', ranking: 38, category: ['uc', 'top50', 'research'] },
  { name: 'UC Irvine', type: 'public', state: 'CA', ranking: 36, category: ['uc', 'top50', 'research'] },
  { name: 'UC Santa Barbara', type: 'public', state: 'CA', ranking: 32, category: ['uc', 'top50', 'research'] },
  { name: 'UC Santa Cruz', type: 'public', state: 'CA', ranking: 83, category: ['uc', 'research'] },
  { name: 'UC Riverside', type: 'public', state: 'CA', ranking: 89, category: ['uc', 'research'] },
  { name: 'UC Merced', type: 'public', state: 'CA', ranking: 97, category: ['uc', 'research'] },

  // Other Top Public Universities
  { name: 'University of Michigan', type: 'public', state: 'MI', ranking: 21, category: ['top30', 'research'] },
  { name: 'University of Virginia', type: 'public', state: 'VA', ranking: 25, category: ['top30', 'research'] },
  { name: 'Georgia Institute of Technology', type: 'public', state: 'GA', ranking: 29, category: ['top30', 'technical'] },
  { name: 'University of North Carolina', type: 'public', state: 'NC', ranking: 28, category: ['top30', 'research'] },
  { name: 'University of Illinois', type: 'public', state: 'IL', ranking: 41, category: ['top50', 'research'] },
  { name: 'University of Wisconsin', type: 'public', state: 'WI', ranking: 42, category: ['top50', 'research'] },

  // Liberal Arts Colleges
  { name: 'Williams College', type: 'private', state: 'MA', ranking: 1, category: ['liberal-arts'] },
  { name: 'Amherst College', type: 'private', state: 'MA', ranking: 2, category: ['liberal-arts'] },
  { name: 'Swarthmore College', type: 'private', state: 'PA', ranking: 3, category: ['liberal-arts'] },
  { name: 'Pomona College', type: 'private', state: 'CA', ranking: 4, category: ['liberal-arts'] },
  { name: 'Wellesley College', type: 'private', state: 'MA', ranking: 5, category: ['liberal-arts'] },

  // Technical Institutes
  { name: 'Rose-Hulman Institute of Technology', type: 'private', state: 'IN', category: ['technical'] },
  { name: 'Worcester Polytechnic Institute', type: 'private', state: 'MA', category: ['technical'] },
  { name: 'Rochester Institute of Technology', type: 'private', state: 'NY', category: ['technical'] },
  { name: 'Stevens Institute of Technology', type: 'private', state: 'NJ', category: ['technical'] },
];
