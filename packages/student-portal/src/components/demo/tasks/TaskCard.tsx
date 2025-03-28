import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../../../types';
import { useTaskProgress } from '../../../hooks/useTaskProgress';
import { formatDate } from '../../../utils/date';
import { Celebration } from '../celebration/Celebration';

interface TaskCardProps {
  task: Task;
  monthKey: string;
}

export function TaskCard({ task, monthKey }: TaskCardProps) {
  const { toggleTask, getTaskProgress } = useTaskProgress(monthKey);
  const [showCelebration, setShowCelebration] = useState(false);
  const completed = getTaskProgress(task.id);

  const handleToggle = () => {
    if (!completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    toggleTask(task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'test-prep':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative p-4 hover:bg-gray-50 transition-colors">
      {showCelebration && <Celebration />}
      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggle}
          className="mt-1 focus:outline-none"
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <div className="flex-1">
          <h3 className={`font-medium ${completed ? 'text-green-600' : 'text-gray-900'}`}>
            {task.title}
            {completed && <span className="ml-2 text-sm">🎉 Complete!</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-500">
              Due: {formatDate(task.dueDate)}
            </span>
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              • {task.priority} priority
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeColor(task.category)}`}>
              {task.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}