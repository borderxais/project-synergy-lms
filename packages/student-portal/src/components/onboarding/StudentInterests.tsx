import React from 'react';
import { StudentFormState } from '../../types/student';
import { InterestsStep } from './steps/InterestsStep';

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

interface StudentInterestsProps {
  formData: StudentFormState;
  onUpdate: (field: keyof StudentFormState, value: string[]) => void;
}

export function StudentInterests({ formData, onUpdate }: StudentInterestsProps) {
  const handleAcademicInterestsChange = (academicInterests: string[]) => {
    onUpdate('academicInterests', academicInterests);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    onUpdate('interests', newInterests);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Interests</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select activities and subjects that interest you. This helps us customize your preparation
          journey.
        </p>
      </div>

      <InterestsStep
        interests={formData.interests}
        academicInterests={formData.academicInterests || []}
        onUpdate={(interests: string[], academicInterests: string[]) => {
          onUpdate('interests', interests);
          onUpdate('academicInterests', academicInterests);
        }}
        errors={formData.errors}
      />

      <div className="grid grid-cols-2 gap-4">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`p-4 text-left rounded-lg border-2 transition-colors
              ${
                formData.interests.includes(interest)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <span className="text-sm font-medium text-gray-900">{interest}</span>
          </button>
        ))}
      </div>
      {formData.errors.interests && (
        <p className="mt-1 text-sm text-red-600">{formData.errors.interests}</p>
      )}
    </div>
  );
}