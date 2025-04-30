import React from "react";

interface LoadingPageProps {
  title: string;
  description: string;
}

export function LoadingPage({ title, description }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">
        {description}
      </p>
    </div>
  );
}
