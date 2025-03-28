import React from 'react';
import { MiddleSchoolTarget, AcademicPath } from '../../../types/onboarding';

interface MiddleSchoolStepProps {
  formData: MiddleSchoolTarget;
  updateFormData: (data: MiddleSchoolTarget) => void;
}

const ACADEMIC_PATHS: AcademicPath[] = ['HighSchool', 'College'];
const STANDARDIZED_TESTS = ['SSAT', 'ISEE', 'TOEFL'];
const STUDY_METHODS = [
  'One-on-One Tutoring',
  'Group Classes',
  'Self-Study with Materials',
  'Online Courses',
  'Practice Tests',
];

export function MiddleSchoolStep({ formData, updateFormData }: MiddleSchoolStepProps) {
  const handleUpdate = (field: keyof MiddleSchoolTarget, value: any) => {
    updateFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleStudyMethodSelection = (method: string) => {
    const currentMethods = formData.preferredStudyMethod || [];
    const updatedMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    handleUpdate('preferredStudyMethod', updatedMethods);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Academic Goals</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your next academic goals and preparation plans
        </p>
      </div>

      {/* Academic Goal Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What is your next academic goal?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACADEMIC_PATHS.map((path) => (
            <button
              key={path}
              type="button"
              onClick={() => handleUpdate('academicGoal', path)}
              className={`p-4 rounded-lg border-2 text-left ${
                formData.academicGoal === path
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">
                {path === 'HighSchool' ? '🏫 Get into a top private high school' : '🎓 Start preparing early for college'}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {path === 'HighSchool'
                  ? 'Focus on private high school admissions and preparation'
                  : 'Begin early preparation for future college admissions'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Standardized Tests */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Which standardized tests are you planning to take?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STANDARDIZED_TESTS.map((test) => (
            <div
              key={test}
              className={`p-4 border rounded-lg cursor-pointer ${
                (formData.standardizedTests || []).includes(test)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                const currentTests = formData.standardizedTests || [];
                handleUpdate(
                  'standardizedTests',
                  currentTests.includes(test)
                    ? currentTests.filter(t => t !== test)
                    : [...currentTests, test]
                );
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{test}</span>
                <input
                  type="checkbox"
                  checked={(formData.standardizedTests || []).includes(test)}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Methods */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          How do you prefer to prepare for tests?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDY_METHODS.map((method) => (
            <div
              key={method}
              className={`p-4 border rounded-lg cursor-pointer ${
                (formData.preferredStudyMethod || []).includes(method)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStudyMethodSelection(method)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{method}</span>
                <input
                  type="checkbox"
                  checked={(formData.preferredStudyMethod || []).includes(method)}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Status */}
      {formData.academicGoal === 'HighSchool' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Application Status</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasStartedEssays"
                checked={formData.applicationStatus?.hasStartedEssays || false}
                onChange={(e) =>
                  handleUpdate('applicationStatus', {
                    ...formData.applicationStatus,
                    hasStartedEssays: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasStartedEssays" className="ml-2 text-sm text-gray-700">
                I have started working on my application essays
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="needsInterviewCoaching"
                checked={formData.applicationStatus?.needsInterviewCoaching || false}
                onChange={(e) =>
                  handleUpdate('applicationStatus', {
                    ...formData.applicationStatus,
                    needsInterviewCoaching: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="needsInterviewCoaching" className="ml-2 text-sm text-gray-700">
                I would like help preparing for interviews
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
