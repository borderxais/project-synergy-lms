import React from 'react';

export function TasksAndProgress() {
  const tasks = [
    {
      id: 1,
      title: 'Complete ISEE Practice Test 1',
      dueDate: '2025-02-10',
      priority: 'high',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Review Math Word Problems',
      dueDate: '2025-02-12',
      priority: 'medium',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'Study Vocabulary List',
      dueDate: '2025-02-15',
      priority: 'medium',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'Complete Reading Comprehension Exercise',
      dueDate: '2025-02-08',
      priority: 'high',
      status: 'completed'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'not-started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Tasks</h2>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              <button className="text-gray-400 hover:text-gray-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}