import { ProgressState } from '../../types/progress';
import { STORAGE_KEYS } from './constants';

export const progressStorage = {
  save: (progress: ProgressState): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  load: (): ProgressState | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }
};