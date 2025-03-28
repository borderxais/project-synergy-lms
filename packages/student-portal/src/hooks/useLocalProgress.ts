import { useEffect, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { progressStorage } from '@privschool-lms/common/lib/storage/progressStorage';

export function useLocalProgress() {
  const { state, dispatch } = useProgress();
  const isInitialMount = useRef(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = progressStorage.load();
    if (savedProgress) {
      // Restore tasks
      Object.entries(savedProgress.tasks).forEach(([taskId, taskData]) => {
        if (taskData.completed) {
          dispatch({
            type: 'TOGGLE_TASK',
            payload: { taskId, monthKey: taskData.monthKey }
          });
        }
      });
    }
  }, [dispatch]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (state) {
      progressStorage.save(state);
    }
  }, [state]);

  return { saveProgress: () => progressStorage.save(state) };
}