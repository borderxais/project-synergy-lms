import { ref, set, get } from 'firebase/database';
import { db } from './index';
import { ProgressState } from '../../types/progress';

export const progressService = {
  async saveProgress(userId: string, progress: ProgressState) {
    try {
      await set(ref(db, `progress/${userId}`), {
        ...progress,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  async loadProgress(userId: string) {
    try {
      const snapshot = await get(ref(db, `progress/${userId}`));
      return snapshot.val();
    } catch (error) {
      console.error('Error loading progress:', error);
      throw error;
    }
  }
};