import React from 'react';
import { PlusCircle } from 'lucide-react';
import { CourseCard } from '../../components/students/CourseCard';
import { courses } from '../../data/student';

export function CourseList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">我的课程</h2>
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          <PlusCircle className="w-5 h-5 mr-1" />
          添加课程
        </button>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}