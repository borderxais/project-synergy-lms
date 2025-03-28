import React from 'react';
import { HighSchoolProfile, TestPrepMethod, StudyStyle, TestType, TestScore } from '../../../types/onboarding';

interface HighSchoolStepProps {
  formData: HighSchoolProfile;
  updateFormData: (data: HighSchoolProfile) => void;
}

const TEST_PREP_METHODS: TestPrepMethod[] = ['SelfStudy', 'PrivateTutor', 'PrepCourse', 'OnlineProgram'];
const STUDY_STYLES: StudyStyle[] = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
const PLANNED_TESTS: TestType[] = ['SAT', 'ACT', 'SAT Subject Tests', 'AP Tests'];

const formatMethodName = (method: string) => {
  return method.replace(/([A-Z])/g, ' $1').trim();
};

export function HighSchoolStep({ formData, updateFormData }: HighSchoolStepProps) {
  const handleUpdate = (field: keyof HighSchoolProfile, value: any) => {
    updateFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleTestToggle = (test: TestType) => {
    const currentTests = formData.plannedTests || [];
    const updatedTests = currentTests.includes(test)
      ? currentTests.filter(t => t !== test)
      : [...currentTests, test];
    handleUpdate('plannedTests', updatedTests);
  };

  const handleStyleToggle = (style: StudyStyle) => {
    const currentStyles = formData.studyStylePreference || [];
    const updatedStyles = currentStyles.includes(style)
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style];
    handleUpdate('studyStylePreference', updatedStyles);
  };

  const handleTestScoreUpdate = (testType: TestType, score: number) => {
    const currentScores = formData.testScores || [];
    const existingScoreIndex = currentScores.findIndex(s => s.testType === testType);
    
    if (existingScoreIndex >= 0) {
      const updatedScores = [...currentScores];
      updatedScores[existingScoreIndex] = {
        ...updatedScores[existingScoreIndex],
        score,
      };
      handleUpdate('testScores', updatedScores);
    } else {
      handleUpdate('testScores', [...currentScores, { testType, score }]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">High School Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your academic plans and preferences
        </p>
      </div>

      {/* GPA Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
            Unweighted GPA
          </label>
          <input
            type="number"
            id="gpa"
            step="0.01"
            min="0"
            max="4.0"
            value={formData.gpa || ''}
            onChange={(e) => handleUpdate('gpa', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your unweighted GPA (e.g., 3.85)"
          />
        </div>

        <div>
          <label htmlFor="weightedGpa" className="block text-sm font-medium text-gray-700">
            Weighted GPA (if applicable)
          </label>
          <input
            type="number"
            id="weightedGpa"
            step="0.01"
            min="0"
            max="5.0"
            value={formData.weightedGpa || ''}
            onChange={(e) => handleUpdate('weightedGpa', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your weighted GPA (e.g., 4.2)"
          />
        </div>
      </div>

      {/* Planned Tests */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Which tests are you planning to take?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {PLANNED_TESTS.map(test => {
            const isSelected = (formData.plannedTests || []).includes(test);
            const hasScore = formData.testScores?.some(s => s.testType === test);

            return (
              <div key={test} className="space-y-2">
                <div
                  className={`p-4 border rounded-lg cursor-pointer ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTestToggle(test)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTestToggle(test)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{test}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="pl-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {hasScore ? 'Your Score' : 'Enter your score if taken'}
                    </label>
                    <input
                      type="number"
                      value={formData.testScores?.find(s => s.testType === test)?.score || ''}
                      onChange={(e) => handleTestScoreUpdate(test, parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter score"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferred Test Prep Method */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          How do you prefer to prepare for tests?
        </label>
        <select
          value={formData.preferredTestPrepMethod || ''}
          onChange={(e) => handleUpdate('preferredTestPrepMethod', e.target.value as TestPrepMethod)}
          className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a method</option>
          {TEST_PREP_METHODS.map((method) => (
            <option key={method} value={method}>
              {formatMethodName(method)}
            </option>
          ))}
        </select>
      </div>

      {/* Study Style Preferences */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          What are your preferred study styles?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {STUDY_STYLES.map(style => {
            const isSelected = (formData.studyStylePreference || []).includes(style);
            return (
              <div
                key={style}
                className={`p-4 border rounded-lg cursor-pointer ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStyleToggle(style)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleStyleToggle(style)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">{style}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
