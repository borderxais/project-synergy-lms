import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Card } from './ui/Card';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
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

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">This Week's Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <button
              onClick={() => onToggleTask(task.id)}
              className="mt-1 focus:outline-none"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                  • {task.priority} priority
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}