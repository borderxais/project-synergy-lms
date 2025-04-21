import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthContext';
import { Tab } from '@headlessui/react';
import StudentOverview from '../components/dashboard/college_prep/StudentOverview';
import DreamSchools from '../components/dashboard/college_prep/DreamSchools';
import Achievements from '../components/dashboard/college_prep/Achievements';
import Roadmap from '../components/dashboard/college_prep/Roadmap';
import { Student } from '../types/student';
import { Menu } from '@headlessui/react';
import { Course } from '../types/dashboard';

// Mock achievement data for display purposes
const MOCK_ACHIEVEMENTS = [
  // Research & Publications
  {
    title: "Machine Learning Research Project",
    description: "Conducted research on applying ML algorithms to predict student performance",
    date: "2024-12-15",
    type: "research",
    tags: ["Machine Learning", "Education", "Data Science"]
  },
  {
    title: "Publication in School Journal",
    description: "Published article on environmental sustainability in the school's science journal",
    date: "2024-10-05",
    type: "publication",
    tags: ["Environment", "Sustainability"]
  },
  
  // Academic Excellence
  {
    title: "AP Computer Science A",
    description: "Completed AP Computer Science with distinction",
    date: "2024-05-20",
    type: "academic",
    grade: "A+"
  },
  {
    title: "Mathematics Competition Finalist",
    description: "Reached the finals in the state mathematics competition",
    date: "2024-03-10",
    type: "academic",
    grade: "A"
  },
  
  // Awards & Recognition
  {
    title: "Outstanding Student Award",
    description: "Recognized for exceptional academic performance and leadership",
    date: "2024-06-15",
    type: "award",
    level: "Regional",
    tags: ["Leadership", "Academic Excellence"]
  },
  {
    title: "Science Fair Gold Medal",
    description: "Won first place for innovative project on renewable energy",
    date: "2024-02-28",
    type: "recognition",
    level: "National",
    tags: ["Science", "Innovation", "Renewable Energy"]
  }
];

// Mock courses data for display purposes
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'Advanced Fencing Techniques',
    instructor: 'Coach Smith',
    progress: 65,
    nextAssignment: {
      title: 'Footwork Analysis Video',
      dueDate: '2025-04-10',
    },
  },
  {
    id: '2',
    name: 'College English 101',
    instructor: 'Prof. Johnson',
    progress: 42,
    nextAssignment: {
      title: 'Essay: Modern Literature',
      dueDate: '2025-04-08',
    },
  },
  {
    id: '3',
    name: 'AP Calculus',
    instructor: 'Ms. Garcia',
    progress: 78,
    nextAssignment: {
      title: 'Problem Set 7',
      dueDate: '2025-04-07',
    },
  },
  {
    id: '4',
    name: 'World History',
    instructor: 'Dr. Lee',
    progress: 91,
    nextAssignment: {
      title: 'Research Project',
      dueDate: '2025-04-15',
    },
  },
];

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

        // Transform recommendations from Firestore
        const transformRecommendations = (recommendations: any[]) => {
          // Check if recommendations is an array of strings (simple format)
          if (recommendations && recommendations.length > 0 && typeof recommendations[0] === 'string') {
            // Convert simple text recommendations to the structured format
            return recommendations.map((text, index) => ({
              id: `rec-${index}`,
              title: '', // Remove the "Recommendation X" title
              description: text,
              category: 'General',
              priority: 'medium',
              createdAt: new Date().toISOString(),
              actions: []
            }));
          }
          
          // Handle the case where recommendations are already in the complex format
          return (recommendations || []).map(rec => {
            // If rec is already an object with the expected properties
            if (typeof rec === 'object' && rec !== null) {
              // Handle the new format from CrewAI (with 'text' field)
              if (rec.text && !rec.description) {
                return {
                  id: rec.id || Math.random().toString(36).substring(2, 9),
                  title: '',
                  description: rec.text,
                  category: rec.category || 'General',
                  priority: rec.priority || 'medium',
                  createdAt: convertTimestamp(rec.createdAt),
                  actions: (rec.actions || []).map((action: any) => ({
                    text: action.text || '',
                    completed: action.completed || false
                  }))
                };
              }
              
              // Handle the original format
              return {
                id: rec.id || Math.random().toString(36).substring(2, 9),
                title: rec.title || 'Untitled Recommendation',
                description: rec.description || '',
                category: rec.category || 'General',
                priority: rec.priority || 'medium',
                createdAt: convertTimestamp(rec.createdAt),
                actions: (rec.actions || []).map((action: any) => ({
                  text: action.text || '',
                  completed: action.completed || false
                }))
              };
            }
            
            // Fallback for any other format
            return {
              id: `rec-${Math.random().toString(36).substring(2, 9)}`,
              title: 'Recommendation',
              description: String(rec),
              category: 'General',
              priority: 'medium',
              createdAt: new Date().toISOString(),
              actions: []
            };
          });
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

          achievements: MOCK_ACHIEVEMENTS,
          roadmap: transformTasks(locationUserData.tasks || []),
          recommendations: transformRecommendations(locationUserData.recommendations || [])
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "90%" }}>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 w-1/3">
              <Link 
                to="/home-dashboard" 
                state={{
                  userData: location.state?.userData,
                  dataTimestamp: location.state?.dataTimestamp
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 w-1/3 text-center">College Dashboard</h1>
            <div className="w-1/3 flex justify-end">
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
      </div>

      {/* Main content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: "90%" }}>
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
                courses={MOCK_COURSES} 
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