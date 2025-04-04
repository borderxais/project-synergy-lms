import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@privschool-lms/common/lib/firebase';
import { getAuth } from 'firebase/auth';

export const DataRetrievalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  const validateStudentProfile = (profile: any) => {
    if (!profile?.generalInfo) {
      console.log('[DataRetrieval] Missing generalInfo');
      return false;
    }

    const requiredFields = ['firstName', 'lastName', 'grade', 'currentSchool'];
    const missingFields = requiredFields.filter(
      field => !profile.generalInfo[field]
    );

    if (missingFields.length > 0) {
      console.log('[DataRetrieval] Missing required fields:', missingFields);
      return false;
    }

    return true;
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated || !auth.currentUser) {
        navigate('/login');
        return;
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setError('User profile not found.');
        navigate('/onboarding');
        return;
      }

      const userData = userDoc.data();
      console.log('[DataRetrieval] Raw user data:', userData);

      if (!userData.studentProfile || !validateStudentProfile(userData.studentProfile)) {
        console.log('[DataRetrieval] Invalid student profile');
        setError('Please complete your profile information.');
        navigate('/onboarding');
        return;
      }

      // Transform the data to match our expected structure
      const transformedData = {
        ...userData,
        studentProfile: {
          ...userData.studentProfile,
          generalInfo: {
            firstName: userData.studentProfile.generalInfo.firstName,
            lastName: userData.studentProfile.generalInfo.lastName,
            grade: userData.studentProfile.generalInfo.grade,
            currentSchool: userData.studentProfile.generalInfo.currentSchool,
            gender: userData.studentProfile.generalInfo.gender || '',
            schoolType: userData.studentProfile.generalInfo.schoolType || ''
          },
          highSchoolProfile: userData.studentProfile.highSchoolProfile || {
            gpa: 0,
            weightedGpa: 0,
            currentClasses: []
          },
          interests: userData.studentProfile.interests || [],
          collegePreferences: userData.studentProfile.collegePreferences || {
            targetSchools: [],
            earlyDecision: '',
            schoolCategories: []
          }
        },
        tasks: userData.tasks || []
      };

      console.log('[DataRetrieval] Transformed data:', transformedData);

      // Update auth context and navigate to dashboard
      updateUser({
        ...user,
        ...transformedData,
        lastUpdated: new Date().toISOString()
      });

      navigate('/home-dashboard', {
        replace: true,
        state: {
          userData: transformedData,
          dataTimestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[DataRetrieval] Error:', error);
      setError('Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user, isAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => loadUserData()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Data</h2>
        <p className="text-gray-600">Retrieving your profile information...</p>
      </div>
    </div>
  );
};
