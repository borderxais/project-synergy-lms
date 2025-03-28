import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthContext';
import { Tab } from '@headlessui/react';
import StudentOverview from '../components/dashboard/StudentOverview';
import DreamSchools from '../components/dashboard/DreamSchools';
import Achievements from '../components/dashboard/Achievements';
import Roadmap from '../components/dashboard/Roadmap';
import { Student } from '../types/student';
import { Menu } from '@headlessui/react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndLoadData = async () => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { userData: locationUserData, dataTimestamp } = location.state || {};
        
        console.log('[DASHBOARD] Raw location data:', locationUserData);

        if (!locationUserData || !dataTimestamp || 
            (new Date().getTime() - new Date(dataTimestamp).getTime() > 30 * 60 * 1000)) {
          console.log('[DASHBOARD] No data or stale data, redirecting to retrieval');
          navigate('/data-retrieval');
          return;
        }

        if (!locationUserData.studentProfile?.generalInfo) {
          console.log('[DASHBOARD] Missing student profile, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        // Helper function to convert Firestore timestamp to ISO date string
        const convertTimestamp = (timestamp: any): string => {
          const defaultDate = new Date();
          defaultDate.setMonth(defaultDate.getMonth() + 3); // Default to 3 months from now
          
          try {
            if (!timestamp) return defaultDate.toISOString();

            // Handle Firestore timestamp format
            if (typeof timestamp === 'object' && 'seconds' in timestamp) {
              const date = new Date(timestamp.seconds * 1000);
              return !isNaN(date.getTime()) ? date.toISOString() : defaultDate.toISOString();
            }

            // Handle regular date strings
            const date = new Date(timestamp);
            return !isNaN(date.getTime()) ? date.toISOString() : defaultDate.toISOString();
          } catch {
            return defaultDate.toISOString();
          }
        };

        // Transform tasks into goal structures
        const transformTasks = (tasks: any[]) => {
          const academicGoals = (tasks || [])
            .filter(task => task.category === 'Test Prep')
            .map(task => ({
              title: task.title || 'Untitled Task',
              target: task.description || '',
              deadline: convertTimestamp(task.dueDate),
              tasks: [{
                text: task.description || '',
                completed: task.isCompleted || false
              }]
            }));

          const applicationGoals = (tasks || [])
            .filter(task => task.category === 'Application')
            .map(task => ({
              title: task.title || 'Untitled Task',
              target: task.description || '',
              deadline: convertTimestamp(task.dueDate),
              tasks: [{
                text: task.description || '',
                completed: task.isCompleted || false
              }]
            }));

          const financialAidGoals = (tasks || [])
            .filter(task => task.category === 'Financial Aid')
            .map(task => ({
              title: task.title || 'Untitled Task',
              target: task.description || '',
              deadline: convertTimestamp(task.dueDate),
              tasks: [{
                text: task.description || '',
                completed: task.isCompleted || false
              }]
            }));

          return {
            academicGoals,
            extracurricularGoals: [...applicationGoals, ...financialAidGoals]
          };
        };

        // Transform the data to match our Student interface
        const transformedData: Student = {
          firstName: locationUserData.studentProfile.generalInfo.firstName,
          lastName: locationUserData.studentProfile.generalInfo.lastName,
          grade: locationUserData.studentProfile.generalInfo.grade,
          currentSchool: locationUserData.studentProfile.generalInfo.currentSchool,
          gender: locationUserData.studentProfile.generalInfo.gender,
          schoolType: locationUserData.studentProfile.generalInfo.schoolType,

          stats: {
            gpa: locationUserData.studentProfile.highSchoolProfile?.gpa || 0,
            weightedGpa: locationUserData.studentProfile.highSchoolProfile?.weightedGpa,
            psat: locationUserData.studentProfile.highSchoolProfile?.psat || { score: 'N/A', percentile: 'N/A' }
          },

          currentCourses: locationUserData.studentProfile.highSchoolProfile?.currentClasses || [],
          interests: locationUserData.studentProfile.interests || [],
          extracurriculars: locationUserData.studentProfile.extracurriculars || [],
          targetSchools: locationUserData.studentProfile.collegePreferences?.targetSchools || [],
          earlyDecision: locationUserData.studentProfile.collegePreferences?.earlyDecision,
          schoolCategories: locationUserData.studentProfile.collegePreferences?.schoolCategories || [],
          plannedTests: locationUserData.studentProfile.highSchoolProfile?.plannedTests || [],
          preferredTestPrepMethod: locationUserData.studentProfile.highSchoolProfile?.preferredTestPrepMethod,
          studyStylePreference: locationUserData.studentProfile.highSchoolProfile?.studyStylePreference || [],
          testType: locationUserData.studentProfile.highSchoolProfile?.testType || 'SAT',
          needsEnglishProficiency: locationUserData.studentProfile.highSchoolProfile?.needsEnglishProficiency || false,
          applicationDeadline: locationUserData.studentProfile.collegePreferences?.applicationDeadline,

          dreamSchools: (locationUserData.studentProfile.collegePreferences?.targetSchools || []).map((school: string) => ({
            name: school,
            overallMatch: 0,
            stats: {
              academic: 0,
              extracurricular: 0,
              specialTalents: 0
            }
          })),

          achievements: [],
          roadmap: transformTasks(locationUserData.tasks || [])
        };

        console.log('[DASHBOARD] Transformed student data:', transformedData);
        setStudentData(transformedData);
      } catch (error) {
        console.error('[DASHBOARD] Error loading dashboard:', error);
        setError('Error loading dashboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLoadData();
  }, [user?.uid, navigate, location.state]);

  const handleUpdateStudentData = (updates: Partial<Student>) => {
    if (studentData) {
      setStudentData({ ...studentData, ...updates });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/data-retrieval')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {studentData?.firstName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Menu.Button>
              
              <Menu.Items className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {studentData?.firstName} {studentData?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || 'No email available'}
                  </p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      }}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-white rounded-xl shadow-sm mb-6">
            <Tab className={({ selected }) =>
              `w-full py-3 px-4 text-sm leading-5 font-medium rounded-lg
              ${selected
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Overview 概览
            </Tab>
            <Tab className={({ selected }) =>
              `w-full py-3 px-4 text-sm leading-5 font-medium rounded-lg
              ${selected
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Dream Schools 目标学校
            </Tab>
            <Tab className={({ selected }) =>
              `w-full py-3 px-4 text-sm leading-5 font-medium rounded-lg
              ${selected
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Achievements 成就
            </Tab>
            <Tab className={({ selected }) =>
              `w-full py-3 px-4 text-sm leading-5 font-medium rounded-lg
              ${selected
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }>
              Roadmap 路线图
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <StudentOverview 
                student={studentData} 
                onUpdate={handleUpdateStudentData} 
              />
            </Tab.Panel>
            <Tab.Panel>
              <DreamSchools 
                student={studentData} 
                onUpdate={handleUpdateStudentData} 
              />
            </Tab.Panel>
            <Tab.Panel>
              <Achievements 
                student={studentData} 
                onUpdate={handleUpdateStudentData} 
              />
            </Tab.Panel>
            <Tab.Panel>
              <Roadmap 
                student={studentData} 
                onUpdate={handleUpdateStudentData} 
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default DashboardPage;