import React from 'react';
import { Select } from '../../ui/select';

interface InterestsStepProps {
  interests: string[];
  academicInterests: string[];
  onUpdate: (interests: string[], academicInterests: string[]) => void;
  errors: Record<string, string>;
}

const ACADEMIC_INTERESTS = [
  // Business & Economics
  'Business Administration',
  'Economics',
  'Finance',
  'Marketing',
  'Entrepreneurship',
  'International Business',
  
  // STEM Fields
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Mathematics',
  'Statistics',
  'Physics',
  'Chemistry',
  
  // Life & Health Sciences
  'Biology',
  'Biochemistry',
  'Neuroscience',
  'Pre-Medicine',
  'Nursing',
  'Public Health',
  'Psychology',
  'Environmental Science',
  
  // Arts & Humanities
  'English Literature',
  'History',
  'Philosophy',
  'Languages & Linguistics',
  'Art History',
  'Creative Writing',
  'Music',
  'Theater Arts',
  
  // Social Sciences
  'Political Science',
  'International Relations',
  'Sociology',
  'Anthropology',
  'Communications',
  'Education',
  'Law & Legal Studies',
  
  // Interdisciplinary
  'Environmental Studies',
  'Urban Planning',
  'Media Studies',
  'Gender Studies',
  'Digital Arts',
  
  // Other
  'Architecture',
  'Journalism',
  'Film & Media Production',
  'Undecided'
];

const INTEREST_OPTIONS = [
  'Academic Clubs',
  'Arts & Music',
  'Athletics',
  'Community Service',
  'Debate & Public Speaking',
  'Leadership',
  'STEM',
  'Student Government',
  'Theater & Drama',
  'Writing & Literature',
];

export function InterestsStep({ interests = [], academicInterests = [], onUpdate, errors = {} }: InterestsStepProps) {
  const [selectedAcademicInterests, setSelectedAcademicInterests] = React.useState<string[]>(academicInterests);
  
  const toggleInterest = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    onUpdate(newInterests, selectedAcademicInterests);
  };

  const handleAcademicInterestChange = (selectedValues: string[]) => {
    setSelectedAcademicInterests(selectedValues);
    onUpdate(interests, selectedValues);
  };

  const isAcademicInterestSelected = (interest: string) => {
    return academicInterests.includes(interest);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Interests</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select activities and subjects that interest you. This helps us customize your preparation
          journey.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Interests</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select academic fields and subjects you're interested in studying.
        </p>
        <Select
          options={ACADEMIC_INTERESTS.map((interest) => ({
            value: interest,
            label: interest,
          }))}
          value={selectedAcademicInterests}
          onChange={handleAcademicInterestChange}
          className="mt-1"
          allowCustom={true}
        />
        {errors.academicInterest && (
          <p className="mt-1 text-sm text-red-600">{errors.academicInterest}</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">General Interests</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select your general areas of interest and extracurricular activities.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`p-4 text-left rounded-lg border-2 transition-colors
                ${
                  interests.includes(interest)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className="text-sm font-medium text-gray-900">{interest}</span>
            </button>
          ))}
        </div>
      </div>
      {errors.interests && (
        <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
      )}
    </div>
  );
}
