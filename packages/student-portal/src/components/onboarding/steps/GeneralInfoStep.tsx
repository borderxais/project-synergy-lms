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
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleUpdate = (field: keyof GeneralStudentInfo, value: any) => {
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    updateFormData({
      generalInfo: {
        ...formData.generalInfo,
        [field]: value,
      },
    });
  };

  const validateField = (field: keyof GeneralStudentInfo, value: any) => {
    switch (field) {
      case 'firstName':
        if (!value?.trim()) {
          setErrors(prev => ({ ...prev, [field]: 'Please enter your first name' }));
          return false;
        }
        return true;
      case 'lastName':
        if (!value?.trim()) {
          setErrors(prev => ({ ...prev, [field]: 'Please enter your last name' }));
          return false;
        }
        return true;
      case 'grade':
        if (!value) {
          setErrors(prev => ({ ...prev, [field]: 'Please select a grade' }));
          return false;
        }
        return true;
      case 'currentSchool':
        if (formData.generalInfo?.schoolType && formData.generalInfo.schoolType !== 'Homeschool' && !value?.trim()) {
          setErrors(prev => ({ ...prev, [field]: 'School name is required' }));
          return false;
        }
        return true;
      case 'schoolType':
        if (!value) {
          setErrors(prev => ({ ...prev, [field]: 'Please select a school type' }));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleBlur = (field: keyof GeneralStudentInfo) => {
    const value = formData.generalInfo?.[field];
    validateField(field, value);
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
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.generalInfo?.firstName || ''}
            onChange={(e) => handleUpdate('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            required
          />
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.generalInfo?.lastName || ''}
            onChange={(e) => handleUpdate('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            required
          />
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
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
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Gender</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade *
          </label>
          <select
            id="grade"
            value={formData.generalInfo?.grade || ''}
            onChange={(e) => handleUpdate('grade', parseInt(e.target.value))}
            onBlur={() => handleBlur('grade')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.grade ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            required
          >
            <option value="">Select Grade</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          {errors.grade && (
            <p className="mt-2 text-sm text-red-600">{errors.grade}</p>
          )}
        </div>

        {/* Current School - conditionally required */}
        <div>
          <label htmlFor="currentSchool" className="block text-sm font-medium text-gray-700">
            Current School {formData.generalInfo?.schoolType && formData.generalInfo.schoolType !== 'Homeschool' ? '*' : ''}
          </label>
          <input
            type="text"
            id="currentSchool"
            value={formData.generalInfo?.currentSchool || ''}
            onChange={(e) => handleUpdate('currentSchool', e.target.value)}
            onBlur={() => handleBlur('currentSchool')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.currentSchool ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            required
          />
          {errors.currentSchool && (
            <p className="mt-2 text-sm text-red-600">{errors.currentSchool}</p>
          )}
        </div>

        {/* School Type */}
        <div>
          <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700">
            School Type *
          </label>
          <select
            id="schoolType"
            value={formData.generalInfo?.schoolType || ''}
            onChange={(e) => {
              handleUpdate('schoolType', e.target.value as SchoolType);
              // Clear current school error if switching to homeschool
              if (e.target.value === 'Homeschool' && errors.currentSchool) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.currentSchool;
                  return newErrors;
                });
              }
            }}
            onBlur={() => handleBlur('schoolType')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.schoolType ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">Select School Type</option>
            {SCHOOL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.schoolType && (
            <p className="mt-2 text-sm text-red-600">{errors.schoolType}</p>
          )}
        </div>
      </div>

      {/* Required fields note */}
      <div className="text-sm text-gray-500 mt-4">
        <span className="text-red-500">*</span> indicates required fields
      </div>
    </div>
  );
}