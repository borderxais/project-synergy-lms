export type SchoolType = 'Public' | 'Private' | 'Homeschool' | 'International' | 'Other';
export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay';
export type TestPrepMethod = 'SelfStudy' | 'PrivateTutor' | 'PrepCourse' | 'OnlineProgram';
export type StudyStyle = 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';
export type AcademicPath = 'HighSchool' | 'College';
export type TestType = 'SAT' | 'ACT' | 'SAT Subject Tests' | 'AP Tests';
export type MiddleSchoolTest = 'SSAT' | 'ISEE' | 'TOEFL';

export interface TestScore {
  testType: TestType | MiddleSchoolTest;
  testDate?: string;
  score?: number;
  subsectionScores?: {
    [key: string]: number;
  };
}

export interface GeneralStudentInfo {
  firstName: string;
  lastName: string;
  gender: Gender;
  grade: number;
  currentSchool: string;
  schoolType: SchoolType;
}

export interface HighSchoolProfile {
  gpa?: number;
  plannedTests?: string[];
  studyStylePreference?: string[];
  currentClasses?: string[];
  extracurriculars?: string[];
}

export interface TargetSchool {
  name: string;
  type: 'reach' | 'target' | 'safety';
}

export interface SchoolCategory {
  id: string;
  selected: boolean;
}

export interface MiddleSchoolTarget {
  targetHighSchools?: string[];
  studyStylePreference?: string[];
  currentClasses?: string[];
  extracurriculars?: string[];
}

export interface CollegePreferences {
  targetSchools?: string[];
  schoolCategories?: string[];
  earlyDecision?: 'EA' | 'ED' | 'none';
}

export interface ExtracurricularProfile {
  activities?: {
    name: string;
    type: string;
    role?: string;
    yearsInvolved: number;
  }[];
  leadershipPositions?: string[];
  awards?: string[];
  interestedActivities?: string[];
}

export interface ApplicationStatus {
  hasStartedEssays: boolean;
  needsEssayAssistance: boolean;
  hasRecommendationLetters: boolean;
  hasAttendedInterviews: boolean;
}

export interface EarlyCollegePrep {
  targetCollegeType?: string[];
  academicStrengths?: string[];
  academicWeaknesses?: string[];
  earlyTestPlanning?: {
    planToTakeSAT: boolean;
    planToTakeACT: boolean;
    preferredTimeframe?: string;
  };
  interestedCompetitions?: string[];
  interestedPrograms?: string[];
  needsEnglishSupport: boolean;
  mentorshipPreferences?: string[];
}

export interface OnboardingFormData {
  generalInfo: GeneralStudentInfo;
  highSchoolProfile?: HighSchoolProfile;
  middleSchoolTarget?: MiddleSchoolTarget;
  interests?: string[];
  collegePreferences?: CollegePreferences;
  errors?: Record<string, string>;
}
