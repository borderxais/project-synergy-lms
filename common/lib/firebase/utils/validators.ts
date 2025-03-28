import { ProgressState } from '../../../types/progress';

export const validateProgressData = (progress: ProgressState): boolean => {
  console.log('Validating progress data:', progress);

  if (!progress) {
    console.error('Progress data is null or undefined');
    return false;
  }
  
  // Validate tasks object
  if (!progress.tasks || typeof progress.tasks !== 'object') {
    console.error('Invalid tasks object:', progress.tasks);
    return false;
  }
  
  // Validate milestones object
  if (!progress.milestones || typeof progress.milestones !== 'object') {
    console.error('Invalid milestones object:', progress.milestones);
    return false;
  }
  
  // Validate overall progress
  if (typeof progress.overallProgress !== 'number' || 
      progress.overallProgress < 0 || 
      progress.overallProgress > 100) {
    console.error('Invalid overall progress:', progress.overallProgress);
    return false;
  }

  console.log('Progress data validation passed');
  return true;
};

export const validateUserId = (userId: string): boolean => {
  console.log('Validating user ID:', userId);
  const isValid = Boolean(userId && typeof userId === 'string' && userId.length > 0);
  
  if (!isValid) {
    console.error('Invalid user ID:', userId);
  }
  
  return isValid;
};