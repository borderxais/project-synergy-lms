import { ProgressState } from '../../types/progress';

export interface ProgressUpdate {
  userId: string;
  progress: ProgressState;
}

export interface ProgressResponse {
  success: boolean;
  message?: string;
  data?: ProgressState;
  error?: any;
}