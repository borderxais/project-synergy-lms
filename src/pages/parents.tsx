import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Bell,
  BarChart2,
  Brain,
  Heart,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Mail,
  Phone,
  ChevronRight,
  Activity,
  GraduationCap,
  Target,
  Home,
  FileText
} from 'lucide-react';

interface StudentData {
  name: string;
  grade: string;
  attendance: number;
  academicScore: number;
  behaviorScore: number;
  mentalHealth: number;
  nextExam: string;
  upcomingEvents: string[];
}

interface Notification {
  id: string;
  title: string;
  type: 'academic' | 'behavior' | 'event' | 'alert';
  time: string;
  read: boolean;
}

const studentData: StudentData = {
  name: '张小明',
  grade: '高二（3）班',
  attendance: 98,
  academicScore: 87,
  behaviorScore: 92,
  mentalHealth: 85,
  nextExam: '期中数学测试 (3月25日)',
  upcomingEvents: [
    '家长会 (3月20日)',
    '春季运动会 (3月30日)',
    '艺术节表演 (4月5日)'
  ]
};

const notifications: Notification[] = [
  {
    id: '1',
    title: '数学测验成绩已出：92分',
    type: 'academic',
    time: '今天 14:30',
    read: false
  },
  {
    id: '2',
    title: '本周行为表现优秀',
    type: 'behavior',
    time: '昨天 16:45',
    read: true
  },
  {
    id: '3',
    title: '请及时确认参加家长会',
    type: 'event',
    time: '昨天 09:15',
    read: false
  }
];

const academicTrends = [
  { subject: '数学', current: 92, previous: 88 },
  { subject: '语文', current: 88, previous: 85 },
  { subject: '英语', current: 95, previous: 90 },
  { subject: '物理', current: 86, previous: 82 }
];

function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return BookOpen;
      case 'behavior':
        return Heart;
      case 'event':
        return Calendar;
      case 'alert':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'text-blue-500';
      case 'behavior':
        return 'text-green-500';
      case 'event':
        return 'text-amber-500';
      case 'alert':
        return 'text-red-500';
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
            <h1 className="text-3xl font-bold text-gray-900">家庭教育管家</h1>
            <p className="mt-2 text-gray-600">全方位掌握孩子的学习与成长动态</p>
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
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              总览
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'academic'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              学业分析
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'communication'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              沟通中心
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Student Overview Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                      <p className="text-gray-600">{studentData.grade}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center text-blue-500 hover:text-blue-600">
                        <MessageSquare className="w-5 h-5 mr-1" />
                        联系班主任
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Activity className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-gray-700">出勤率</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{studentData.attendance}%</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">学业成绩</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{studentData.academicScore}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Heart className="w-5 h-5 text-amber-500 mr-2" />
                        <span className="text-gray-700">行为表现</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">{studentData.behaviorScore}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Brain className="w-5 h-5 text-purple-500 mr-2" />
                        <span className="text-gray-700">心理健康</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{studentData.mentalHealth}</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">近期安排</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">{studentData.nextExam}</span>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600">查看详情</button>
                    </div>
                    {studentData.upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">{event}</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">查看详情</button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'academic' && (
              <>
                {/* Academic Progress */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">学科成绩趋势</h2>
                  <div className="space-y-4">
                    {academicTrends.map((subject) => (
                      <div
                        key={subject.subject}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                            <h3 className="font-medium text-gray-900">
                              {subject.subject}
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp
                              className={`w-5 h-5 mr-2 ${
                                subject.current >= subject.previous
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            />
                            <span className="font-medium text-gray-900">
                              {subject.current}分
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">上次：{subject.previous}分</span>
                          <span className="text-gray-600">
                            {subject.current >= subject.previous ? '提升' : '下降'}
                            {Math.abs(subject.current - subject.previous)}分
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Predictions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">学业预测</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Target className="w-5 h-5 text-blue-500 mr-2" />
                        <h3 className="font-medium text-gray-900">预计高考成绩区间</h3>
                      </div>
                      <p className="text-gray-700">
                        根据当前学习轨迹，预计高考成绩将在620-650分区间，可冲刺重点本科院校。
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="w-5 h-5 text-green-500 mr-2" />
                        <h3 className="font-medium text-gray-900">建议专业方向</h3>
                      </div>
                      <p className="text-gray-700">
                        根据兴趣特点和学科表现，建议考虑：计算机科学、数据科学、人工智能等相关专业。
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'communication' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">沟通记录</h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-4 ${
                        notification.read ? 'bg-white' : 'bg-blue-50'
                      } border rounded-lg`}
                    >
                      <div className="flex items-center">
                        {React.createElement(getNotificationIcon(notification.type), {
                          className: `w-5 h-5 ${getNotificationColor(
                            notification.type
                          )} mr-2`
                        })}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600">{notification.time}</p>
                        </div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600">
                        查看详情
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                    <span>发送消息</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-500 mr-2" />
                    <span>请假申请</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-amber-500 mr-2" />
                    <span>成绩单下载</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">联系方式</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">班主任电话</p>
                    <p className="font-medium">138-8888-8888</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">学校邮箱</p>
                    <p className="font-medium">contact@school.edu.cn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">AI教育顾问</h2>
              <p className="mb-4 text-white/90">
                智能分析学习数据，为您提供专业的教育建议。
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-white font-medium transition-colors">
                获取建议
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;