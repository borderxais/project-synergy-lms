import React from 'react';
import { Task } from '../../../types';
import { TaskCard } from './TaskCard';

interface WeekTasksProps {
  tasks: Task[];
  monthKey: string;
}

export function WeekTasks({ tasks, monthKey }: WeekTasksProps) {
  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} monthKey={monthKey} />
      ))}
    </div>
  );
}