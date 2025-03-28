import React, { useState } from 'react';

const schoolCategories = [
  { id: 'top10', name: 'Top 10 Universities', description: 'Highest ranked universities in the US' },
  { id: 'top30', name: 'Top 30 Universities', description: 'Highly ranked universities in the US' },
  { id: 'ivy', name: 'Ivy League', description: 'The eight Ivy League institutions' },
  { id: 'public', name: 'Public Universities', description: 'Major public universities' },
  { id: 'uc', name: 'UC System', description: 'University of California system' },
  { id: 'liberal', name: 'Liberal Arts Colleges', description: 'Top liberal arts colleges' },
];

interface School {
  name: string;
  type: 'reach' | 'target' | 'safety';
}

interface SchoolCategory {
  id: string;
  selected: boolean;
}

interface SchoolSelectionStepProps {
  formData: any;
  onNext: () => void;
  onBack: () => void;
  updateFormData: (data: any) => void;
}

export function SchoolSelectionStep({ formData, onNext, onBack, updateFormData }: SchoolSelectionStepProps) {
  const [activeTab, setActiveTab] = useState<'schools' | 'categories'>('schools');
  const [selectedSchools, setSelectedSchools] = useState<School[]>(formData.collegePreferences?.targetSchools || []);
  const [selectedCategories, setSelectedCategories] = useState<SchoolCategory[]>(
    formData.collegePreferences?.schoolCategories || []
  );
  const [newSchool, setNewSchool] = useState('');
  const [newSchoolType, setNewSchoolType] = useState<'reach' | 'target' | 'safety'>('target');

  const handleAddSchool = () => {
    if (newSchool.trim()) {
      setSelectedSchools([...selectedSchools, { name: newSchool.trim(), type: newSchoolType }]);
      setNewSchool('');
    }
  };

  const handleRemoveSchool = (schoolName: string) => {
    setSelectedSchools(selectedSchools.filter(school => school.name !== schoolName));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const existing = prev.find(cat => cat.id === categoryId);
      if (existing) {
        return prev.filter(cat => cat.id !== categoryId);
      }
      return [...prev, { id: categoryId, selected: true }];
    });
  };

  const handleNext = () => {
    updateFormData({
      ...formData,
      collegePreferences: {
        ...formData.collegePreferences,
        targetSchools: selectedSchools,
        schoolCategories: selectedCategories,
      },
    });
    onNext();
  };

  const isValid = selectedSchools.length > 0 || selectedCategories.length > 0;

  const getSchoolTypeColor = (type: 'reach' | 'target' | 'safety') => {
    switch (type) {
      case 'reach':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'target':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'safety':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Target Schools Selection</h2>
        <p className="text-gray-600">Choose your target schools or select school categories</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('schools')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'schools'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Specific Schools
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            School Categories
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'schools' ? (
          <div className="space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter school name"
                className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={newSchool}
                onChange={(e) => setNewSchool(e.target.value)}
              />
              <select
                className="rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={newSchoolType}
                onChange={(e) => setNewSchoolType(e.target.value as 'reach' | 'target' | 'safety')}
              >
                <option value="reach">Reach</option>
                <option value="target">Target</option>
                <option value="safety">Safety</option>
              </select>
              <button
                onClick={handleAddSchool}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedSchools.map((school) => (
                <div
                  key={school.name}
                  className={`flex justify-between items-center px-4 py-2 rounded-full border ${getSchoolTypeColor(
                    school.type
                  )}`}
                >
                  <span className="truncate">{school.name}</span>
                  <button
                    onClick={() => handleRemoveSchool(school.name)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {schoolCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`cursor-pointer p-4 rounded-lg border ${
                  selectedCategories.some((cat) => cat.id === category.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.some((cat) => cat.id === category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
