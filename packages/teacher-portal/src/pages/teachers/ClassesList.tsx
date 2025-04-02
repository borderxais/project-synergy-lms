import React from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../../components/CourseCard';
import { courses } from '../../data/teacher';

export function ClassesList() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">课程列表</h2>
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          <FileText className="w-5 h-5 mr-1" />
          发布新作业
        </button>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => navigate(`/courses/${course.id}/manage`)}
          />
        ))}
      </div>
    </div>
  );
}
