import React from 'react';

export function ProgressOverview() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Practice Tests Completed</span>
            <span className="text-sm text-gray-500">2/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Study Hours</span>
            <span className="text-sm text-gray-500">15/40</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Assignments Completed</span>
            <span className="text-sm text-gray-500">8/12</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '66.7%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Completed Math Practice Test</span>
            <span className="ml-auto text-gray-500">2h ago</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Reviewed English Vocabulary</span>
            <span className="ml-auto text-gray-500">Yesterday</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Started Science Module</span>
            <span className="ml-auto text-gray-500">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}