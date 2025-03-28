import { useCallback, useEffect, useRef } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@privschool-lms/common/lib/firebase';
import { progressService } from '@privschool-lms/common/lib/firebase/services/progressService';
import { useProgress } from '../context/ProgressContext';

export function useFirebaseProgress(userId: string = 'demo-user') {
  const { state, dispatch } = useProgress();
  const isInitialMount = useRef(true);

  // Load progress from Firebase
  useEffect(() => {
    console.log('Setting up Firebase listener for user:', userId);
    const progressRef = ref(db, `progress/${userId}`);
    
    const unsubscribe = onValue(progressRef, (snapshot) => {
      console.log('Received Firebase update:', snapshot.val());
      const data = snapshot.val();
      
      if (data?.tasks) {
        console.log('Processing tasks:', Object.keys(data.tasks).length);
        Object.entries(data.tasks).forEach(([taskId, taskData]: [string, any]) => {
          console.log('Processing task:', taskId, taskData);
          if (taskData.completed) {
            dispatch({
              type: 'TOGGLE_TASK',
              payload: { taskId, monthKey: taskData.monthKey }
            });
          }
        });
      }
    }, (error) => {
      console.error('Firebase onValue error:', error);
    });

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, [dispatch, userId]);

  // Save progress to Firebase
  const saveProgress = useCallback(async () => {
    if (!state) {
      console.warn('No state available to save');
      return;
    }

    console.log('Preparing to save progress:', {
      userId,
      tasksCount: Object.keys(state.tasks).length,
      milestonesCount: Object.keys(state.milestones).length,
      overallProgress: state.overallProgress
    });

    try {
      const result = await progressService.saveProgress({
        userId,
        progress: state
      });
      
      if (!result.success) {
        console.error('Failed to save progress:', result.error);
      } else {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error in saveProgress:', error);
    }
  }, [state, userId]);

  // Save progress whenever it changes, but skip the initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log('State changed, triggering save');
    saveProgress();
  }, [state, saveProgress]);

  return { saveProgress };
}