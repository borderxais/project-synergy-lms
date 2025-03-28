import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_SERVICE_URL } from '../config';

const steps = [
  {
    title: 'Analyzing Profile',
    description: 'We are analyzing your academic profile and interests...',
  },
  {
    title: 'Analyzing Schools',
    description: 'Analyzing schools based on your preferences...',
  },
  {
    title: 'Generating Roadmap',
    description: 'Creating a personalized educational roadmap...',
  },
  {
    title: 'Finalizing Dashboard',
    description: 'Preparing your personalized dashboard...',
  },
];

export const RoadmapGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isGeneratingRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000; // 3 seconds
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const generateRoadmap = async () => {
      console.log('[ROADMAP] Starting roadmap generation...');
      
      // Skip if no user data
      if (!user?.student) {
        console.log('[ROADMAP] No user data, skipping');
        return;
      }

      try {
        // Get data from location state or session storage
        const { onboardingData } = location.state || {};
        const storedOnboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
        const finalOnboardingData = onboardingData || storedOnboardingData;

        // First step: Analyze schools
        console.log('[ROADMAP] Analyzing schools...');
        setCurrentStep(1);
        const schoolAnalysisResponse = await fetch(`${API_SERVICE_URL}/analyze-schools`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user?.id?.toString() || '',
          },
          body: JSON.stringify({
            schools: finalOnboardingData.collegePreferences?.targetSchools || [],
            studentProfile: {
              grade: user?.student?.grade,
              interests: user?.student?.interests || [],
              plannedTests: finalOnboardingData.highSchoolProfile?.plannedTests || []
            }
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!schoolAnalysisResponse.ok) {
          const errorData = await schoolAnalysisResponse.json();
          throw new Error(errorData.detail || 'Failed to analyze schools');
        }

        const schoolAnalysis = await schoolAnalysisResponse.json();

        // Second step: Generate roadmap
        console.log('[ROADMAP] Generating roadmap...');
        setCurrentStep(2);
        const roadmapResponse = await fetch(`${API_SERVICE_URL}/generate-roadmap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user?.id?.toString() || '',
          },
          body: JSON.stringify({
            studentProfile: {
              generalInfo: {
                firstName: user?.firstName,
                lastName: user?.lastName,
                gender: user?.student?.gender || 'Unknown',
                grade: user?.student?.grade,
                currentSchool: user?.student?.currentSchool,
                schoolType: user?.student?.schoolType || 'Unknown',
                userId: user?.id
              },
              highSchoolProfile: finalOnboardingData.highSchoolProfile || {},
              interests: user?.student?.interests || [],
              collegePreferences: finalOnboardingData.collegePreferences || {},
              schoolAnalysis: schoolAnalysis || [],
              errors: {},
              ...(finalOnboardingData.middleSchoolTarget && {
                middleSchoolTarget: finalOnboardingData.middleSchoolTarget
              })
            }
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!roadmapResponse.ok) {
          const errorData = await roadmapResponse.json();
          if (roadmapResponse.status === 429) {
            // Handle duplicate request
            console.log('[ROADMAP] Duplicate request detected, attempt:', retryCountRef.current + 1);
            if (retryCountRef.current < MAX_RETRIES) {
              retryCountRef.current++;
              // Show user-friendly message about retry
              setError(`Still generating your roadmap... (Attempt ${retryCountRef.current}/${MAX_RETRIES})`);
              // Wait and try again
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              throw new Error('RETRY');
            } else {
              throw new Error('Roadmap generation is taking longer than expected. Please try again.');
            }
          }
          throw new Error(errorData.detail || 'Failed to generate roadmap');
        }

        // Reset retry count on success
        retryCountRef.current = 0;
        const generatedRoadmapData = await roadmapResponse.json();
        
        // Final step
        setCurrentStep(3);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate to dashboard
        console.log('[ROADMAP] Navigating to dashboard with generated data');
        navigate('/dashboard', { 
          state: { 
            roadmapData: generatedRoadmapData,
            onboardingData: finalOnboardingData
          },
          replace: true 
        });
      } catch (error) {
        console.error('[ROADMAP] Error:', error);
        
        if (error instanceof Error) {
          if (error.message === 'RETRY') {
            // For retry attempts, try again immediately
            generateRoadmap();
            return;
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            setError('Network error. Please check your connection and try again.');
          } else if (error.message.includes('timeout')) {
            setError('Request timed out. Please try again.');
          } else {
            setError(error.message);
          }
        } else {
          setError('An unexpected error occurred. Please try again.');
        }

        // Reset step on non-retry errors
        if (error instanceof Error && error.message !== 'RETRY') {
          setCurrentStep(0);
          retryCountRef.current = 0;
        }
      }
    };

    // Create abort controller
    abortControllerRef.current = new AbortController();
    
    // Start generation if we have user data
    if (user?.student && !isGeneratingRef.current) {
      isGeneratingRef.current = true;
      generateRoadmap();
    }

    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isGeneratingRef.current = false;
      retryCountRef.current = 0;
    };
  }, [user, navigate, location.state]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {steps[currentStep].title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {steps[currentStep].description}
          </p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-right">
                <span className="text-sm font-semibold inline-block text-blue-600">
                  {Math.round((currentStep + 1) * (100 / steps.length))}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{
                  width: `${((currentStep + 1) * 100) / steps.length}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerationPage;
