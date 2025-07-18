import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthContext';
import { Student } from '../types/student';
import { ScheduleItem, Course, TodoItem } from '../types/dashboard';

// Import components
import DashboardHeader from '../components/dashboard/home/DashboardHeader';
import WeeklySchedule from '../components/dashboard/home/WeeklySchedule';
import ScheduleNotesModal from '../components/dashboard/home/ScheduleNotesModal';
import CurrentCourses from '../components/dashboard/home/CurrentCourses';
import WeeklyTodoList from '../components/dashboard/home/WeeklyTodoList';

const HomeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [customTypeColors, setCustomTypeColors] = useState<Record<string, string | null>>({});

  // Mock data for the schedule - this would come from the backend in a real implementation
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { day: 'Monday', time: '8:00', subject: 'English 3', type: 'english' },
    { day: 'Monday', time: '9:00', subject: 'Math', type: 'math' },
    { 
      day: 'Monday', 
      time: '10:00-12:00', 
      subject: 'Master Class', 
      type: 'athletics',
      notes: [
        'Practice improving counterattack reaction time',
        'Reaction and neural response training'
      ]
    },
    { 
      day: 'Monday', 
      time: '13:00-14:00', 
      subject: 'Specialized training', 
      type: 'athletics',
      notes: [
        'Focus on correct movement techniques',
        'Strength & conditioning: core muscle reinforcement',
        'Remember post-training stretches'
      ]
    },
    { day: 'Monday', time: '14:00-15:00', subject: 'College Course', type: 'college' },
    { day: 'Monday', time: '15:00-16:00', subject: 'Practice', type: 'athletics' },

    { day: 'Tuesday', time: '8:00', subject: 'History', type: 'history' },
    { day: 'Tuesday', time: '9:00', subject: 'World Language', type: 'language' },
    { day: 'Tuesday', time: '10:00-11:00', subject: 'College Course', type: 'college' },
    { day: 'Tuesday', time: '11:00-12:00', subject: 'Homeroom', type: 'recess' },
    { day: 'Tuesday', time: '13:00-14:00', subject: 'Science', type: 'science' },
    { day: 'Tuesday', time: '14:00-16:00', subject: 'Strength and Conditioning', type: 'athletics' },
    { day: 'Tuesday', time: '16:00-17:00', subject: 'Volunteer', type: 'club' },

    { day: 'Wednesday', time: '8:00-9:00', subject: 'Homeroom', type: 'recess' },
    { day: 'Wednesday', time: '9:00-11:00', subject: 'Group Classes', type: 'athletics' },
    { day: 'Wednesday', time: '11:00-12:00', subject: 'English 3', type: 'english' },
    { day: 'Wednesday', time: '12:00-13:00', subject: 'Lunch', type: 'recess' },
    { day: 'Wednesday', time: '13:00-14:00', subject: 'Math', type: 'math' },
    { day: 'Wednesday', time: '14:00-16:00', subject: 'Strength and Conditioning', type: 'athletics' },

    { day: 'Thursday', time: '8:00', subject: 'History', type: 'history' },
    { day: 'Thursday', time: '9:00', subject: 'World Language', type: 'language' },
    { day: 'Thursday', time: '10:00-11:00', subject: 'College Course', type: 'college' },
    { day: 'Thursday', time: '11:00-12:00', subject: 'Science', type: 'science' },
    { day: 'Thursday', time: '13:00-14:00', subject: 'Homeroom', type: 'recess' },
    { day: 'Thursday', time: '14:00-15:00', subject: 'Specialized training', type: 'athletics' },
    { day: 'Thursday', time: '15:00-16:00', subject: 'Volunteer', type: 'club' },
    { day: 'Thursday', time: '16:00-17:00', subject: 'Practice', type: 'athletics' },

    { day: 'Friday', time: '8:00-10:00', subject: 'Private Lessons', type: 'athletics' },
    { day: 'Friday', time: '10:00-11:00', subject: 'Club', type: 'club' },
    { day: 'Friday', time: '11:00-12:00', subject: 'World Language', type: 'language' },
    { day: 'Friday', time: '13:00-14:00', subject: 'Homeroom', type: 'recess' },
    { day: 'Friday', time: '14:00-16:00', subject: 'Strength and Conditioning', type: 'athletics' },
  ]);

  const updatedTodoItems: TodoItem[] = [
    {
      id: '1',
      day: 'Monday',
      title: 'Review weekend homework',
      completed: false,
      suggestions: ['Check math problems', 'Prepare questions for class'],
    },
    {
      id: '2',
      day: 'Monday',
      title: 'Watch lecture review for College Course',
      completed: false,
      suggestions: ['Focus on this week\'s core concepts', 'Summarize key points in notes'],
    },
    {
      id: '3',
      day: 'Monday',
      title: 'Warm-up routine reflection',
      completed: false,
      suggestions: ['Note tight muscles or soreness', 'Identify areas to focus on next session'],
    },
    {
      id: '4',
      day: 'Tuesday',
      title: 'Prepare for Social Science Presentation',
      completed: false,
      suggestions: [
        'Finish research and draft slides',
        'Practice speaking',
        'Rehearse during study period',
      ],
    },
    {
      id: '5',
      day: 'Tuesday',
      title: 'Write reflection for Volunteer Hour',
      completed: false,
      suggestions: ['Describe your contribution', 'What did you learn from the experience?'],
    },
    {
      id: '6',
      day: 'Wednesday',
      title: 'Technique Journal: Fencing Group Class',
      completed: false,
      suggestions: [
        'Write 3 key takeaways from class',
        'Highlight 1 thing to improve next session',
      ],
    },
    {
      id: '7',
      day: 'Wednesday',
      title: 'English Reading Preview',
      completed: false,
      suggestions: ['Read assigned text', 'Note unfamiliar words and key themes'],
    },
    {
      id: '8',
      day: 'Thursday',
      title: 'Draft Essay Outline for World Language Class',
      completed: false,
      suggestions: ['Outline key ideas', 'Support with examples from class'],
    },
    {
      id: '9',
      day: 'Thursday',
      title: 'Fencing Private Lesson Feedback Notes',
      completed: false,
      suggestions: ['Summarize corrections from coach', 'Write 1 SMART goal for next week'],
    },
    {
      id: '10',
      day: 'Friday',
      title: 'Participate in Club Activity',
      completed: false,
      suggestions: ['Engage in discussion or showcase', 'Note any feedback received'],
    },
    {
      id: '11',
      day: 'Friday',
      title: 'Stretching Log & Recovery',
      completed: false,
      suggestions: ['Log post-training stretch routine', 'Rate soreness/fatigue (1–5 scale)'],
    },
    {
      id: '12',
      day: 'Friday',
      title: 'Select Weekend Volunteer Project',
      completed: false,
      suggestions: ['Choose between Library Organizing or Community Cleanup'],
    },
    {
      id: '13',
      day: 'Friday',
      title: 'Upload Weekly Training Highlights',
      completed: false,
      suggestions: ['Add 1 clip or reflection to performance log'],
    },
  ];
  
  // Mock data for courses - this would come from the backend in a real implementation
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Advanced Fencing Techniques',
      instructor: 'Coach Smith',
      progress: 65,
      type: 'athletics',
      grade: {
        percentage: 92,
        letter: 'A-'
      },
      room: 'AFT 1300',
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
      type: 'english',
      grade: {
        percentage: 88,
        letter: 'B+'
      },
      room: 'ENG 210',
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
      type: 'math',
      grade: {
        percentage: 95,
        letter: 'A'
      },
      room: 'MATH 101',
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
      type: 'history',
      grade: {
        percentage: 89,
        letter: 'B+'
      },
      room: 'HIST 202',
      nextAssignment: {
        title: 'Research Project',
        dueDate: '2025-04-15',
      },
    },
  ]);

  // Mock data for todo items - this would come from the backend in a real implementation
  const [todoItems, setTodoItems] = useState<TodoItem[]>(updatedTodoItems);

  // Helper function to handle schedule item click
  const handleScheduleItemClick = (item: ScheduleItem) => {
    setSelectedScheduleItem(item);
    setIsNotesModalOpen(true);
  };

  // Helper function to close the notes modal
  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedScheduleItem(null);
  };

  // Helper function to update schedule item color
  const handleUpdateScheduleColor = (color: string) => {
    if (!selectedScheduleItem) return;

    // Update the custom color for all items of this type
    setCustomTypeColors(prev => ({
      ...prev,
      [selectedScheduleItem.type]: color || null
    }));

    // Update all schedule items of the same type
    setSchedule(prev => prev.map(item => {
      if (item.type === selectedScheduleItem.type) {
        return {
          ...item,
          customColor: color || undefined
        };
      }
      return item;
    }));

    // Update the selected item to reflect the change
    setSelectedScheduleItem(prev => prev ? {
      ...prev,
      customColor: color || undefined
    } : null);
  };

  // Toggle todo item completion
  const toggleTodoComplete = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

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

        if (
          !locationUserData ||
          !dataTimestamp ||
          new Date().getTime() - new Date(dataTimestamp).getTime() > 30 * 60 * 1000
        ) {
          console.log('[HOME_DASHBOARD] No data or stale data, redirecting to retrieval');
          navigate('/data-retrieval');
          return;
        }

        if (!locationUserData.studentProfile?.generalInfo) {
          console.log('[HOME_DASHBOARD] Missing student profile, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        // Transform the data to match our Student interface (similar to DashboardPage)
        const transformedData: Student = {
          firstName: locationUserData.studentProfile.generalInfo.firstName,
          lastName: locationUserData.studentProfile.generalInfo.lastName,
          grade: locationUserData.studentProfile.generalInfo.grade,
          currentSchool: locationUserData.studentProfile.generalInfo.currentSchool,
          gender: locationUserData.studentProfile.generalInfo.gender,
          schoolType: locationUserData.studentProfile.generalInfo.schoolType,
          // Add other required fields from the Student interface
          stats: {
            gpa: locationUserData.studentProfile.highSchoolProfile?.gpa || 0,
            weightedGpa: locationUserData.studentProfile.highSchoolProfile?.weightedGpa,
            psat: locationUserData.studentProfile.highSchoolProfile?.psat || { score: 'N/A', percentile: 'N/A' },
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
          dreamSchools: [],
          achievements: [],
          roadmap: { academicGoals: [], extracurricularGoals: [] },
        };

        setStudentData(transformedData);
      } catch (error) {
        console.error('[HOME_DASHBOARD] Error loading dashboard:', error);
        setError('Error loading dashboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLoadData();
  }, [user?.uid, navigate, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your personalized schedule...</p>
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

  // Mock student data
  const mockStudentData: Student = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    grade: user?.grade,
    currentSchool: user?.currentSchool,
    gender: user?.gender,
    schoolType: user?.schoolType,
    stats: {
      gpa: user?.gpa,
      weightedGpa: user?.weightedGpa,
      psat: user?.psat,
    },
    currentCourses: user?.currentCourses,
    interests: user?.interests,
    extracurriculars: user?.extracurriculars,
    achievements: user?.achievements,
    goals: user?.goals,
    strengths: user?.strengths,
    weaknesses: user?.weaknesses,
    schedule: user?.schedule,
    notes: user?.notes,
    academicInterests: user?.academicInterests || [], // Add missing field
    roadmap: {
      shortTerm: user?.roadmap?.shortTerm,
      longTerm: user?.roadmap?.longTerm,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader studentData={studentData} userEmail={user?.email} />

      {/* Main content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: "90%" }}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Current Courses Section */}
          <div className="lg:col-span-1">
            <CurrentCourses 
              courses={courses}
              onCoursesUpdate={setCourses}
              customTypeColors={customTypeColors}
            />
          </div>
          
          {/* Weekly Schedule Section */}
          <div className="lg:col-span-3">
            <WeeklySchedule 
              schedule={schedule} 
              onScheduleItemClick={handleScheduleItemClick}
              onScheduleUpdate={setSchedule}
              customTypeColors={customTypeColors}
            />
          </div>
        </div>
        
        {/* Weekly To-Do List Section */}
        <div className="mt-8">
          <WeeklyTodoList 
            todoItems={todoItems} 
            onToggleComplete={toggleTodoComplete}
            onTodoUpdate={setTodoItems}
          />
        </div>
      </div>

      {/* Schedule Notes Modal */}
      <ScheduleNotesModal 
        scheduleItem={selectedScheduleItem} 
        isOpen={isNotesModalOpen} 
        onClose={closeNotesModal}
        onUpdateColor={handleUpdateScheduleColor}
      />
    </div>
  );
};

export default HomeDashboardPage;