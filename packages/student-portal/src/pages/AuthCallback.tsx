import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@privschool-lms/common/lib/firebase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthState, fetchUserData } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[AUTH] Callback component mounted');
      
      try {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        console.log('[AUTH] Raw URL params received');

        if (!token || !userStr) {
          console.error('[AUTH] Missing token or user data in URL params');
          navigate('/login', { replace: true });
          return;
        }

        // Decode the URL-encoded token and user data
        const decodedToken = decodeURIComponent(token);
        const decodedUserStr = decodeURIComponent(userStr);
        
        console.log('[AUTH] Successfully decoded URL parameters');

        const user = JSON.parse(decodedUserStr);
        console.log('[AUTH] Parsed user data:', { ...user, token: decodedToken.substring(0, 10) + '...' });

        // Fetch additional user data from Firestore
        const firestoreData = await fetchUserData(user.uid);
        
        if (firestoreData) {
          // Merge Google auth data with Firestore data
          const enrichedUser = {
            ...user,
            ...firestoreData,
          };

          // Store auth data
          localStorage.setItem('auth_token', decodedToken);
          localStorage.setItem('auth_user', JSON.stringify(enrichedUser));
          console.log('[AUTH] Stored enriched auth data in localStorage');
          
          // Update auth context with enriched user data
          setAuthState({
            isAuthenticated: true,
            user: enrichedUser,
            token: decodedToken
          });
          console.log('[AUTH] Updated auth context with enriched user data');

          // Check if user has completed onboarding by looking at Firestore data
          if (!firestoreData.studentProfile?.generalInfo) {
            console.log('[AUTH] New user, redirecting to onboarding');
            navigate('/onboarding', { replace: true });
          } else {
            console.log('[AUTH] Existing user, redirecting to data retrieval');
            navigate('/data-retrieval', { replace: true });
          }
        } else {
          // No Firestore data yet, treat as new user
          localStorage.setItem('auth_token', decodedToken);
          localStorage.setItem('auth_user', JSON.stringify(user));
          
          setAuthState({
            isAuthenticated: true,
            user,
            token: decodedToken
          });
          
          console.log('[AUTH] New user, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('[AUTH] Error processing auth callback:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    if (isProcessing) {
      handleCallback();
    }
  }, [navigate, setAuthState, searchParams, isProcessing, fetchUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <div className="mt-4 text-gray-600">Processing login...</div>
      </div>
    </div>
  );
}
