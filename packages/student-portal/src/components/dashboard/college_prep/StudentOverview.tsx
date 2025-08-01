import React, { useState } from 'react';
import { Student } from '../../../types/student';
import { Course } from '../../../types/dashboard';
import CurrentCourses from '../home/CurrentCourses';
import Recommendation from './Recommendation';
import Modal from '../../common/Modal';
import EditCoursesModal from '../home/EditCoursesModal';

interface StudentOverviewProps {
  student?: Student | null;
  courses?: Course[];
  onUpdate?: (updates: Partial<Student>) => void;
}

const StudentOverview: React.FC<StudentOverviewProps> = ({ student, courses = [], onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false);
  const [isTargetSchoolsModalOpen, setIsTargetSchoolsModalOpen] = useState(false);
  const [customTypeColors, setCustomTypeColors] = useState<Record<string, string | null>>({});
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);

  // Update local courses when prop changes
  React.useEffect(() => {
    setLocalCourses(courses);
  }, [courses]);

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

  const handleCoursesUpdate = (updatedCourses: Course[]) => {
    console.log('handleCoursesUpdate called with:', updatedCourses);
    setLocalCourses(updatedCourses);
    // You can add additional logic here to persist the changes
    console.log('Courses updated:', updatedCourses);
  };

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span>Student Profile</span>
                <span className="ml-2 text-gray-500 text-base">学生档案</span>
              </h2>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
                title="Edit Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 flex-grow">
              {/* Profile Header */}
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

              {/* Interests */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Interests 兴趣爱好</h4>
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

              {/* Study Style */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Study Style 学习风格</h4>
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

        {/* Right Column - Academic Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span>Academic Stats</span>
                <span className="ml-2 text-gray-500 text-base">学术状态</span>
              </h2>
              <button
                onClick={() => setIsAcademicModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
                title="Edit Academic Stats"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 flex-grow">
              {/* GPA Section */}
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

              {/* Test Preparation Section */}
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
        </div>
      </div>

      {/* Personalized Recommendations - Enhanced Visual Design */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Personalized Recommendations</span>
            <span className="ml-2 text-gray-500 text-base">个性化建议</span>
          </h2>
          <button
            onClick={() => setIsRecommendationsModalOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
            title="Edit Recommendations"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>
        
        <Recommendation 
          recommendations={student?.recommendations} 
          onToggleAction={(recommendationId, actionIndex) => {
            if (student && student.recommendations) {
              const updatedRecommendations = [...student.recommendations];
              const recIndex = updatedRecommendations.findIndex(rec => rec.id === recommendationId);
              
              if (recIndex !== -1 && updatedRecommendations[recIndex].actions && updatedRecommendations[recIndex].actions![actionIndex]) {
                updatedRecommendations[recIndex].actions![actionIndex].completed = 
                  !updatedRecommendations[recIndex].actions![actionIndex].completed;
                
                onUpdate?.({ recommendations: updatedRecommendations });
              }
            }
          }} 
        />
      </div>

      {/* Current Courses - Horizontal Layout with Edit Feature */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span>Current Courses</span>
            <span className="ml-2 text-gray-500 text-base">当前课程</span>
          </h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
            title="Edit Courses"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localCourses.map((course) => {
            const colorClass = getColorClass(course.type, customTypeColors[course.type] || undefined);
            console.log(`Course: ${course.name}, Type: ${course.type}, Color: ${colorClass}`);
            return (
              <div key={course.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className={`${colorClass} p-4 rounded-t-lg`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-medium text-lg line-clamp-2 inherit-text-color">{course.name}</h3>
                      <p className="text-sm opacity-90 inherit-text-color">Instructor: {course.instructor}</p>
                      {course.room && (
                        <p className="text-sm opacity-90 inherit-text-color">Room: {course.room}</p>
                      )}
                    </div>
                    <div className="bg-white bg-opacity-20 px-2.5 py-0.5 rounded-full flex-shrink-0 inherit-text-color">
                      <span className="text-sm font-medium">
                        {typeof course.grade === 'object' 
                          ? course.grade?.letter || 'N/A'
                          : course.grade || 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {course.nextAssignment && (
                        <div>
                          <p className="text-sm font-medium">Next Assignment:</p>
                          <p className="text-sm">{course.nextAssignment.title}</p>
                          <p className="text-xs text-gray-500">
                            Due: {new Date(course.nextAssignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <CircularProgress progress={course.progress} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <EditCoursesModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          courses={localCourses}
          onCoursesUpdate={handleCoursesUpdate}
        />
      </div>

      {/* Target Schools */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span>Target Schools</span>
            <span className="ml-2 text-gray-500 text-base">目标学校</span>
          </h2>
          <button
            onClick={() => setIsTargetSchoolsModalOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
            title="Edit Target Schools"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>

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
                  <div className="flex items-center space-x-3">
                    {/* School Logo Placeholder */}
                    <div className="w-[45px] h-[45px] bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg">{school.name}</h3>
                  </div>
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
                        stroke="green"
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
                        className="bg-pink-300 h-2 rounded-full transition-all duration-500"
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
                        className="bg-blue-300 h-2 rounded-full transition-all duration-500"
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
                        className="bg-purple-300 h-2 rounded-full transition-all duration-500"
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

      {/* Modals */}
      {/* Profile Edit Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Edit Student Profile">
        <div className="space-y-4">
          <p className="text-gray-600">Edit student profile information including personal details, interests, and study preferences.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement profile update logic
                console.log('Profile updated');
                setIsProfileModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Academic Stats Edit Modal */}
      <Modal isOpen={isAcademicModalOpen} onClose={() => setIsAcademicModalOpen(false)} title="Edit Academic Stats">
        <div className="space-y-4">
          <p className="text-gray-600">Edit academic statistics including GPA, test scores, and planned tests.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsAcademicModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement academic stats update logic
                console.log('Academic stats updated');
                setIsAcademicModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Recommendations Edit Modal */}
      <Modal isOpen={isRecommendationsModalOpen} onClose={() => setIsRecommendationsModalOpen(false)} title="Edit Recommendations">
        <div className="space-y-4">
          <p className="text-gray-600">Manage personalized recommendations and their priority levels.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsRecommendationsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement recommendations update logic
                console.log('Recommendations updated');
                setIsRecommendationsModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Target Schools Edit Modal */}
      <Modal isOpen={isTargetSchoolsModalOpen} onClose={() => setIsTargetSchoolsModalOpen(false)} title="Edit Target Schools">
        <div className="space-y-4">
          <p className="text-gray-600">Add, edit, or remove target schools and their match criteria.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsTargetSchoolsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement target schools update logic
                console.log('Target schools updated');
                setIsTargetSchoolsModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Helper function for color classes (copied from CurrentCourses.tsx)
const getColorClass = (type: string, customColor?: string) => {
  if (customColor) {
    return customColor;
  }

  switch (type) {
    case 'athletics':
      return 'bg-gray-200 text-gray-800';
    case 'math':
      return 'bg-purple-300 text-purple-800';
    case 'english':
      return 'bg-pink-300 text-pink-800';
    case 'science':
      return 'bg-green-300 text-green-800';
    case 'history':
      return 'bg-red-300 text-red-800';
    case 'language':
      return 'bg-amber-300 text-amber-800';
    case 'recess':
      return 'bg-yellow-200 text-yellow-800';
    case 'college':
      return 'bg-orange-200 text-orange-800';
    case 'club':
      return 'bg-blue-300 text-blue-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

// Circular Progress Component (copied from CurrentCourses.tsx)
const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          {/* Progress circle */}
          <circle
            className="text-green-600"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute text-xl font-semibold">{progress}%</span>
      </div>
      <span className="text-xs font-normal text-gray-400 mt-1">Progress</span>
    </div>
  );
};

export default StudentOverview;