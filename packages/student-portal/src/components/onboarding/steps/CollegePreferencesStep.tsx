import React, { useState, useRef, useEffect } from 'react';
import { CollegePreferences } from '../../../types/onboarding';
import { COLLEGES, College } from '../../../data/colleges';

interface CollegeRecommendation {
  College_Name: string;
  Reason: string;
}

interface CollegePreferencesStepProps {
  formData: CollegePreferences;
  updateFormData: (data: CollegePreferences) => void;
  errors?: Record<string, string>;
  recommendations: CollegeRecommendation[];
}

const COLLEGE_CATEGORIES = [
  { id: 'public', label: 'Public University', description: 'State-funded institutions like UC Berkeley' },
  { id: 'private', label: 'Private University', description: 'Independent institutions like Stanford' },
  { id: 'research', label: 'Research University', description: 'Major research institutions like MIT' },
  { id: 'technical', label: 'Technical Institute', description: 'STEM-focused schools like Caltech' },
  { id: 'top10', label: 'Top 10', description: 'Highest ranked national universities' },
  { id: 'top30', label: 'Top 30', description: 'Leading national universities' },
  { id: 'top50', label: 'Top 50', description: 'Well-ranked national universities' },
  { id: 'ivy', label: 'Ivy League', description: 'The eight Ivy League institutions' },
  { id: 'uc', label: 'UC System', description: 'University of California campuses' },
];

export function CollegePreferencesStep({ formData, updateFormData, errors = {}, recommendations }: CollegePreferencesStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sort colleges alphabetically by name
  const sortedColleges = [...COLLEGES].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = (field: keyof CollegePreferences, value: any) => {
    updateFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSchoolSelect = (school: College | { name: string }) => {
    const currentSchools = formData.targetSchools || [];
    if (!currentSchools.includes(school.name)) {
      handleUpdate('targetSchools', [...currentSchools, school.name]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSchoolRemove = (schoolName: string) => {
    const currentSchools = formData.targetSchools || [];
    handleUpdate('targetSchools', currentSchools.filter(s => s !== schoolName));
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const filteredColleges = searchTerm
    ? sortedColleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedColleges;

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = formData.schoolCategories || [];
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    handleUpdate('schoolCategories', updatedCategories);
  };

  const handleEarlyDecision = (value: string) => {
    handleUpdate('earlyDecision', value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">College Preferences</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your target schools and preferences
        </p>
      </div>


      {/* Recommendations Section */}
      {Array.isArray(recommendations) && recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recommended Schools</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on your current GPA, SAT/ACT scores (if provided), and stated interests, our AI has recommended the following colleges for you.
            </p>
          </div>
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {recommendations.map((school: CollegeRecommendation) => (
                <div key={school.College_Name} className="p-4 border rounded-lg bg-blue-50 border-blue-200 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-blue-900">{school.College_Name}</h4>
                  {school.Reason && (
                    <p className="mt-1 text-sm text-blue-700">{school.Reason}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSchoolSelect({ name: school.College_Name })}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Add to list
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Target Schools Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Which schools are you interested in applying to?
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto">
              {filteredColleges.map(college => (
                <div
                  key={college.name}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleSchoolSelect(college)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{college.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({college.state})</span>
                    </div>
                    {college.ranking && (
                      <span className="text-sm text-gray-500">#{college.ranking}</span>
                    )}
                  </div>
                </div>
              ))}
              {filteredColleges.length === 0 && (
                <div className="px-4 py-2 text-gray-500">No matches found</div>
              )}
            </div>
          )}
        </div>

        {/* Selected Schools */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(formData.targetSchools || []).map(schoolName => {
            const school = COLLEGES.find(c => c.name === schoolName);
            return (
              <span
                key={schoolName}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                <span className="flex items-center">
                  {schoolName}
                  {school?.ranking && (
                    <span className="ml-1 text-xs text-blue-600">#{school.ranking}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleSchoolRemove(schoolName)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* College Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            What types of colleges interest you?
          </label>
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {showCategories ? 'Hide categories' : 'Show categories'}
          </button>
        </div>

        {showCategories && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COLLEGE_CATEGORIES.map(category => {
              const isSelected = (formData.schoolCategories || []).includes(category.id);
              return (
                <div
                  key={category.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <h3 className="font-medium text-gray-900">{category.label}</h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Early Decision/Action */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Are you considering Early Decision or Early Action?
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['none', 'EA', 'ED'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleEarlyDecision(option)}
              className={`px-4 py-2 border rounded-md ${
                formData.earlyDecision === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option === 'none' ? 'No' : option}
            </button>
          ))}
        </div>
      </div>

      {errors.submit && (
        <p className="mt-2 text-sm text-red-600">{errors.submit}</p>
      )}
    </div>
  );
}
