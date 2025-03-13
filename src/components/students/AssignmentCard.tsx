import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Assignment } from '../../types/student';
import { getAssignmentIcon, getStatusIcon, getStatusColor } from '../../utils/student';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const AssignmentIcon = getAssignmentIcon(assignment.type);
  const StatusIcon = getStatusIcon(assignment.status);
  const statusColor = getStatusColor(assignment.status);

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <AssignmentIcon className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
        </div>
        <div className="flex items-center">
          <StatusIcon className={`w-5 h-5 ${statusColor} mr-2`} />
          <span className={`text-sm ${statusColor}`}>
            {assignment.status === 'graded' ? `得分：${assignment.score}` : 
             assignment.status === 'pending' ? '待提交' : '已提交'}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">截止日期：{assignment.dueDate}</span>
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          {assignment.status === 'pending' ? '开始作答' : '查看详情'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}