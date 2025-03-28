import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../ui/Card';
import { MonthSelector } from './MonthSelector';
import { TimelineMonth } from '../../../types/timeline';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  category: string;
  school: string;
  isCompleted: boolean;
}

interface TimelineProps {
  data: Record<string, MonthlyData>;
  initialMonth?: TimelineMonth;
  onMonthSelect?: (month: TimelineMonth) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskEdit: (task: Task) => void;
  onNewTask: () => void;
}

interface MonthlyData {
  milestones: Array<any>;
  tasks: Array<Task>;
  events: Array<any>;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  data, 
  initialMonth,
  onMonthSelect,
  onTaskUpdate,
  onTaskEdit,
  onNewTask
}) => {
  const [selectedMonth, setSelectedMonth] = useState<TimelineMonth>(() => {
    if (initialMonth) return initialMonth;
    const now = new Date();
    return {
      name: now.toLocaleString('en-US', { month: 'short' }),
      year: now.getFullYear()
    };
  });

  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    milestones: [],
    tasks: [],
    events: []
  });

  // Calculate months that have tasks
  const monthsWithTasks = new Set(
    Object.keys(data).filter(key => data[key]?.tasks?.length > 0)
  );

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      await onTaskUpdate(taskId, { isCompleted });
    } catch (err) {
      console.error('Failed to update task completion:', err);
    }
  };

  const generateCurrentMonthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const monthKey = `${selectedMonth.name}-${selectedMonth.year}`;
      const monthData = data[monthKey];
      
      setCurrentMonthData({
        milestones: monthData?.milestones || [],
        tasks: monthData?.tasks || [],
        events: monthData?.events || []
      });
      
    } catch (err) {
      console.error('[TIMELINE] Error generating month data:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [data, selectedMonth]);

  useEffect(() => {
    generateCurrentMonthData();
  }, [generateCurrentMonthData]);

  const handleMonthSelect = (month: TimelineMonth) => {
    setSelectedMonth(month);
    onMonthSelect?.(month);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={generateCurrentMonthData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthSelect={handleMonthSelect}
            monthsWithTasks={monthsWithTasks}
          />
          <button
            onClick={onNewTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            New Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {currentMonthData.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-grow">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={(e) => handleTaskCompletion(task.id, e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-md font-medium ${
                          task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}>
                          {task.name}
                        </h4>
                        <button
                          onClick={() => onTaskEdit(task)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {task.school}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {task.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleTaskExpansion(task.id)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    {expandedTaskIds.has(task.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>

                {expandedTaskIds.has(task.id) && (
                  <div className="mt-4 pl-8 text-sm text-gray-600">
                    {task.description}
                  </div>
                )}
              </div>
            ))}

            {currentMonthData.tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks for this month
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};