import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Course } from '../../types/student';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-medium text-gray-900">{course.name}</h3>
        </div>
        <span className="text-sm text-gray-500">{course.source}</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>学习进度</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 rounded-full h-2"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">下一课：{course.nextLesson}</span>
        <button className="flex items-center text-blue-500 hover:text-blue-600 text-sm">
          继续学习
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}