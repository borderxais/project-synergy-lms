import { Assignment, Student, TeachingInsight, Message } from '../types/teacher';
import { Course } from '../types/teacher';

export const courses: Course[] = [
  {
    id: 'course-1',
    name: '数学（一）',
    studentCount: 35,
  },
  {
    id: 'course-2',
    name: '英语（二）',
    studentCount: 30,
  },
  {
    id: 'course-3',
    name: '物理（三）',
    studentCount: 28,
  }
];


export const assignments: Assignment[] = [
  {
    id: '1',
    title: '微分方程期中测验',
    subject: '数学',
    dueDate: '2024-03-20',
    submissionCount: 42,
    totalStudents: 45,
    status: 'pending'
  },
  {
    id: '2',
    title: '牛顿力学实验报告',
    subject: '物理',
    dueDate: '2024-03-22',
    submissionCount: 38,
    totalStudents: 45,
    status: 'grading'
  },
  {
    id: '3',
    title: '文言文阅读理解',
    subject: '语文',
    dueDate: '2024-03-18',
    submissionCount: 45,
    totalStudents: 45,
    status: 'completed'
  }
];

export const students: Student[] = [
  {
    id: '1',
    name: '张小明',
    emotionalState: 'positive',
    attendance: 98,
    participation: 85,
    recentPerformance: 'improving'
  },
  {
    id: '2',
    name: '李华',
    emotionalState: 'neutral',
    attendance: 92,
    participation: 75,
    recentPerformance: 'stable'
  },
  {
    id: '3',
    name: '王芳',
    emotionalState: 'negative',
    attendance: 85,
    participation: 60,
    recentPerformance: 'declining'
  }
];

export const insights: TeachingInsight[] = [
  {
    id: '1',
    type: 'improvement',
    content: '近期微分方程教学效果显著提升，建议继续使用小组讨论形式',
    impact: 'high'
  },
  {
    id: '2',
    type: 'warning',
    content: '30%的学生在向量运算方面存在困难，建议增加针对性练习',
    impact: 'medium'
  },
  {
    id: '3',
    type: 'suggestion',
    content: '可以考虑引入更多实际应用案例，提高学生学习兴趣',
    impact: 'medium'
  }
];

export const recentMessages: Message[] = [
  {
    id: '1',
    title: '张小明家长来信',
    content: '关于下周请假事宜...',
    time: '10分钟前',
    read: false
  },
  {
    id: '2',
    title: '李华家长来信',
    content: '感谢您的耐心指导...',
    time: '2小时前',
    read: true
  }
];