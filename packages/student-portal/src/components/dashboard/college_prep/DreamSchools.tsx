import React, { useEffect, useState } from 'react';
import { Student } from '../../../types/student';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@privschool-lms/common/lib/firebase';
import Modal from '../../common/Modal';

interface DreamSchoolsProps {
  student?: Student | null;
  onUpdate?: (updates: Partial<Student>) => void;
}

// Define the school statistics interface
interface SchoolStatistics {
  name: string;
  // Old format fields
  acceptanceRate?: number;
  averageGPA?: number | { weighted: string; unweighted: string }; 
  averageSAT?: string;
  averageACT?: string;
  
  // New format fields
  ACT?: {
    avg_score?: string;
    required?: string;
  } | string; // Support both object and string format
  
  SAT?: {
    avg_score?: string;
    required?: string;
    Math?: string;
    Reading?: string;
    Total?: string;
  };
  
  GPA?: {
    "2.50–2.99"?: string;
    "3.00–3.24"?: string;
    "3.25–3.49"?: string;
    "3.50–3.74"?: string;
    "3.75+"?: string;
  };
  
  Deadlines?: {
    "Early Decision"?: string;
    "Early Action"?: string;
    "Regular"?: string;
  };
  
  "Acceptance Rate"?: {
    Admitted?: string;
    Enrolled?: string;
    Rate?: string;
    "Total Applicants"?: string;
  };
  
  "Application Requirements"?: {
    "College Prep Courses"?: string;
    "High School GPA"?: string;
    "High School Rank"?: string;
    Recommendations?: string;
    "SAT/ACT Scores"?: string;
  };
  
  College_Board_Admissions_URL?: string;
  IPEDS?: number | string;
  "University Name"?: string;
  
  // Common fields for both formats
  TOEFL?: {
    required?: string;
    minimumScore?: number;
  };
  topMajors?: string[];
  historicalTrends?: {
    year: number;
    applicants: number;
    accepted: number;
    enrolled: number;
  }[];
  studentFacultyRatio?: string;
  scholarshipsAvailable?: boolean;
  tuitionInState?: string;
  tuitionOutState?: string;
  type?: string;
  ranking?: string;
  webURL?: string;
}

// Calendar helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

const DreamSchools: React.FC<DreamSchoolsProps> = ({ student, onUpdate }) => {
  const [schoolStats, setSchoolStats] = useState<SchoolStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set());
  const [timelineViewMode, setTimelineViewMode] = useState<'row' | 'grid' | 'calendar'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTargetSchoolsModalOpen, setIsTargetSchoolsModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([]);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Initialize all schools as expanded by default
  useEffect(() => {
    if (schoolStats.length > 0) {
      setExpandedSchools(new Set(schoolStats.map(school => school.name)));
    }
  }, [schoolStats]);

  // Fetch school statistics from Firestore
  useEffect(() => {
    const fetchSchoolStatistics = async () => {
      if (!student?.targetSchools?.length) return;
      console.log("Fetching school statistics for:", student.targetSchools);
      
      setLoading(true);
      setError(null);
      
      try {
        const schoolsCollection = collection(db, 'US-Colleges');
        console.log("schoolCollection:", schoolsCollection);
        // const schoolQuery = query(
        //   schoolsCollection,
        //   where('name', 'in', student.targetSchools)
        // );
        const formattedTargetSchools = student.targetSchools.map(name => {
            if (name === "Columbia University") return "Columbia";
            if (name === "University of California, Los Angeles") return "UCLA";
            return name; // Add other school name mappings if necessary
        });
        
        const schoolQuery = query(
          schoolsCollection,
          where('__name__', 'in', formattedTargetSchools)
        );
          
        
        console.log("Executing Firestore query...");
        const querySnapshot = await getDocs(schoolQuery);

        console.log(`Received ${querySnapshot.docs.length} documents from Firestore.`);
        const schoolData: SchoolStatistics[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const schoolEntry: SchoolStatistics = {
            ...data,
            name: doc.id, // 🔥 This sets the name using document ID
          };
          console.log("Final school entry with name:", schoolEntry);
          schoolData.push(schoolEntry);
        });
        
        
        // If we didn't find all the schools in the database, add placeholders
        const foundSchools = new Set(schoolData.map(s => s.name));
        student.targetSchools.forEach(schoolName => {
          const formattedName = schoolName === "Columbia University" ? "Columbia"
                              : schoolName === "University of California, Los Angeles" ? "UCLA"
                              : schoolName;
        
          if (!foundSchools.has(formattedName)) {
            schoolData.push({
              name: formattedName,
              acceptanceRate: 0,
              averageGPA: 0,
              topMajors: [],
              historicalTrends: []
            });
          }
        });
        
        
        setSchoolStats(schoolData);
      } catch (err) {
        console.error('Error fetching school statistics:', err);
        setError('Failed to load school statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolStatistics();
  }, [student?.targetSchools]);

  const toggleSchoolExpansion = (schoolName: string) => {
    const newExpandedSchools = new Set(expandedSchools);
    if (newExpandedSchools.has(schoolName)) {
      newExpandedSchools.delete(schoolName);
    } else {
      newExpandedSchools.add(schoolName);
    }
    setExpandedSchools(newExpandedSchools);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = (deadlines: any[]) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-28 bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = today.getDate() === day && 
                     today.getMonth() === month && 
                     today.getFullYear() === year;
      
      const dayDeadlines = deadlines.filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        return deadlineDate.getDate() === day && 
               deadlineDate.getMonth() === month && 
               deadlineDate.getFullYear() === year;
      });
      
      const showMoreButton = dayDeadlines.length > 2;
      const displayEvents = showMoreButton ? dayDeadlines.slice(0, 2) : dayDeadlines;
      
      calendarDays.push(
        <div 
          key={day} 
          className={`h-28 border border-gray-200 p-3 relative ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          }`}
        >
          <div className={`text-sm mb-2 ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            {day}
          </div>
          {displayEvents.map((deadline, idx) => (
            <div key={idx} className="text-xs bg-blue-100 text-blue-800 px-1 rounded mb-1 truncate">
              {deadline.type}
            </div>
          ))}
          {showMoreButton && (
            <button
              onClick={() => {
                setSelectedDayEvents(dayDeadlines);
                setSelectedDay(currentDate);
                setIsDayEventsModalOpen(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 w-full text-left"
            >
              +{dayDeadlines.length - 2} more
            </button>
          )}
        </div>
      );
    }
    
    return calendarDays;
  };

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading dream schools data...</p>
      </div>
    );
  }

  // Calculate match percentages based on student profile
  const calculateMatchPercentages = (school: string) => {
    // This is a placeholder calculation - in reality, this would be more sophisticated
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
      {/* Target Schools */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Target Schools 目标学校</h2>
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
        <div className="grid gap-6 md:grid-cols-3">
          {student.targetSchools.length > 0 ? (
            student.targetSchools.map((school, idx) => {
              const matchStats = calculateMatchPercentages(school);
              
              // Calculate the circumference and stroke-dashoffset for the circular progress
              const radius = 16;
              const circumference = 2 * Math.PI * radius;
              const dashOffset = circumference - (matchStats.overall / 100) * circumference;
              
              return (
                <div key={`${school}-${idx}`} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-medium text-lg">{school}</h3>
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
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Academic</span>
                        <span>{matchStats.academic}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-300 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.academic}%`,
                          }}
                        ></div>
                      </div>
                    </div>


                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Extracurricular</span>
                        <span>{matchStats.extracurricular}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-300 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.extracurricular}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>SpecialTalents</span>
                        <span>{matchStats.specialTalents}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-300 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.specialTalents}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No target schools added yet</p>
              <p className="text-sm text-gray-400 mt-2">Add schools during the onboarding process</p>
            </div>
          )}
        </div>
      </div>

      {/* School Historical Statistics */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">School Statistics 学校统计</h2>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && schoolStats.length > 0 && (
            <div className="space-y-4">
                {schoolStats.map((school, index) => (
                <div key={`stats-${school.name}-${index}`} className="bg-gradient-to-r from-gray-50 to-white rounded-lg shadow border border-gray-100 overflow-hidden">
                    
                    {/* School Header - Clickable to toggle expansion */}
                    <div 
                      className="p-6 cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => toggleSchoolExpansion(school.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-2xl text-blue-800">{school.name || "Unknown School"}</h3>
                          <div className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{school.type || "N/A"}</span>
                            {school.ranking && <span>•</span>}
                            {school.ranking && <span className="font-medium">Ranking: {school.ranking}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {/* View on College Board Button */}
                          {school.College_Board_Admissions_URL && (
                            <a 
                              href={school.College_Board_Admissions_URL} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-gray-50 rounded-full transition-all duration-200"
                              onClick={(e) => e.stopPropagation()}
                              title="View on College Board"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                          {/* Expand/Collapse Icon */}
                          <svg 
                            className={`w-6 h-6 text-gray-400 transition-transform ${expandedSchools.has(school.name) ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedSchools.has(school.name) && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Key Statistics Column */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3">Key Statistics</h4>
                            
                            {/* Acceptance Rate - Support both formats */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">Acceptance Rate</div>
                              <div className="text-xl font-bold text-blue-700">
                                {school["Acceptance Rate"]?.Rate 
                                  ? school["Acceptance Rate"].Rate 
                                  : (school.acceptanceRate ? `${school.acceptanceRate}` : 'N/A')}
                              </div>
                              {school["Acceptance Rate"]?.["Total Applicants"] && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Applicants: {school["Acceptance Rate"]["Total Applicants"]}
                                </div>
                              )}
                            </div>

                            {/* Average GPA - Support both formats */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">Average GPA</div>
                              <div className="text-xl font-bold text-blue-700">
                                {school.GPA ? (
                                  <div className="space-y-1">
                                    {school.GPA["3.75+"] && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">3.75+:</span>
                                        <span className="text-lg">{school.GPA["3.75+"]}</span>
                                      </div>
                                    )}
                                    {school.GPA["3.50–3.74"] && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">3.50–3.74:</span>
                                        <span className="text-lg">{school.GPA["3.50–3.74"]}</span>
                                      </div>
                                    )}
                                    {school.GPA["3.25–3.49"] && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">3.25–3.49:</span>
                                        <span className="text-lg">{school.GPA["3.25–3.49"]}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  school.averageGPA && typeof school.averageGPA === 'object'
                                  ? (
                                    <div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Weighted:</span>
                                        <span className="text-lg">{parseFloat(school.averageGPA.weighted).toFixed(1)}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Unweighted:</span>
                                        <span className="text-lg">{parseFloat(school.averageGPA.unweighted).toFixed(1)}</span>
                                      </div>
                                    </div>
                                    )
                                  : 'N/A'
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Test Scores Column */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3">Test Scores</h4>

                            {/* SAT Score - Support both formats */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">SAT</div>
                              {school.SAT ? (
                                <div className="space-y-1">
                                  {school.SAT.Total && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Total:</span>
                                      <span className="text-lg font-bold text-blue-700">{school.SAT.Total}</span>
                                    </div>
                                  )}
                                  {school.SAT.Math && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Math:</span>
                                      <span className="text-lg">{school.SAT.Math}</span>
                                    </div>
                                  )}
                                  {school.SAT.Reading && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Reading:</span>
                                      <span className="text-lg">{school.SAT.Reading}</span>
                                    </div>
                                  )}
                                  {school.SAT.required && (
                                    <div className="text-xs text-gray-500 mt-1">Required: {school.SAT.required}</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-blue-700">{school.averageSAT || 'N/A'}</div>
                              )}
                            </div>

                            {/* ACT Score - Support both formats */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">ACT</div>
                              {typeof school.ACT === 'object' && school.ACT ? (
                                <div>
                                  <div className="text-xl font-bold text-blue-700">{school.ACT.avg_score || 'N/A'}</div>
                                  {school.ACT.required && <div className="text-xs text-gray-500 mt-1">Required: {school.ACT.required}</div>}
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-blue-700">{typeof school.ACT === 'string' ? school.ACT : (school.averageACT || 'N/A')}</div>
                              )}
                            </div>
                          </div>

                          {/* Additional Information Column */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3">Deadlines & Requirements</h4>
                            
                            {/* Deadlines - Support both formats */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">Application Deadlines</div>
                              {school.Deadlines ? (
                                <div className="space-y-1">
                                  {school.Deadlines.Regular && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Regular:</span>
                                      <span className="text-lg">{school.Deadlines.Regular}</span>
                                    </div>
                                  )}
                                  {school.Deadlines["Early Action"] && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Early Action:</span>
                                      <span className="text-lg">{school.Deadlines["Early Action"]}</span>
                                    </div>
                                  )}
                                  {school.Deadlines["Early Decision"] && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Early Decision:</span>
                                      <span className="text-lg">{school.Deadlines["Early Decision"]}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-lg font-medium text-gray-700">Not available</div>
                              )}
                            </div>
                            
                            {/* Application Requirements */}
                            {school["Application Requirements"] && (
                              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <div className="text-sm text-gray-500 mb-1">Requirements</div>
                                <div className="space-y-1">
                                  {school["Application Requirements"]["College Prep Courses"] && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">College Prep:</span>
                                      <span className="text-sm">{school["Application Requirements"]["College Prep Courses"]}</span>
                                    </div>
                                  )}
                                  {school["Application Requirements"]["High School GPA"] && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">GPA:</span>
                                      <span className="text-sm">{school["Application Requirements"]["High School GPA"]}</span>
                                    </div>
                                  )}
                                  {school["Application Requirements"]["SAT/ACT Scores"] && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Test Scores:</span>
                                      <span className="text-sm">{school["Application Requirements"]["SAT/ACT Scores"]}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Official Website */}
                        {school.webURL && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                            <div className="text-sm text-blue-700 mb-1 font-medium">Official Website</div>
                            <a href={`https://${school.webURL}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg flex items-center">
                              <span>{school.webURL}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                </div>
                ))}
            </div>
            )}


        
        {!loading && !error && schoolStats.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium text-lg">No school statistics available</p>
            <p className="text-sm text-gray-500 mt-2">Statistics will appear once schools are loaded from the database</p>
          </div>
        )}
      </div>

      {/* School Categories */}
      {student.schoolCategories && student.schoolCategories.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">School Categories 学校类型</h2>
          <div className="flex flex-wrap gap-2">
            {student.schoolCategories.map((category, idx) => (
              <span
                key={`${category}-${idx}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Application Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Application Timeline 申请时间线</h2>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTimelineViewMode('row')}
                className={`p-2 rounded transition-colors ${
                  timelineViewMode === 'row' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Row View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setTimelineViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  timelineViewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Grid View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setTimelineViewMode('calendar')}
                className={`p-2 rounded transition-colors ${
                  timelineViewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Calendar View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {(() => {
          type DeadlineInfo = {
            type: string;
            date: Date;
            school: string;
          };

          const convertDeadlineToDate = (dateStr: string | undefined): Date | null => {
            if (!dateStr) return null;
            const [monthStr, dayStr] = dateStr.split(' ');
            const currentYear = new Date().getFullYear();
            try {
              const dateObj = new Date(`${monthStr} ${dayStr}, ${currentYear}`);
              if (isNaN(dateObj.getTime())) return null;
              if (dateObj < new Date()) {
                dateObj.setFullYear(currentYear + 1);
              }
              return dateObj;
            } catch {
              return null;
            }
          };

          const timelineItems = schoolStats.map((schoolStat) => {
            if (!schoolStat.Deadlines) return null;

            // Convert deadlines to date objects and sort them
            const deadlines: DeadlineInfo[] = [
              { type: 'Regular', date: convertDeadlineToDate(schoolStat.Deadlines.Regular), school: schoolStat.name },
              { type: 'Early Action', date: convertDeadlineToDate(schoolStat.Deadlines['Early Action']), school: schoolStat.name },
              { type: 'Early Decision', date: convertDeadlineToDate(schoolStat.Deadlines['Early Decision']), school: schoolStat.name }
            ]
              .filter((d): d is DeadlineInfo => d.date !== null)
              .sort((a, b) => a.date.getTime() - b.date.getTime());

            if (deadlines.length === 0) return null;

            return { school: schoolStat.name, deadlines };
          }).filter(Boolean);

          const allDeadlines = timelineItems.flatMap(item => item!.deadlines);

          if (timelineViewMode === 'calendar') {
            return (
              <div className="space-y-4">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {renderCalendar(allDeadlines)}
                  </div>
                </div>
              </div>
            );
          }

          if (timelineViewMode === 'grid') {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timelineItems.map((item, idx) => (
                  <div key={`grid-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">{item!.school}</h3>
                    <div className="space-y-2">
                      {item!.deadlines.map((deadline, deadlineIdx) => (
                        <div key={`${deadline.type}-${deadlineIdx}`} className="flex items-center justify-between p-2 bg-white rounded">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{deadline.type}</div>
                            <div className="text-xs text-gray-500">{deadline.date.toLocaleDateString()}</div>
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {deadline.date.toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // Row view (default)
          return (
            <div className="space-y-4">
              {timelineItems.map((item, idx) => (
                <div key={`row-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">{item!.school}</h3>
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4 ml-6">
                      {item!.deadlines.map((deadline, deadlineIdx) => (
                        <div key={`${deadline.type}-${deadlineIdx}`} className="relative">
                          <div className="absolute -left-[1.625rem] top-2 w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              {deadline.date.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-700">
                              {deadline.type} Deadline
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Target Schools Edit Modal */}
      <Modal isOpen={isTargetSchoolsModalOpen} onClose={() => setIsTargetSchoolsModalOpen(false)} title="Edit Target Schools">
        <div className="space-y-6">
          <p className="text-gray-600">Add, edit, or remove target schools and their match criteria.</p>
          
          {/* Current Target Schools */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Target Schools</h3>
            <div className="space-y-2">
              {student.targetSchools.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{school}</span>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      // TODO: Remove school logic
                      console.log('Remove school:', school);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New School */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add New School</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter school name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  // TODO: Add school logic
                  console.log('Add school');
                }}
              >
                Add
              </button>
            </div>
          </div>

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

      {/* Day Events Modal */}
      <Modal isOpen={isDayEventsModalOpen} onClose={() => setIsDayEventsModalOpen(false)} title={`Events for ${selectedDay?.toLocaleDateString()}`}>
        <div className="space-y-4">
          {selectedDayEvents.map((event, index) => (
            <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-sm font-medium text-blue-800">{event.type}</div>
              <div className="text-xs text-blue-600">From: {new Date(event.date).toLocaleDateString()}</div>
              <div className="text-xs text-blue-600">School: {event.school}</div>
            </div>
          ))}
          {selectedDayEvents.length === 0 && (
            <p className="text-gray-500 text-sm">No events for this day.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DreamSchools;