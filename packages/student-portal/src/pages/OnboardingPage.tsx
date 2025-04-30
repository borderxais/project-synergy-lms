import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../components/onboarding/OnboardingLayout";
import { GeneralInfoStep } from "../components/onboarding/steps/GeneralInfoStep";
import { HighSchoolStep } from "../components/onboarding/steps/HighSchoolStep";
import { MiddleSchoolStep } from "../components/onboarding/steps/MiddleSchoolStep";
import { InterestsStep } from "../components/onboarding/steps/InterestsStep";
import { CollegePreferencesStep } from "../components/onboarding/steps/CollegePreferencesStep";
import { useAuth } from "../hooks/useAuth";
import { API_SERVICE_URL } from "../config";
import { OnboardingFormData, Gender, SchoolType, TestType, TestScore } from "../types/onboarding";

interface User {
  id: string;
}

interface ExtendedOnboardingFormData extends OnboardingFormData {
  recommendations?: any[];
}

const DEFAULT_FORM_DATA: ExtendedOnboardingFormData = {
  generalInfo: {
    firstName: '',
    lastName: '',
    gender: 'PreferNotToSay' as Gender,
    grade: 0,
    currentSchool: '',
    schoolType: 'Public' as SchoolType,
  },
  highSchoolProfile: {
    gpa: undefined,
    plannedTests: [],
    studyStylePreference: [],
    currentClasses: [],
    extracurriculars: [],
  },
  middleSchoolTarget: {
    targetHighSchools: [],
    studyStylePreference: [],
    currentClasses: [],
    extracurriculars: [],
  },
  interests: [],
  collegePreferences: {
    targetSchools: [],
    schoolCategories: [],
    earlyDecision: 'none',
  },
  errors: {},
  recommendations: [],
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLoadedRecommendations, setHasLoadedRecommendations] = useState(false);
  const [formData, setFormData] = useState<ExtendedOnboardingFormData>(DEFAULT_FORM_DATA);

  const updateFormData = (updates: Partial<ExtendedOnboardingFormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updates,
      errors: {}, // Clear errors when updating data
    }));
  };

  const isHighSchoolStudent = () => {
    return formData.generalInfo.grade >= 9;
  };

  const getTotalSteps = () => {
    if (isHighSchoolStudent()) {
      return 4; // General Info -> High School Profile -> Interests -> College Preferences
    } else {
      return 3; // General Info -> Middle School Target -> Interests
    }
  };

  const handleNext = async () => {
    // Validate current step
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      // Validate GeneralInfo step
      if (!formData.generalInfo.firstName?.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.generalInfo.lastName?.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.generalInfo.gender) {
        errors.gender = 'Gender is required';
      }
      if (!formData.generalInfo.grade) {
        errors.grade = 'Grade is required';
      }
      if (!formData.generalInfo.currentSchool?.trim()) {
        errors.currentSchool = 'Current school is required';
      }
      if (!formData.generalInfo.schoolType) {
        errors.schoolType = 'School type is required';
      }
    }

    if (Object.keys(errors).length > 0) {
      updateFormData({ errors });
      return;
    }

    // If we're on the HighSchoolProfile step, generate recommendations before proceeding
    if (currentStep === 3 && isHighSchoolStudent()) {
      try {
        setIsGenerating(true);
        setHasLoadedRecommendations(false);
        const response = await fetch(`${API_SERVICE_URL}/api/recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user?.uid, // Firebase user ID
            gpa: formData.highSchoolProfile?.gpa,
            interests: formData.interests || [],
            sat: formData.highSchoolProfile?.testScores?.find((test: TestScore) => test.testType === 'SAT')?.score,
            act: formData.highSchoolProfile?.testScores?.find((test: TestScore) => test.testType === 'ACT')?.score,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate recommendations');
        }

        const recommendations = await response.json();
        // Store recommendations and proceed only after successful generation
        console.log('Got recommendations:', recommendations.recommendations);
        updateFormData({
          recommendations: recommendations.recommendations,
        });
        setHasLoadedRecommendations(true);
      } catch (error) {
        console.error('Error generating recommendations:', error);
        updateFormData({ 
          errors: { recommendations: 'Failed to generate recommendations. Please try again.' }
        });
        return;
      } finally {
        setIsGenerating(false);
      }
    }

    // Clear errors and proceed
    updateFormData({ errors: {} });
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Remove the profile data that doesn't apply to the student's grade level
      const submissionData = {
        ...formData,
        highSchoolProfile: isHighSchoolStudent() ? formData.highSchoolProfile : undefined,
        middleSchoolTarget: !isHighSchoolStudent() ? formData.middleSchoolTarget : undefined,
        collegePreferences: isHighSchoolStudent() ? formData.collegePreferences : undefined,
      };

      const response = await fetch(`${API_SERVICE_URL}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...submissionData,
          userId: user?.id,
        }),
      });

      console.log('Onboarding response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit onboarding data');
      }

      const result = await response.json();
      console.log('Onboarding response data:', JSON.stringify(result, null, 2));
      
      // Navigate to the data retrieval page
      console.log('Attempting navigation to /data-retrieval');
      navigate("/data-retrieval", { 
        state: { 
          onboardingData: submissionData,
          analysisId: user?.id
        }
      });
      console.log('Navigation called');
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      updateFormData({ 
        errors: { 
          submit: error instanceof Error ? error.message : "Failed to submit onboarding data" 
        } 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <InterestsStep
            interests={formData.interests || []}
            onUpdate={(interests) => updateFormData({ interests })}
            errors={formData.errors || {}}
          />
        );
      case 3:
        if (isHighSchoolStudent()) {
          return (
            <HighSchoolStep
              formData={formData.highSchoolProfile || {}}
              updateFormData={(data) => updateFormData({ highSchoolProfile: data })}
            />
          );
        } else {
          return (
            <MiddleSchoolStep
              formData={formData.middleSchoolTarget || {}}
              updateFormData={(data) => updateFormData({ middleSchoolTarget: data })}
            />
          );
        }
      case 4:
        if (isHighSchoolStudent()) {
          return (
            <CollegePreferencesStep
              formData={formData.collegePreferences!}
              updateFormData={(data) => updateFormData({ collegePreferences: data })}
              errors={formData.errors}
              recommendations={formData.recommendations || []}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={getTotalSteps()}
      onNext={currentStep === getTotalSteps() ? handleSubmit : handleNext}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      isGenerating={isGenerating}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}