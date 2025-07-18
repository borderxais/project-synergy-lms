import React, { useState } from 'react';
import { TodoItem } from '../../../types/dashboard';

interface CompletionTime {
  id: string;
  timestamp: number;
}

interface WeeklyTodoListProps {
  todoItems: TodoItem[];
  onToggleComplete: (id: string) => void;
}

const WeeklyTodoList: React.FC<WeeklyTodoListProps> = ({ todoItems, onToggleComplete }) => {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    'Any Day': true
  });

  // Track completion timestamps
  const [completionTimes, setCompletionTimes] = useState<CompletionTime[]>([]);
  // Track items that are being checked
  const [checkingItems, setCheckingItems] = useState<string[]>([]);
  // Track completed items that haven't moved to bottom yet
  const [pendingMoveItems, setPendingMoveItems] = useState<string[]>([]);

  const handleToggleComplete = (id: string) => {
    const todo = todoItems.find(item => item.id === id);
    if (!todo) return;

    // If item is being completed
    if (!todo.completed) {
      // Start the check animation
      setCheckingItems(prev => [...prev, id]);
      // Add to pending move items
      setPendingMoveItems(prev => [...prev, id]);
      
      // Call the toggle handler to update completion status
      onToggleComplete(id);
      
      // Add completion timestamp immediately
      setCompletionTimes(prev => [...prev, { id, timestamp: Date.now() }]);
    } else {
      // If unchecking, remove completion time and call toggle handler
      setCompletionTimes(prev => prev.filter(item => item.id !== id));
      setPendingMoveItems(prev => prev.filter(itemId => itemId !== id));
      onToggleComplete(id);
    }
  };

  const handleCheckAnimationEnd = (id: string) => {
    setCheckingItems(prev => prev.filter(itemId => itemId !== id));
    // After check animation, wait a moment then remove from pending
    setTimeout(() => {
      setPendingMoveItems(prev => prev.filter(itemId => itemId !== id));
    }, 50); // Small delay to ensure smooth transition
  };

  const sortTodos = (todos: TodoItem[]) => {
    // Separate completed and uncompleted items
    const completed = todos.filter(todo => 
      todo.completed && !pendingMoveItems.includes(todo.id)
    );
    const uncompleted = todos.filter(todo => 
      !todo.completed || pendingMoveItems.includes(todo.id)
    );

    // Sort completed items by timestamp
    const sortedCompleted = completed.sort((a, b) => {
      const aTime = completionTimes.find(t => t.id === a.id)?.timestamp || 0;
      const bTime = completionTimes.find(t => t.id === b.id)?.timestamp || 0;
      return aTime - bTime; // Earlier timestamps go to the top
    });

    // Return uncompleted items first, then sorted completed items
    return [...uncompleted, ...sortedCompleted];
  };

  const toggleDayExpanded = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {days.map((day) => {
          const dayTodos = todoItems.filter((item) => item.day === day);
          const sortedDayTodos = sortTodos(dayTodos);

          return (
            <div key={day} className="mb-4 last:mb-0 border rounded-lg overflow-hidden">
              <button
                className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-400 flex justify-between items-center"
                onClick={() => toggleDayExpanded(day)}
              >
                <h3 className="text-lg font-medium text-gray-900">{day}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {dayTodos.filter((t) => t.completed).length}/{dayTodos.length} completed
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      expandedDays[day] ? 'transform rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {expandedDays[day] && (
                <div className="divide-y">
                  {sortedDayTodos.length > 0 ? (
                    sortedDayTodos.map((todo) => (
                      <TodoItemComponent 
                        key={todo.id} 
                        todo={todo} 
                        onToggleComplete={handleToggleComplete}
                        onCheckAnimationEnd={() => handleCheckAnimationEnd(todo.id)}
                        isChecking={checkingItems.includes(todo.id)}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No tasks for {day}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Any Day Tasks */}
        {todoItems.filter((item) => item.day === 'Any Day').length > 0 && (
          <div className="mt-4 mb-4 last:mb-0 border rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => toggleDayExpanded('Any Day')}
            >
              <h3 className="text-lg font-medium text-gray-900">Any Day</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {todoItems.filter((t) => t.day === 'Any Day' && t.completed).length}/
                  {todoItems.filter((t) => t.day === 'Any Day').length} completed
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    expandedDays['Any Day'] ? 'transform rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {expandedDays['Any Day'] && (
              <div className="divide-y">
                {sortTodos(todoItems.filter((item) => item.day === 'Any Day'))
                  .map((todo) => (
                    <TodoItemComponent 
                      key={todo.id} 
                      todo={todo} 
                      onToggleComplete={handleToggleComplete}
                      onCheckAnimationEnd={() => handleCheckAnimationEnd(todo.id)}
                      isChecking={checkingItems.includes(todo.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface TodoItemComponentProps {
  todo: TodoItem;
  onToggleComplete: (id: string) => void;
  onCheckAnimationEnd: () => void;
  isChecking: boolean;
}

const TodoItemComponent: React.FC<TodoItemComponentProps> = ({ 
  todo, 
  onToggleComplete, 
  onCheckAnimationEnd,
  isChecking
}) => {
  return (
    <div
      className={`p-4 transition-all duration-1000 ${
        todo.completed ? 'bg-green-50' : 'bg-white'
      } ${isChecking ? 'animate-check-todo' : ''}`}
      onAnimationEnd={onCheckAnimationEnd}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h4
            className={`font-medium transition-all duration-1000 ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </h4>

          {todo.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">
                <span className="text-blue-500 mr-1">•</span> Suggested:
              </p>
              <ul className="mt-1 space-y-1">
                {todo.suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className={`text-sm pl-4 transition-all duration-1000 ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                    }`}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <button
            className={`h-6 w-6 rounded-full border transition-all duration-1000 ${
              todo.completed
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-gray-300'
            } flex items-center justify-center`}
            onClick={() => onToggleComplete(todo.id)}
          >
            {todo.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTodoList;