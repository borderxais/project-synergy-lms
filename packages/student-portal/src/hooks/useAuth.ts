import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db, googleProvider } from '@privschool-lms/common/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  uid: string;
  email: string;
  displayName: string;
  isOnboarded: boolean;
  studentProfile?: {
    generalInfo: {
      firstName: string;
      lastName: string;
      currentSchool: string;
      schoolType: string;
      grade: number;
      gender: string;
    };
    highSchoolProfile?: {
      gpa: number;
      weightedGpa?: number;
      psat?: {
        score: string;
        percentile: string;
      };
      currentClasses?: any[];
      plannedTests?: string[];
      preferredTestPrepMethod?: string;
      studyStylePreference?: string[];
      testType?: string;
      needsEnglishProficiency?: boolean;
    };
    interests?: string[];
    extracurriculars?: any[];
    collegePreferences?: {
      targetSchools?: string[];
      earlyDecision?: string;
      schoolCategories?: string[];
      applicationDeadline?: string;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  setAuthState: (state: { user: User; token: string; isAuthenticated: boolean }) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        console.log('[AUTH] Setting auth state:', { user, token: token?.substring(0, 10) });
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
        });
      },
      setAuthState: (state) => {
        console.log('[AUTH] Setting full auth state:', { 
          user: state.user,
          token: state.token?.substring(0, 10),
          isAuthenticated: state.isAuthenticated 
        });
        set(state);
      },
      logout: async () => {
        console.log('[AUTH] Logging out');
        try {
          await auth.signOut();
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('[AUTH] Error during logout:', error);
        }
      },
      updateUser: (userData) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      login: async (email: string, password: string) => {
        try {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const { user: firebaseUser } = userCredential;
          
          // Get the ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData: User;
          
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          } else {
            // Create user document if it doesn't exist
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || email.split('@')[0],
              isOnboarded: false,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...userData,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              signInMethod: 'email'
            });
          }
          
          // Update auth state
          set({
            user: userData,
            token: idToken,
            isAuthenticated: true,
          });
          
          // Store auth data
          localStorage.setItem('auth_token', idToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          
          return true;
        } catch (error) {
          console.error('[AUTH] Login error:', error);
          return false;
        }
      },
      loginWithGoogle: async () => {
        try {
          // Sign in with Google
          const result = await signInWithPopup(auth, googleProvider);
          const { user: firebaseUser } = result;
          
          // Get the ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData: User;
          
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
            // Update last login
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              lastLoginAt: serverTimestamp(),
              signInMethod: 'google'
            }, { merge: true });
          } else {
            // Create user document if it doesn't exist
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              isOnboarded: false,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...userData,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              signInMethod: 'google'
            });
          }
          
          // Update auth state
          set({
            user: userData,
            token: idToken,
            isAuthenticated: true,
          });
          
          // Store auth data
          localStorage.setItem('auth_token', idToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          
          return true;
        } catch (error) {
          console.error('[AUTH] Google login error:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);