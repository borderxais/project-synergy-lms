import React, { useState } from 'react';
import { StudentHeader } from '../../components/students/StudentHeader';
import { NavigationTabs } from '../../components/students/NavigationTabs';
import { CourseList } from './CourseList';
import { AssignmentList } from './AssignmentList';
import { Analytics } from './Analytics';

const tabs = [
  { id: 'courses', label: '课程管理' },
  { id: 'assignments', label: '作业测评' },
  { id: 'analytics', label: '学习分析' }
];

export default function StudentLearning() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentHeader 
          title="学习中心"
          description="管理你的课程、作业和学习进度"
        />
        
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'courses' && <CourseList />}
            {activeTab === 'assignments' && <AssignmentList />}
            {activeTab === 'analytics' && <Analytics />}
          </div>

          {/* Sidebar components will be added in the next iteration */}
        </div>
      </div>
    </div>
  );
}