import React from 'react';
import { Card } from '../../ui/Card';
import { TaskCard } from './TaskCard';
import { Task } from '../../../types';

interface TasksListProps {
  tasks: Task[];
  monthKey: string;
}

export function TasksList({ tasks, monthKey }: TasksListProps) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Monthly Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            monthKey={monthKey}
          />
        ))}
      </div>
    </Card>
  );
}