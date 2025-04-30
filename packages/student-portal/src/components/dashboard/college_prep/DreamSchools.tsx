import React, { useEffect, useState } from 'react';
import { Student } from '../../../types/student';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@privschool-lms/common/lib/firebase';

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


const DreamSchools: React.FC<DreamSchoolsProps> = ({ student, onUpdate }) => {
  const [schoolStats, setSchoolStats] = useState<SchoolStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <h2 className="text-lg font-semibold mb-4">Target Schools 目标学校</h2>
        <div className="grid gap-6 md:grid-cols-2">
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
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.academic}%`,
                            backgroundColor: '#785d8e'
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
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.extracurricular}%`,
                            backgroundColor: '#785d8e'
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
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${matchStats.specialTalents}%`,
                            backgroundColor: '#785d8e'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-8">
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
            <div className="space-y-10">
                {schoolStats.map((school, index) => (
                <div key={`stats-${school.name}-${index}`} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg shadow border border-gray-100">
                    
                    {/* Ensure the school name is displayed */}
                    <h3 className="font-bold text-2xl text-blue-800 mb-2">{school.name || "Unknown School"}</h3>
                    
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{school.type || "N/A"}</span>
                    {school.ranking && <span>•</span>}
                    {school.ranking && <span className="font-medium">Ranking: {school.ranking}</span>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                        
                        {/* College Board URL */}
                        {school.College_Board_Admissions_URL && (
                            <div className="mt-2">
                                <a 
                                    href={school.College_Board_Admissions_URL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                    <span>View on College Board</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
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
        <h2 className="text-lg font-semibold mb-4">Application Timeline 申请时间线</h2>
        <div className="space-y-4">
          {(() => {
            type DeadlineInfo = {
              type: string;
              date: Date;
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
                { type: 'Regular', date: convertDeadlineToDate(schoolStat.Deadlines.Regular) },
                { type: 'Early Action', date: convertDeadlineToDate(schoolStat.Deadlines['Early Action']) },
                { type: 'Early Decision', date: convertDeadlineToDate(schoolStat.Deadlines['Early Decision']) }
              ]
                .filter((d): d is DeadlineInfo => d.date !== null)
                .sort((a, b) => a.date.getTime() - b.date.getTime());

              if (deadlines.length === 0) return null;

              return (
                <div key={`timeline-${schoolStat.name}`} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">{schoolStat.name}</h3>
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4 ml-6">
                      {deadlines.map((deadline, idx) => (
                        <div key={`${deadline.type}-${idx}`} className="relative">
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
              );
            });

            const hasValidDeadlines = timelineItems.some(item => item !== null);
            
            return hasValidDeadlines ? (
              <>{timelineItems}</>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No application deadlines available</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DreamSchools;