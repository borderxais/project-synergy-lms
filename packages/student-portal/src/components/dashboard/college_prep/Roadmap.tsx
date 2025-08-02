import React, { useState } from 'react';
import { Student } from '../../../types/student';
import Modal from '../../common/Modal';

interface RoadmapProps {
  student?: Student | null;
  onUpdate?: (updates: Partial<Student>) => void;
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

const Roadmap: React.FC<RoadmapProps> = ({ student, onUpdate }) => {
  const [timelineViewMode, setTimelineViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([]);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading roadmap data...</p>
      </div>
    );
  }

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

  const renderCalendar = (tasks: any[]) => {
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
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate.getDate() === day && 
               taskDate.getMonth() === month && 
               taskDate.getFullYear() === year;
      });
      
      const showMoreButton = dayTasks.length > 2;
      const displayTasks = showMoreButton ? dayTasks.slice(0, 2) : dayTasks;
      
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
          {displayTasks.map((task, idx) => (
            <div key={idx} className={`text-xs px-1 rounded mb-1 truncate ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.title}
            </div>
          ))}
          {showMoreButton && (
            <button
              onClick={() => {
                setSelectedDayEvents(dayTasks);
                setSelectedDay(currentDate);
                setIsDayEventsModalOpen(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 w-full text-left"
            >
              +{dayTasks.length - 2} more
            </button>
          )}
        </div>
      );
    }
    
    return calendarDays;
  };

  const sortByDeadline = (a: any, b: any) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  };

  // Get category translations for display
  const getCategoryTranslation = (category: string): string => {
    switch (category) {
      case 'Test Prep':
        return '考试准备';
      case 'Application':
        return '申请任务';
      case 'Financial Aid':
        return '助学金申请';
      case 'Essay':
        return '文书写作';
      case 'Research':
        return '研究调查';
      case 'Extracurricular':
        return '课外活动';
      default:
        return '';
    }
  };

  // For backward compatibility
  const legacyTaskDisplay = () => {
    // Group tasks by category
    const testPrepTasks = student?.roadmap.academicGoals || [];
    const applicationTasks = student?.roadmap.extracurricularGoals?.filter(goal =>
      goal.title.toLowerCase().includes('essay') ||
      goal.title.toLowerCase().includes('application') ||
      goal.title.toLowerCase().includes('recommendation')
    ) || [];
    const financialAidTasks = student?.roadmap.extracurricularGoals?.filter(goal =>
      goal.title.toLowerCase().includes('financial') ||
      goal.title.toLowerCase().includes('aid') ||
      goal.title.toLowerCase().includes('fafsa')
    ) || [];

    return (
      <>
        {/* Test Preparation */}
        {testPrepTasks.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Preparation 考试准备</h2>
            <div className="space-y-4">
              {testPrepTasks.sort(sortByDeadline).map((goal, idx) => (
                <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.target}</p>
                  <div className="space-y-2">
                    {goal.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            if (onUpdate && student) {
                              const updatedGoals = [...student.roadmap.academicGoals];
                              updatedGoals[idx].tasks[taskIdx].completed = !task.completed;
                              onUpdate({
                                roadmap: {
                                  ...student.roadmap,
                                  academicGoals: updatedGoals
                                }
                              });
                            }
                          }}
                          className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Tasks */}
        {applicationTasks.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Application Tasks 申请任务</h2>
            <div className="space-y-4">
              {applicationTasks.sort(sortByDeadline).map((goal, idx) => (
                <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.target}</p>
                  <div className="space-y-2">
                    {goal.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            if (onUpdate && student) {
                              const updatedGoals = [...student.roadmap.extracurricularGoals];
                              const goalIndex = updatedGoals.findIndex(g => g.title === goal.title);
                              if (goalIndex !== -1) {
                                updatedGoals[goalIndex].tasks[taskIdx].completed = !task.completed;
                                onUpdate({
                                  roadmap: {
                                    ...student.roadmap,
                                    extracurricularGoals: updatedGoals
                                  }
                                });
                              }
                            }
                          }}
                          className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Aid Tasks */}
        {financialAidTasks.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Financial Aid Tasks 助学金申请</h2>
            <div className="space-y-4">
              {financialAidTasks.sort(sortByDeadline).map((goal, idx) => (
                <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.target}</p>
                  <div className="space-y-2">
                    {goal.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            if (onUpdate && student) {
                              const updatedGoals = [...student.roadmap.extracurricularGoals];
                              const goalIndex = updatedGoals.findIndex(g => g.title === goal.title);
                              if (goalIndex !== -1) {
                                updatedGoals[goalIndex].tasks[taskIdx].completed = !task.completed;
                                onUpdate({
                                  roadmap: {
                                    ...student.roadmap,
                                    extracurricularGoals: updatedGoals
                                  }
                                });
                              }
                            }
                          }}
                          className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  // Dynamic category display based on tasksByCategory
  const dynamicTaskDisplay = () => {
    if (!student?.roadmap.tasksByCategory) {
      return legacyTaskDisplay();
    }

    // Collect all tasks from all categories for the timeline
    const allTasks = Object.values(student.roadmap.tasksByCategory).flat();

    return (
      <>
        {Object.entries(student.roadmap.tasksByCategory).map(([category, tasks]) => (
          tasks.length > 0 && (
            <div key={category} className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {category} {getCategoryTranslation(category)}
              </h2>
              <div className="space-y-4">
                {tasks.sort(sortByDeadline).map((task, idx) => (
                  <div key={`${task.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        {task.school && task.school !== 'All Schools' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {task.school}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        {task.priority && (
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>
                    </div>
                    {/* <p className="text-gray-600 mb-3">{task.target}</p> */}
                    <div className="space-y-2">
                      {task.tasks.map((subtask, taskIdx) => (
                        <div key={taskIdx} className="flex items-start mt-3">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => {
                              if (onUpdate && student) {
                                const updatedTasksByCategory = {...student.roadmap.tasksByCategory};
                                updatedTasksByCategory[category][idx].tasks[taskIdx].completed = !subtask.completed;
                                onUpdate({
                                  roadmap: {
                                    ...student.roadmap,
                                    tasksByCategory: updatedTasksByCategory
                                  }
                                });
                              }
                            }}
                            className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className={`${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {subtask.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Timeline */}
        {allTasks.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Timeline 时间线</h2>
              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setTimelineViewMode('timeline')}
                    className={`p-2 rounded-full transition-colors ${
                      timelineViewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                    title="Timeline View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTimelineViewMode('calendar')}
                    className={`p-2 rounded-full transition-colors ${
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
            
            {timelineViewMode === 'timeline' ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  {allTasks
                    .sort(sortByDeadline)
                    .map((task, idx) => (
                      <div key={`timeline-${idx}`} className="ml-12 relative">
                        <div className={`absolute -left-8 top-2 w-4 h-4 rounded-full ${
                          task.tasks[0]?.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.target}</p>
                          {task.school && task.school !== 'All Schools' && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
                              {task.school}
                            </span>
                          )}
                          {task.priority && (
                            <span className={`text-xs px-2 py-1 rounded-full mt-1 ml-2 inline-block ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
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
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {renderCalendar(allTasks)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-8">
      {dynamicTaskDisplay()}
      
      {/* Day Events Modal */}
      <Modal isOpen={isDayEventsModalOpen} onClose={() => setIsDayEventsModalOpen(false)} title={`Tasks for ${selectedDay?.toLocaleDateString()}`}>
        <div className="space-y-4">
          {selectedDayEvents.map((task, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              task.priority === 'high' ? 'bg-red-50 border-red-100' :
              task.priority === 'medium' ? 'bg-yellow-50 border-yellow-100' :
              'bg-green-50 border-green-100'
            }`}>
              <div className="text-sm font-medium text-gray-900">{task.title}</div>
              <div className="text-xs text-gray-600 mt-1">{task.target}</div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {selectedDayEvents.length === 0 && (
            <p className="text-gray-500 text-sm">No tasks for this day.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Roadmap;