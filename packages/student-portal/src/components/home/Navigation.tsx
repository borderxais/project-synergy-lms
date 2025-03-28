import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Private School Prep</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}