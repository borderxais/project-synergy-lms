import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isSubmitting = false,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-xl font-bold text-gray-900">
            Private School Prep
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {children}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Submitting...'
                : currentStep === totalSteps
                ? 'Submit'
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}