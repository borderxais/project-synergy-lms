import React from 'react';

interface DashboardHeroProps {
  user: {
    firstName: string;
    lastName: string;
    grade: number;
    currentSchool: string;
    targetSchools: string[];
  };
}

export function DashboardHero({ user }: DashboardHeroProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user.firstName}!
      </h1>
      <p className="text-gray-600">
        Grade {user.grade} student at {user.currentSchool}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {user.targetSchools.map((school) => (
          <span
            key={school}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {school}
          </span>
        ))}
      </div>
    </div>
  );
}