import { ProgressState, TaskProgress, MilestoneProgress } from '../../../types/progress';

function sanitizeTaskProgress(task: TaskProgress): TaskProgress {
  return {
    taskId: task.taskId,
    completed: Boolean(task.completed),
    completedAt: task.completedAt || null,
    monthKey: task.monthKey
  };
}

function sanitizeMilestoneProgress(milestone: MilestoneProgress): MilestoneProgress {
  return {
    milestoneId: milestone.milestoneId,
    progress: Number(milestone.progress) || 0,
    completed: Boolean(milestone.completed),
    completedAt: milestone.completedAt || null,
    monthKey: milestone.monthKey
  };
}

export function sanitizeProgressData(progress: ProgressState): ProgressState {
  // Create a new object with sanitized data
  const sanitized: ProgressState = {
    tasks: {},
    milestones: {},
    overallProgress: Number(progress.overallProgress) || 0
  };

  // Sanitize tasks
  Object.entries(progress.tasks).forEach(([key, task]) => {
    sanitized.tasks[key] = sanitizeTaskProgress(task);
  });

  // Sanitize milestones
  Object.entries(progress.milestones).forEach(([key, milestone]) => {
    sanitized.milestones[key] = sanitizeMilestoneProgress(milestone);
  });

  return sanitized;
}