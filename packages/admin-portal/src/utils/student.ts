import { FileText, Code, Edit3, Clock, CheckCircle2, BarChart2, AlertCircle } from 'lucide-react';

export const getAssignmentIcon = (type: string) => {
  switch (type) {
    case 'quiz':
      return FileText;
    case 'programming':
      return Code;
    case 'essay':
      return Edit3;
    default:
      return FileText;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'submitted':
      return CheckCircle2;
    case 'graded':
      return BarChart2;
    default:
      return AlertCircle;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-amber-500';
    case 'submitted':
      return 'text-blue-500';
    case 'graded':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};