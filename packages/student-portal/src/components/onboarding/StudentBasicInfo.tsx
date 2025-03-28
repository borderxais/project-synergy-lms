import React from 'react';
import { StudentFormState } from '../../types/student';

interface StudentBasicInfoProps {
  formData: StudentFormState;
  onUpdate: (field: keyof StudentFormState, value: string | number) => void;
}

export function StudentBasicInfo({ formData, onUpdate }: StudentBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Let's start with some basic information about the student.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {formData.errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formData.errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {formData.errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formData.errors.lastName}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {formData.errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{formData.errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Current Grade
          </label>
          <select
            id="grade"
            value={formData.grade}
            onChange={(e) => onUpdate('grade', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select grade</option>
            {[4, 5, 6, 7, 8].map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          {formData.errors.grade && (
            <p className="mt-1 text-sm text-red-600">{formData.errors.grade}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="currentSchool" className="block text-sm font-medium text-gray-700">
            Current School
          </label>
          <input
            type="text"
            id="currentSchool"
            value={formData.currentSchool}
            onChange={(e) => onUpdate('currentSchool', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {formData.errors.currentSchool && (
            <p className="mt-1 text-sm text-red-600">{formData.errors.currentSchool}</p>
          )}
        </div>
      </div>
    </div>
  );
}