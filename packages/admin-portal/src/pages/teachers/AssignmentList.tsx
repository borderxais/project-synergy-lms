import React from 'react';
import { FileText } from 'lucide-react';
import { AssignmentCard } from '../../components/teachers/AssignmentCard';
import { assignments } from '../../data/teacher';

export function AssignmentList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">作业批改</h2>
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          <FileText className="w-5 h-5 mr-1" />
          发布新作业
        </button>
      </div>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
}