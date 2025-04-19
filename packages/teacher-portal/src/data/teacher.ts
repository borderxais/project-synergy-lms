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
    content: '近期微分方程教学效果显著提升，建议继续使用小组讨论形式。',
    impact: 'high',
    reason:
      '学生在课堂上表现出更强的理解力和主动性，尤其在小组合作中能够相互启发思考。数据统计显示，参与小组讨论的学生在测试中平均提高了 15 分。课堂观察也发现学生提问次数明显增加，展现出更高的参与热情。教学反馈问卷表明，绝大多数学生认为小组活动帮助他们更好地理解课程内容。这说明小组形式不仅提升了学习效果，也增强了课堂活跃度。',
    suggestedAction:
      '建议继续保持每周两次的小组讨论节奏，结合课后反思问卷收集学生反馈，并逐步引入更具挑战性的讨论题目以巩固提升。'
  },
  {
    id: '2',
    type: 'warning',
    content: '30% 的学生在向量运算方面存在困难，建议增加针对性练习。',
    impact: 'medium',
    reason:
      '单元测验结果显示，向量运算部分平均正确率为 62%，低于整体平均值近 20%。部分学生反馈在向量加减与内积外积中理解模糊，易出现计算失误。结合课堂练习与提问记录分析，掌握度不均现象较为明显。已有学生在作业中连续出错，影响后续内容理解。此问题如不及时干预，可能造成知识断层并影响期末成绩。',
    suggestedAction:
      '建议安排一次专题答疑课，集中讲解常见错误，并设计一套在线自测题库供学生课后练习与巩固。'
  },
  {
    id: '3',
    type: 'suggestion',
    content: '可以考虑引入更多实际应用案例，提高学生学习兴趣。',
    impact: 'medium',
    reason:
      '学生在课堂调查中普遍反馈课程内容较为抽象，缺乏实际应用场景的联结感。一些学生表示难以理解所学知识与未来职业的关联，从而影响学习动机。观察发现，在引入案例时课堂氛围更为活跃，学生参与度也随之提升。具体如微积分在建筑结构中的应用引发了广泛讨论。案例教学有助于加深理解并提高知识迁移能力。',
    suggestedAction:
      '建议每章至少引入 1~2 个真实案例，例如结合工程、经济或数据分析情境，并引导学生进行案例分析或小组讨论。'
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