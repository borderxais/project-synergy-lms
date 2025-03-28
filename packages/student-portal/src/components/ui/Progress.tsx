import React from 'react';

interface ProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function Progress({ value = 0, size = 'md', showLabel = true }: ProgressProps) {
  // Ensure value is a number and clamp between 0 and 100
  const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, ((100 - normalizedValue) / 100) * circumference);

  // Convert to string to avoid React warning about NaN
  const strokeDashoffset = progress.toString();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={radius * 2.5}
        height={radius * 2.5}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedValue}
        role="progressbar"
      >
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius * 1.25}
          cy={radius * 1.25}
        />
        <circle
          className="text-blue-600 transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius * 1.25}
          cy={radius * 1.25}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-medium">{Math.round(normalizedValue)}%</span>
      )}
    </div>
  );
}