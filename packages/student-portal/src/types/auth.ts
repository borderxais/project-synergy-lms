export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isOnboarded?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}