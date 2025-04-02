import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { NavigationTabs } from '../../components/NavigationTabs';
import { ClassesList } from './ClassesList';
import { StudentList } from './StudentList';
import { InsightList } from './InsightList';
import { Sidebar } from './Sidebar';

const tabs = [
  { id: 'classes', label: '课程管理' },
  { id: 'students', label: '学生状态' },
  { id: 'insights', label: '教学洞察' }
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('classes');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="教师工作台"
          description="管理作业、关注学生状态、获取教学建议"
        />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'classes' && <ClassesList />}
            {activeTab === 'students' && <StudentList />}
            {activeTab === 'insights' && <InsightList />}
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}