import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import { ProgressState } from '../../../types/progress';
import { ProgressResponse, ProgressUpdate } from '../types';
import { logError, logInfo } from '../utils/logger';
import { validateProgressData, validateUserId } from '../utils/validators';
import { sanitizeProgressData } from '../utils/sanitizer';

class ProgressService {
  private getProgressRef(userId: string) {
    return ref(db, `progress/${userId}`);
  }

  async saveProgress({ userId, progress }: ProgressUpdate): Promise<ProgressResponse> {
    try {
      console.log('saveProgress called with:', { userId, progress });

      // Validate inputs
      if (!validateUserId(userId)) {
        throw new Error('Invalid user ID provided');
      }

      if (!validateProgressData(progress)) {
        throw new Error('Invalid progress data structure');
      }

      logInfo('saveProgress', 'Attempting to save progress', { userId });

      // Sanitize the progress data before saving
      const sanitizedProgress = sanitizeProgressData(progress);
      
      const progressRef = this.getProgressRef(userId);
      const progressData = {
        ...sanitizedProgress,
        lastUpdated: new Date().toISOString()
      };

      console.log('Writing sanitized data to Firebase:', progressData);
      await set(progressRef, progressData);
      
      logInfo('saveProgress', 'Progress saved successfully', { userId });
      
      return {
        success: true,
        message: 'Progress saved successfully',
        data: progressData
      };
    } catch (error) {
      const errorDetails = logError('saveProgress', error);
      return {
        success: false,
        message: 'Failed to save progress',
        error: errorDetails
      };
    }
  }

  // ... rest of the class implementation remains the same
}

export const progressService = new ProgressService();