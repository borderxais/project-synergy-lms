import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TeacherHeader } from '../../components/TeacherHeader';
import { NavigationTabs } from '../../components/NavigationTabs';
import { Sidebar } from '../teachers/Sidebar';

const CourseInfo = () => {
  const [name, setName] = useState('高等数学（一）');
  const [schedule, setSchedule] = useState('每周一、三 10:00-11:30');
  const [instructor, setInstructor] = useState('李老师');
  const [desc, setDesc] = useState(
    '本课程将涵盖微积分基础、函数极限、导数及其应用等内容，帮助学生建立数学分析能力。'
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">课程信息</h2>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">课程名称</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">授课时间</label>
        <input value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">任课教师</label>
        <input value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">课程描述</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="w-full border rounded px-3 py-1 text-sm" />
      </div>
    </div>
  );
};

const Announcements = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">公告</h2>
      <button
        onClick={() => navigate(`/courses/${courseId}/create-announcement`)}
        className="text-sm text-indigo-600 hover:underline"
      >
        ➕ 新建公告
      </button>
      <ul className="space-y-2 text-sm text-gray-700">
        <li
          className="hover:underline cursor-pointer"
          onClick={() => navigate(`/courses/${courseId}/announcements/1/edit`)}
        >
          📢 第3周将进行小测，请同学们准备。
        </li>
        <li
          className="hover:underline cursor-pointer"
          onClick={() => navigate(`/courses/${courseId}/announcements/2/edit`)}
        >
          📢 本周作业已发布，请于周五前提交。
        </li>
      </ul>
    </div>
  );
};


const Assignments = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">作业</h2>
      <button
        onClick={() => navigate(`/courses/${courseId}/create-assignment`)}
        className="text-sm text-indigo-600 hover:underline"
      >
        ➕ 新建作业
      </button>
      <ul className="space-y-2 text-sm text-gray-700">
        <li
          className="hover:underline cursor-pointer"
          onClick={() => navigate(`/courses/${courseId}/assignments/1/edit`)}
        >
          📘 作业一：函数极限计算，截止日期：2025-04-10
        </li>
        <li
          className="hover:underline cursor-pointer"
          onClick={() => navigate(`/courses/${courseId}/assignments/2/edit`)}
        >
          📘 作业二：导数定义与几何意义，截止日期：2025-04-17
        </li>
      </ul>
    </div>
  );
};


const Students = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">学生列表</h2>
      <button
        onClick={() => navigate('/students')}
        className="text-sm text-indigo-600 hover:underline"
      >
        🔍 查看全部学生
      </button>
      <ul className="text-sm text-gray-700 space-y-1">
        <li className="hover:underline cursor-pointer" onClick={() => navigate(`/students/1`)}>
          👤 张小明（出勤率：96%，参与度：85%）
        </li>
        <li className="hover:underline cursor-pointer" onClick={() => navigate(`/students/2`)}>
          👤 李华（出勤率：92%，参与度：78%）
        </li>
      </ul>
    </div>
  );
};

const Grades = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">成绩管理</h2>
      <button
        onClick={() => navigate(`/courses/${courseId}/gradebook`)}
        className="text-sm text-indigo-600 hover:underline"
      >
        📊 查看成绩表
      </button>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">学生</th>
            <th className="border px-4 py-2">作业一</th>
            <th className="border px-4 py-2">作业二</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/students/1`)}>
            <td className="border px-4 py-2">张小明</td>
            <td className="border px-4 py-2">88</td>
            <td className="border px-4 py-2">92</td>
          </tr>
          <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/students/2`)}>
            <td className="border px-4 py-2">李华</td>
            <td className="border px-4 py-2">81</td>
            <td className="border px-4 py-2">87</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

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
          <Sidebar />
        </div>
      </div>
    </div>
  );
}