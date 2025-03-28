import React from 'react';
import { GeneralStudentInfo, SchoolType, Gender, OnboardingFormData } from '../../../types/onboarding';

interface GeneralInfoStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const SCHOOL_TYPES: SchoolType[] = ['Public', 'Private', 'Homeschool', 'International', 'Other'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other', 'PreferNotToSay'];
const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function GeneralInfoStep({ formData, updateFormData }: GeneralInfoStepProps) {
  const handleUpdate = (field: keyof GeneralStudentInfo, value: any) => {
    updateFormData({
      generalInfo: {
        ...formData.generalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide the student's basic information to help us personalize their experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.generalInfo?.firstName || ''}
            onChange={(e) => handleUpdate('firstName', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.firstName ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
          {formData.errors?.firstName && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.generalInfo?.lastName || ''}
            onChange={(e) => handleUpdate('lastName', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.lastName ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
          {formData.errors?.lastName && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.lastName}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.generalInfo?.gender || ''}
            onChange={(e) => handleUpdate('gender', e.target.value as Gender)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.gender ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">Select Gender</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {formData.errors?.gender && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.gender}</p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <select
            id="grade"
            value={formData.generalInfo?.grade || ''}
            onChange={(e) => handleUpdate('grade', parseInt(e.target.value))}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.grade ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">Select Grade</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          {formData.errors?.grade && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.grade}</p>
          )}
        </div>

        {/* Current School */}
        <div>
          <label htmlFor="currentSchool" className="block text-sm font-medium text-gray-700">
            Current School
          </label>
          <input
            type="text"
            id="currentSchool"
            value={formData.generalInfo?.currentSchool || ''}
            onChange={(e) => handleUpdate('currentSchool', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.currentSchool ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
          {formData.errors?.currentSchool && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.currentSchool}</p>
          )}
        </div>

        {/* School Type */}
        <div>
          <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700">
            School Type
          </label>
          <select
            id="schoolType"
            value={formData.generalInfo?.schoolType || ''}
            onChange={(e) => handleUpdate('schoolType', e.target.value as SchoolType)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formData.errors?.schoolType ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">Select School Type</option>
            {SCHOOL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {formData.errors?.schoolType && (
            <p className="mt-2 text-sm text-red-600">{formData.errors.schoolType}</p>
          )}
        </div>
      </div>
    </div>
  );
}
