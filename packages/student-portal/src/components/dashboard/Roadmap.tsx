import React from 'react';
import { Student } from '../../types/student';

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

  // Group tasks by category
  const testPrepTasks = student.roadmap.academicGoals.filter(goal => 
    goal.title.toLowerCase().includes('test') || 
    goal.title.toLowerCase().includes('sat') || 
    goal.title.toLowerCase().includes('act') || 
    goal.title.toLowerCase().includes('ap')
  );

  const applicationTasks = student.roadmap.extracurricularGoals.filter(goal =>
    goal.title.toLowerCase().includes('essay') ||
    goal.title.toLowerCase().includes('application') ||
    goal.title.toLowerCase().includes('recommendation')
  );

  const financialAidTasks = student.roadmap.extracurricularGoals.filter(goal =>
    goal.title.toLowerCase().includes('financial') ||
    goal.title.toLowerCase().includes('aid') ||
    goal.title.toLowerCase().includes('fafsa')
  );

  return (
    <div className="space-y-8">
      {/* Test Preparation */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Test Preparation 考试准备</h2>
        <div className="space-y-4">
          {testPrepTasks.length > 0 ? (
            testPrepTasks.sort(sortByDeadline).map((goal, idx) => (
              <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {goal.tasks.map((task, taskIdx) => (
                    <div key={`${task.text}-${taskIdx}`} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          if (onUpdate) {
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
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`ml-2 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No test preparation tasks scheduled</p>
          )}
        </div>
      </div>

      {/* Application Tasks */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Application Tasks 申请任务</h2>
        <div className="space-y-4">
          {applicationTasks.length > 0 ? (
            applicationTasks.sort(sortByDeadline).map((goal, idx) => (
              <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {goal.tasks.map((task, taskIdx) => (
                    <div key={`${task.text}-${taskIdx}`} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          if (onUpdate) {
                            const updatedGoals = [...student.roadmap.extracurricularGoals];
                            updatedGoals[idx].tasks[taskIdx].completed = !task.completed;
                            onUpdate({
                              roadmap: {
                                ...student.roadmap,
                                extracurricularGoals: updatedGoals
                              }
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`ml-2 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No application tasks scheduled</p>
          )}
        </div>
      </div>

      {/* Financial Aid Tasks */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Financial Aid Tasks 助学金任务</h2>
        <div className="space-y-4">
          {financialAidTasks.length > 0 ? (
            financialAidTasks.sort(sortByDeadline).map((goal, idx) => (
              <div key={`${goal.title}-${idx}`} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {goal.tasks.map((task, taskIdx) => (
                    <div key={`${task.text}-${taskIdx}`} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          if (onUpdate) {
                            const updatedGoals = [...student.roadmap.extracurricularGoals];
                            updatedGoals[idx].tasks[taskIdx].completed = !task.completed;
                            onUpdate({
                              roadmap: {
                                ...student.roadmap,
                                extracurricularGoals: updatedGoals
                              }
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`ml-2 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No financial aid tasks scheduled</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Timeline 时间线</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6 relative">
            {[...student.roadmap.academicGoals, ...student.roadmap.extracurricularGoals]
              .sort(sortByDeadline)
              .map((goal, idx) => (
                <div key={`timeline-${idx}`} className="ml-12 relative">
                  <div className={`absolute -left-8 top-2 w-4 h-4 rounded-full ${
                    goal.tasks[0].completed ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;