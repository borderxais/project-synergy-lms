export interface Student {
  // General Info (from studentProfile.generalInfo)
  firstName: string;
  lastName: string;
  grade: number;
  currentSchool: string;
  gender?: string;
  schoolType?: string;

  // High School Profile (from studentProfile.highSchoolProfile)
  stats: {
    gpa: number;
    weightedGpa?: number;
    psat?: {
      score: string;
      percentile: string;
    };
  };

  // Current Classes (from studentProfile.highSchoolProfile.currentClasses)
  currentCourses: Array<{
    name: string;
    grade?: string;
    achievements?: string[];
  }>;

  // Interests and Activities (from studentProfile.interests and extracurriculars)
  interests: string[];
  extracurriculars?: Array<{
    name: string;
    role?: string;
    description?: string;
    achievements?: string[];
  }>;

  // College Preferences (from studentProfile.collegePreferences)
  targetSchools: string[];
  earlyDecision?: string;
  schoolCategories?: string[];

  // Test Information (from studentProfile.highSchoolProfile)
  plannedTests?: string[];
  preferredTestPrepMethod?: string;
  studyStylePreference?: string[];
  testType?: 'ISEE' | 'SSAT' | 'SAT' | 'ACT';
  needsEnglishProficiency?: boolean;

  // Application Information
  applicationDeadline?: string;

  // Dream Schools (derived from targetSchools with additional info)
  dreamSchools: Array<{
    name: string;
    overallMatch: number;
    stats: {
      academic: number;
      extracurricular: number;
      specialTalents: number;
    };
  }>;

  // Achievements (for Achievements.tsx)
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: 'research' | 'publication' | 'academic' | 'course' | 'award' | 'recognition';
    tags?: string[];
    grade?: string;
    level?: 'Local' | 'Regional' | 'National' | 'International';
    details?: string[];
  }>;

  // Roadmap (derived from tasks)
  roadmap: {
    academicGoals: Array<{
      title: string;
      target: string;
      deadline: string;
      tasks: Array<{
        text: string;
        completed: boolean;
      }>;
    }>;
    extracurricularGoals: Array<{
      title: string;
      target: string;
      deadline: string;
      tasks: Array<{
        text: string;
        completed: boolean;
      }>;
    }>;
    apCourses?: Array<{
      name: string;
      plannedDate?: string;
      status?: 'planned' | 'in_progress' | 'completed';
      grade?: string;
    }>;
  };
}

export interface StudentFormState extends Student {
  errors: Partial<Record<keyof Student, string>>;
}