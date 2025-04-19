import React, { useState, useMemo } from 'react';
import { Users, UserCheck, Heart } from 'lucide-react';
import { StudentCard } from '../../components/StudentCard';
import { students, courses } from '../../data/teacher';

const courseStudentMap: Record<string, string[]> = {
  'course-1': ['1', '2'],
  'course-2': ['2', '3'],
  'course-3': ['1', '3']
};

export function StudentList() {
  const [selectedCourse, setSelectedCourse] = useState('course-1');

  const filteredStudents = useMemo(() => {
    const studentIds = courseStudentMap[selectedCourse] || [];
    return students.filter((s) => studentIds.includes(s.id));
  }, [selectedCourse]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">班级状态</h2>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-700">班级人数</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {filteredStudents.length}人
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <UserCheck className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-700">出勤率</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                filteredStudents.reduce((sum, s) => sum + s.attendance, 0) /
                  (filteredStudents.length || 1)
              )}
              %
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-gray-700">情绪指数</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {
                Math.round(
                  filteredStudents.reduce((sum, s) => {
                    if (s.emotionalState === 'positive') return sum + 1;
                    if (s.emotionalState === 'neutral') return sum + 0.5;
                    return sum;
                  }, 0) /
                    (filteredStudents.length || 1) *
                    100
                )
              }%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
}
