import React from 'react';
import { Heart } from 'lucide-react';
import { Student } from '../types/teacher';
import { getEmotionalStateColor, getPerformanceIcon } from '../utils/teacher';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const PerformanceIcon = getPerformanceIcon(student.recentPerformance);
  const emotionalStateColor = getEmotionalStateColor(student.emotionalState);
  const performanceColor = student.recentPerformance === 'improving'
    ? 'text-green-500'
    : student.recentPerformance === 'stable'
    ? 'text-amber-500'
    : 'text-red-500';

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Heart className={`w-5 h-5 mr-2 ${emotionalStateColor}`} />
          <h3 className="font-medium text-gray-900">{student.name}</h3>
        </div>
        <div className="flex items-center">
          <PerformanceIcon className={`w-5 h-5 ${performanceColor} mr-2`} />
          <span className={performanceColor}>
            {student.recentPerformance === 'improving'
              ? '进步中'
              : student.recentPerformance === 'stable'
              ? '稳定'
              : '需关注'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="text-sm text-gray-600">
          出勤率: {student.attendance}%
        </div>
        <div className="text-sm text-gray-600">
          课堂参与度: {student.participation}%
        </div>
      </div>
    </div>
  );
}