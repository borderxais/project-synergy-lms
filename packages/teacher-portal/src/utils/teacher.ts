import { FileText, Clock, PenTool, CheckCircle2, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

export const getAssignmentStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-amber-500';
    case 'grading':
      return 'text-blue-500';
    case 'completed':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const getAssignmentStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'grading':
      return PenTool;
    case 'completed':
      return CheckCircle2;
    default:
      return AlertCircle;
  }
};

export const getEmotionalStateColor = (state: string) => {
  switch (state) {
    case 'positive':
      return 'text-green-500';
    case 'neutral':
      return 'text-amber-500';
    case 'negative':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getPerformanceIcon = (performance: string) => {
  switch (performance) {
    case 'improving':
      return TrendingUp;
    case 'stable':
      return Clock;
    case 'declining':
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

export const getInsightIcon = (type: string) => {
  switch (type) {
    case 'improvement':
      return TrendingUp;
    case 'warning':
      return AlertCircle;
    case 'suggestion':
      return Lightbulb;
    default:
      return AlertCircle;
  }
};

export const getInsightColor = (type: string) => {
  switch (type) {
    case 'improvement':
      return 'text-green-500';
    case 'warning':
      return 'text-red-500';
    case 'suggestion':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};