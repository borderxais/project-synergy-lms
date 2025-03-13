import { Course, Assignment, WeakPoint } from '../types/student';

export const courses: Course[] = [
  {
    id: '1',
    name: '高等数学（上）',
    progress: 65,
    nextLesson: '微分方程应用',
    source: '校内课程',
    type: 'internal'
  },
  {
    id: '2',
    name: 'Python编程基础',
    progress: 45,
    nextLesson: '面向对象编程',
    source: 'Coursera',
    type: 'external'
  },
  {
    id: '3',
    name: '英语写作进阶',
    progress: 80,
    nextLesson: '学术论文写作',
    source: '校内课程',
    type: 'internal'
  }
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: '微分方程期中测验',
    type: 'quiz',
    dueDate: '2024-03-20',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Python项目实践',
    type: 'programming',
    dueDate: '2024-03-22',
    status: 'submitted'
  },
  {
    id: '3',
    title: '英语论文写作',
    type: 'essay',
    dueDate: '2024-03-25',
    status: 'graded',
    score: 92
  }
];

export const weakPoints: WeakPoint[] = [
  {
    id: '1',
    topic: '微分方程的实际应用',
    description: '在实际问题建模方面需要加强',
    recommendedAction: '复习相关案例并完成练习'
  },
  {
    id: '2',
    topic: 'Python类的继承概念',
    description: '对面向对象编程的理解需要深化',
    recommendedAction: '完成在线练习并观看教学视频'
  },
  {
    id: '3',
    topic: '学术写作中的论点展开',
    description: '论证过程不够严密',
    recommendedAction: '阅读范文并进行写作练习'
  }
];