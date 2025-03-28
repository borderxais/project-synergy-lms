import React from 'react';
import { Users, UserCheck, Heart } from 'lucide-react';
import { StudentCard } from '../../components/StudentCard';
import { students } from '../../data/teacher';

export function StudentList() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">班级状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-700">班级人数</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">45人</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <UserCheck className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-700">出勤率</span>
            </div>
            <p className="text-2xl font-bold text-green-600">96%</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-gray-700">情绪指数</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">85%</p>
          </div>
        </div>
        <div className="space-y-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
}