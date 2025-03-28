import React from 'react';
import { Calendar, ClipboardCheck, BookOpen, Bell, Target, TrendingUp } from 'lucide-react';

export function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Everything You Need for Success
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            A comprehensive platform designed to guide you through every step of the application process.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Calendar}
              title="Monthly Milestones"
              description="Clear monthly goals and deadlines to keep you on track throughout the process."
            />
            <Feature
              icon={ClipboardCheck}
              title="Weekly Tasks"
              description="Break down your goals into manageable weekly tasks with progress tracking."
            />
            <Feature
              icon={BookOpen}
              title="Resource Library"
              description="Access study materials, practice tests, and interview preparation guides."
            />
            <Feature
              icon={Bell}
              title="Smart Reminders"
              description="Never miss a deadline with helpful alerts and notifications."
            />
            <Feature
              icon={Target}
              title="Progress Tracking"
              description="Monitor your application progress with visual indicators and success metrics."
            />
            <Feature
              icon={TrendingUp}
              title="Success Forecasting"
              description="Get insights on your preparation progress and recommendations for improvement."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="relative">
      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
      <p className="mt-2 ml-16 text-base text-gray-500">{description}</p>
    </div>
  );
}