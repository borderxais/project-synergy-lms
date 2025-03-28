import React from 'react';

interface InterestsStepProps {
  interests: string[];
  onUpdate: (interests: string[]) => void;
  errors: Record<string, string>;
}

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

export function InterestsStep({ interests = [], onUpdate, errors = {} }: InterestsStepProps) {
  const toggleInterest = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    onUpdate(newInterests);
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
      {errors.interests && (
        <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
      )}
    </div>
  );
}
