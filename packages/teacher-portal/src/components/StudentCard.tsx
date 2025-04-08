import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Student } from '../types/teacher';
import { getEmotionalStateColor, getPerformanceIcon } from '../utils/teacher';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const PerformanceIcon = getPerformanceIcon(student.recentPerformance);
  const emotionalStateColor = getEmotionalStateColor(student.emotionalState);

  const performanceColor =
    student.recentPerformance === 'improving'
      ? 'text-green-500'
      : student.recentPerformance === 'stable'
      ? 'text-amber-500'
      : 'text-red-500';

  return (
    <Link
      to={`/students/${student.id}`}
      aria-label={`查看 ${student.name} 的档案`}
      className="block border rounded-lg p-4 hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        {/* Emotional State */}
        <div className="flex items-center">
          <Heart className={`w-5 h-5 mr-2 ${emotionalStateColor}`} />
          <h3 className="font-medium text-gray-900">{student.name}</h3>
        </div>

        {/* Performance */}
        <div className="flex items-center">
          <PerformanceIcon className={`w-5 h-5 mr-2 ${performanceColor}`} />
          <span className={`text-sm ${performanceColor}`}>
            {student.recentPerformance === 'improving'
              ? '进步中'
              : student.recentPerformance === 'stable'
              ? '稳定'
              : '需关注'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
        <div>出勤率: {student.attendance}%</div>
        <div>课堂参与度: {student.participation}%</div>
      </div>
    </Link>
  );
}
