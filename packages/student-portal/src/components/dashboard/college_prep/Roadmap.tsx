import React from 'react';
import { Student } from '../../../types/student';

interface RoadmapProps {
  student?: Student | null;
  onUpdate?: (updates: Partial<Student>) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ student, onUpdate }) => {
  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading roadmap data...</p>
      </div>
    );
  }

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
                    <p className="text-gray-600 mb-3">{task.target}</p>
                    <div className="space-y-2">
                      {task.tasks.map((subtask, taskIdx) => (
                        <div key={taskIdx} className="flex items-start">
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
            <h2 className="text-lg font-semibold mb-4">Timeline 时间线</h2>
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
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-8">
      {dynamicTaskDisplay()}
    </div>
  );
};

export default Roadmap;