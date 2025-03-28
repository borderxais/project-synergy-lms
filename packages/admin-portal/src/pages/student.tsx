import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Code,
  Edit3,
  FileText,
  GraduationCap,
  BarChart2,
  Brain,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Play,
  PlusCircle,
  Home
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  progress: number;
  nextLesson: string;
  source: string;
  type: 'internal' | 'external';
}

interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'programming' | 'essay';
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

const courses: Course[] = [
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

const assignments: Assignment[] = [
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

const weakPoints = [
  '微分方程的实际应用',
  'Python类的继承概念',
  '学术写作中的论点展开'
];

function StudentLearning() {
  const [activeTab, setActiveTab] = useState('courses');
  const navigate = useNavigate();

  const getAssignmentIcon = (type: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Home Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学习中心</h1>
            <p className="mt-2 text-gray-600">管理你的课程、作业和学习进度</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>返回首页</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'courses'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              课程管理
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'assignments'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              作业测评
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              学习分析
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">我的课程</h2>
                  <button className="flex items-center text-blue-500 hover:text-blue-600">
                    <PlusCircle className="w-5 h-5 mr-1" />
                    添加课程
                  </button>
                </div>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                          <h3 className="font-medium text-gray-900">
                            {course.name}
                          </h3>
                        </div>
                        <span className="text-sm text-gray-500">
                          {course.source}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>学习进度</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 rounded-full h-2"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          下一课：{course.nextLesson}
                        </span>
                        <button className="flex items-center text-blue-500 hover:text-blue-600 text-sm">
                          继续学习
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">作业与测评</h2>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {React.createElement(getAssignmentIcon(assignment.type), {
                            className: 'w-5 h-5 text-blue-500 mr-2'
                          })}
                          <h3 className="font-medium text-gray-900">
                            {assignment.title}
                          </h3>
                        </div>
                        <div className="flex items-center">
                          {React.createElement(getStatusIcon(assignment.status), {
                            className: `w-5 h-5 ${getStatusColor(
                              assignment.status
                            )} mr-2`
                          })}
                          <span
                            className={`text-sm ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {assignment.status === 'graded'
                              ? `得分：${assignment.score}`
                              : assignment.status === 'pending'
                              ? '待提交'
                              : '已提交'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          截止日期：{assignment.dueDate}
                        </span>
                        <button className="flex items-center text-blue-500 hover:text-blue-600">
                          {assignment.status === 'pending' ? '开始作答' : '查看详情'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">学习分析</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-gray-700">本周学习时长</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">18.5小时</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">作业完成率</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">85%</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Brain className="w-5 h-5 text-amber-500 mr-2" />
                        <span className="text-gray-700">知识点掌握</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">78%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">需要加强的知识点</h2>
                  <div className="space-y-4">
                    {weakPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                        <button className="flex items-center text-blue-500 hover:text-blue-600">
                          <Play className="w-4 h-4 mr-1" />
                          开始复习
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">学习建议</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-blue-500 mr-2 mt-1" />
                  <p className="text-gray-600">
                    建议今天复习"微分方程应用"，这将帮助你更好地准备即将到来的测验。
                  </p>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-amber-500 mr-2 mt-1" />
                  <p className="text-gray-600">
                    你有2个作业即将截止，请合理安排时间完成。
                  </p>
                </div>
                <div className="flex items-start">
                  <GraduationCap className="w-5 h-5 text-green-500 mr-2 mt-1" />
                  <p className="text-gray-600">
                    恭喜！你的英语写作能力有显著提升。继续保持！
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">AI学习助手</h2>
              <p className="mb-4 text-white/90">
                有任何学习问题，随时询问AI助手。24/7在线服务。
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-white font-medium transition-colors">
                开始对话
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLearning;