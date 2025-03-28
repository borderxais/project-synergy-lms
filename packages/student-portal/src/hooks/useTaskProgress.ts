import { useProgress } from '../context/ProgressContext';

export function useTaskProgress(monthKey: string) {
  const { state, dispatch } = useProgress();

  const toggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { taskId, monthKey } });
  };

  const getTaskProgress = (taskId: string) => {
    return state.tasks[taskId]?.completed || false;
  };

  const getMilestoneProgress = (milestoneId: string) => {
    return state.milestones[milestoneId]?.progress || 0;
  };

  const getOverallProgress = () => {
    return state.overallProgress;
  };

  return {
    toggleTask,
    getTaskProgress,
    getMilestoneProgress,
    getOverallProgress
  };
}