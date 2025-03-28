export interface TaskProgress {
  taskId: string;
  completed: boolean;
  completedAt: string | null; // Changed from optional to nullable
  monthKey: string;
}

export interface MilestoneProgress {
  milestoneId: string;
  progress: number;
  completed: boolean;
  completedAt: string | null; // Changed from optional to nullable
  monthKey: string;
}

export interface ProgressState {
  tasks: Record<string, TaskProgress>;
  milestones: Record<string, MilestoneProgress>;
  overallProgress: number;
}

export type ProgressAction = 
  | { type: 'TOGGLE_TASK'; payload: { taskId: string; monthKey: string } }
  | { type: 'UPDATE_MILESTONE'; payload: { milestoneId: string; progress: number } }
  | { type: 'RESET_PROGRESS' };