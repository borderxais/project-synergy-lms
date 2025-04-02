// components/CourseCard.tsx
import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { Course } from '../types/teacher';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border rounded-lg p-4 hover:border-blue-500 transition-colors"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{course.name}</h3>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="mt-2 text-sm text-gray-600 flex items-center">
        <Users className="w-4 h-4 mr-1" />
        {course.studentCount} 名学生
      </div>
    </button>
  );
}
