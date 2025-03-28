import React from 'react';
import { StudentFormState } from '../../types/student';

interface SchoolPreferencesProps {
  formData: StudentFormState;
  onUpdate: (field: keyof StudentFormState, value: any) => void;
}

export function SchoolPreferences({ formData, onUpdate }: SchoolPreferencesProps) {
  const handleSchoolAdd = (school: string) => {
    if (school && !formData.targetSchools.includes(school)) {
      onUpdate('targetSchools', [...formData.targetSchools, school]);
    }
  };

  const handleSchoolRemove = (school: string) => {
    onUpdate(
      'targetSchools',
      formData.targetSchools.filter((s) => s !== school)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">School Preferences</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tell us about the schools you're interested in applying to.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="newSchool" className="block text-sm font-medium text-gray-700">
            Add Target Schools
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="newSchool"
              placeholder="Enter school name"
              className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSchoolAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('newSchool') as HTMLInputElement;
                handleSchoolAdd(input.value);
                input.value = '';
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {formData.targetSchools.map((school) => (
            <div
              key={school}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md"
            >
              <span className="text-sm text-gray-900">{school}</span>
              <button
                type="button"
                onClick={() => handleSchoolRemove(school)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {formData.errors.targetSchools && (
          <p className="mt-1 text-sm text-red-600">{formData.errors.targetSchools}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Test Preference</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="isee"
              name="testType"
              value="ISEE"
              checked={formData.testType === 'ISEE'}
              onChange={(e) => onUpdate('testType', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="isee" className="ml-2 text-sm text-gray-700">
              ISEE (Independent School Entrance Examination)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="ssat"
              name="testType"
              value="SSAT"
              checked={formData.testType === 'SSAT'}
              onChange={(e) => onUpdate('testType', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="ssat" className="ml-2 text-sm text-gray-700">
              SSAT (Secondary School Admission Test)
            </label>
          </div>
        </div>
        {formData.errors.testType && (
          <p className="mt-1 text-sm text-red-600">{formData.errors.testType}</p>
        )}
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="englishProficiency"
            checked={formData.needsEnglishProficiency}
            onChange={(e) => onUpdate('needsEnglishProficiency', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="englishProficiency" className="ml-2 text-sm text-gray-700">
            English proficiency test required (TOEFL/IELTS)
          </label>
        </div>
      </div>
    </div>
  );
}