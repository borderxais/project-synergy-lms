import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { course_sidebar } from './course_sidebar';
import { NavigationTabs } from '../../components/NavigationTabs';

// Placeholder components for each tab section
const CourseInfo = () => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">课程信息</h2>
    <p className="text-sm text-gray-600">在此编辑课程名称、描述、时间安排等基本信息。</p>
  </div>
);

const Announcements = () => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">公告</h2>
    <p className="text-sm text-gray-600">查看、发布和管理课程公告。</p>
  </div>
);

const Assignments = () => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">作业</h2>
    <p className="text-sm text-gray-600">创建和管理学生的课程作业。</p>
  </div>
);

const Students = () => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">学生列表</h2>
    <p className="text-sm text-gray-600">查看已注册学生及其参与状态。</p>
  </div>
);

const Grades = () => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">成绩管理</h2>
    <p className="text-sm text-gray-600">查看和录入学生的课程成绩。</p>
  </div>
);

const tabs = [
  { id: 'info', label: '课程信息' },
  { id: 'announcements', label: '公告' },
  { id: 'assignments', label: '作业' },
  { id: 'students', label: '学生' },
  { id: 'grades', label: '成绩' }
];

export default function CourseManagementPage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="课程管理"
          description="像 Canvas 一样集中管理你的课程模块"
        />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'info' && <CourseInfo />}
            {activeTab === 'announcements' && <Announcements />}
            {activeTab === 'assignments' && <Assignments />}
            {activeTab === 'students' && <Students />}
            {activeTab === 'grades' && <Grades />}
          </div>

          {course_sidebar()}
        </div>
      </div>
    </div>
  );
}
