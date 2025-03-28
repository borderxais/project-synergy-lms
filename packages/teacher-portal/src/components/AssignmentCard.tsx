import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Assignment } from '../types/teacher';
import { getAssignmentStatusIcon, getAssignmentStatusColor } from '../utils/teacher';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const StatusIcon = getAssignmentStatusIcon(assignment.status);
  const statusColor = getAssignmentStatusColor(assignment.status);

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
            <p className="text-sm text-gray-600">{assignment.subject}</p>
          </div>
        </div>
        <div className="flex items-center">
          <StatusIcon className={`w-5 h-5 ${statusColor} mr-2`} />
          <span className={`text-sm ${statusColor}`}>
            {assignment.status === 'pending'
              ? '待批改'
              : assignment.status === 'grading'
              ? '批改中'
              : '已完成'}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          已交: {assignment.submissionCount}/{assignment.totalStudents}
        </span>
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          开始批改
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}