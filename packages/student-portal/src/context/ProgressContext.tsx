import React, { createContext, useContext, useReducer } from 'react';
import { ProgressState, ProgressAction } from '../types/progress';
import { MONTHLY_DATA } from '../data/timeline/monthlyData';

const initialState: ProgressState = {
  tasks: {},
  milestones: {},
  overallProgress: 0
};

function calculateMilestoneProgress(
  tasks: Record<string, boolean>,
  monthKey: string,
  milestoneId: string
): number {
  const monthData = MONTHLY_DATA[monthKey];
  if (!monthData) return 0;

  const milestone = monthData.milestones.find(m => m.id === milestoneId);
  if (!milestone) return 0;

  const relatedWeeks = milestone.relatedWeeks;
  const milestoneTasks = monthData.weeks
    .filter(week => relatedWeeks.includes(week.weekNumber))
    .flatMap(week => week.tasks);

  if (milestoneTasks.length === 0) return 0;

  const completedTasks = milestoneTasks.filter(task => tasks[task.id]).length;
  return Math.round((completedTasks / milestoneTasks.length) * 100);
}

function calculateOverallProgress(tasks: Record<string, boolean>): number {
  const allTasks = Object.values(MONTHLY_DATA).flatMap(month => 
    month.weeks.flatMap(week => week.tasks)
  );
  
  if (allTasks.length === 0) return 0;
  
  const completedTasks = allTasks.filter(task => tasks[task.id]).length;
  return Math.round((completedTasks / allTasks.length) * 100);
}

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'TOGGLE_TASK': {
      const { taskId, monthKey } = action.payload;
      const monthData = MONTHLY_DATA[monthKey];
      if (!monthData) return state;

      const currentTask = state.tasks[taskId];
      const newCompleted = !currentTask?.completed;

      const newTasks = {
        ...state.tasks,
        [taskId]: {
          taskId,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null,
          monthKey
        }
      };

      // Update milestone progress
      const newMilestones = { ...state.milestones };
      monthData.milestones.forEach(milestone => {
        const progress = calculateMilestoneProgress(
          Object.fromEntries(Object.entries(newTasks).map(([id, task]) => [id, task.completed])),
          monthKey,
          milestone.id
        );
        const completed = progress === 100;
        
        newMilestones[milestone.id] = {
          milestoneId: milestone.id,
          progress,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
          monthKey
        };
      });

      return {
        tasks: newTasks,
        milestones: newMilestones,
        overallProgress: calculateOverallProgress(
          Object.fromEntries(Object.entries(newTasks).map(([id, task]) => [id, task.completed]))
        )
      };
    }

    case 'RESET_PROGRESS':
      return initialState;

    default:
      return state;
  }
}

const ProgressContext = createContext<{
  state: ProgressState;
  dispatch: React.Dispatch<ProgressAction>;
} | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}