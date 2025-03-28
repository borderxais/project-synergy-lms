import React from 'react';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Private School Prep</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Private School Prep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}