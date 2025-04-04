import React from 'react';
import { Student } from '../../types/student';
import { Course } from '../../types/dashboard';
import CurrentCourses from '../dashboard/home/CurrentCourses';

interface StudentOverviewProps {
  student?: Student | null;
  courses?: Course[];
  onUpdate?: (updates: Partial<Student>) => void;
}

const StudentOverview: React.FC<StudentOverviewProps> = ({ student, courses = [], onUpdate }) => {
  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading student data...</p>
      </div>
    );
  }

  // Calculate match percentages for schools
  const calculateMatchPercentages = (school: any) => {
    // This is a placeholder calculation - in reality, this would be more sophisticated
    // Using the same logic as in DreamSchools.tsx for consistency
    const academicMatch = student.stats.gpa >= 3.8 ? 85 : 70;
    const extracurricularMatch = student.extracurriculars?.length ? 75 : 60;
    const specialTalentsMatch = student.achievements?.length ? 80 : 65;
    
    return {
      academic: academicMatch,
      extracurricular: extracurricularMatch,
      specialTalents: specialTalentsMatch,
      overall: Math.round((academicMatch + extracurricularMatch + specialTalentsMatch) / 3)
    };
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
          <span>Basic Information</span>
          <span className="ml-2 text-gray-500 text-base">基本信息</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {student.firstName?.[0]?.toUpperCase() || ''}
                  {student.lastName?.[0]?.toUpperCase() || ''}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-blue-600 font-medium">{student.grade}th Grade</p>
              </div>
            </div>
            <div className="pl-20">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {student.currentSchool}
                </div>
                {student.schoolType && (
                  <div className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {student.schoolType} School
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Interests & Study Style */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Interests 兴趣爱好</h4>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Study Style 学习风格</h4>
              <div className="flex flex-wrap gap-2">
                {student.studyStylePreference?.map((style, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
          <span>Academic Stats</span>
          <span className="ml-2 text-gray-500 text-base">学术状态</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - GPA */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600">GPA</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Regular</div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-blue-600">{student.stats.gpa}</span>
                    <span className="ml-1 text-sm text-gray-500">/4.0</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Weighted</div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-blue-600">{student.stats.weightedGpa}</span>
                    <span className="ml-1 text-sm text-gray-500">/4.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Test Preparation */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Test Preparation</h3>
            <div className="space-y-3">
              {student.plannedTests && student.plannedTests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.plannedTests.map((test, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-purple-700"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No planned tests</p>
              )}
              {student.stats.psat && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">PSAT Score</span>
                    <span className="font-medium text-purple-700">{student.stats.psat.score}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Percentile</span>
                    <span className="font-medium text-purple-700">{student.stats.psat.percentile}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <CurrentCourses courses={courses} />

      {/* Target Schools */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
          <span>Target Schools</span>
          <span className="ml-2 text-gray-500 text-base">目标学校</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {student.dreamSchools.map((school, index) => {
            const matchStats = calculateMatchPercentages(school);
            
            // Calculate the circumference and stroke-dashoffset for the circular progress
            const radius = 16;
            const circumference = 2 * Math.PI * radius;
            const dashOffset = circumference - (matchStats.overall / 100) * circumference;
            
            return (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-medium text-lg">{school.name}</h3>
                  <div className="relative h-14 w-14">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                      {/* Background circle */}
                      <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="3.5"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="transparent"
                        stroke="#6fa68a"
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{matchStats.overall}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Academic Match */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Academic</span>
                      <span>{matchStats.academic}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${matchStats.academic}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Extracurricular Match */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Extracurricular</span>
                      <span>{matchStats.extracurricular}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${matchStats.extracurricular}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Special Talents */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>SpecialTalents</span>
                      <span>{matchStats.specialTalents}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${matchStats.specialTalents}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {student.dreamSchools.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">No target schools added yet</p>
              <p className="text-sm text-gray-400 mt-2">Add schools during the onboarding process</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;