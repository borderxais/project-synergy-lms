
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Calendar, Bell, Brain, Heart, TrendingUp,
  MessageSquare, Mail, Phone, ChevronRight, Activity,
  GraduationCap, Target, Home, FileText, Users, Clock
} from 'lucide-react';
import { 
  studentData, 
  notifications, 
  academicTrends, 
  parentReminders, 
  schoolActivities, 
  volunteerOpportunities, 
  schoolNotices 
} from '../data/mockData';

function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // 处理通知点击
  const handleNotificationClick = (id) => {
    // 导航到通知详情页面
    navigate(`/notification/${id}`);
  };

  // 导航到学科详情
  const handleSubjectClick = (subject) => {
    navigate(`/subject/${subject}`);
  };

  // 导航到快捷操作页面
  const navigateToAction = (page) => {
    navigate(`/${page}`);
  };

  // 处理考试详情查看
  const handleExamDetails = () => {
    // 导航到考试详情页面
    navigate('/exam-details');
  };

  // 处理活动详情查看
  const handleEventDetails = (eventIndex) => {
    // 导航到活动详情页面
    navigate(`/event-details/${eventIndex}`);
  };

  // 查看通知详情
  const handleCommunicationDetail = (id) => {
    navigate(`/notification/${id}`);
  };

  // 回复教师留言
  const handleReplyTeacher = (teacher) => {
    // 导航到消息页面并预填写收件人
    navigate('/message', { state: { recipient: teacher } });
  };

  // 查看全部活动
  const handleViewAllActivities = () => {
    navigate('/school-activities');
  };

  // 了解志愿服务
  const handleVolunteerInfo = () => {
    navigate('/volunteer');
  };

  // 查看全部学校通知
  const handleViewAllNotices = () => {
    navigate('/school-notices');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部与主页按钮 */}
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

        {/* 导航标签 */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              总览
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'academic'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              学业分析
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'communication'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              沟通中心
            </button>
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* 学生概览卡片 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                      <p className="text-gray-600">{studentData.grade}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center text-blue-500 hover:text-blue-600"
                        onClick={() => navigateToAction('message')}
                      >
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

                {/* 近期安排 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">近期安排</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">{studentData.nextExam}</span>
                      </div>
                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={handleExamDetails}
                      >
                        查看详情
                      </button>
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
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleEventDetails(index)}
                        >
                          查看详情
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'academic' && (
              <>
                {/* 学科成绩趋势 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">学科成绩趋势</h2>
                  <div className="space-y-4">
                    {academicTrends.map((subject) => (
                      <div
                        key={subject.subject}
                        className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => handleSubjectClick(subject.subject)}
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
                              className={`w-5 h-5 mr-2 ${subject.current >= subject.previous
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
                          <div className="flex items-center">
                            <span className="text-gray-600">
                              {subject.current >= subject.previous ? '提升' : '下降'}
                              {Math.abs(subject.current - subject.previous)}分
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 通知系统 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">通知系统</h2>
                    <div className="relative">
                      <Bell className="w-6 h-6 text-blue-500" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex flex-col">
                            <span className={`font-medium ${notification.read ? 'text-gray-700' : 'text-blue-700'}`}>
                              {notification.title}
                            </span>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">暂无通知</p>
                    )}
                  </div>
                </div>

                {/* 学业预测 */}
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

                {/* 智能家长提醒板块 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">智能家长提醒</h2>
                  <div className="space-y-4">
                    {parentReminders.map((reminder) => (
                      <div key={reminder.id} className="border border-orange-100 rounded-lg p-4 hover:border-orange-300 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="bg-orange-100 p-2 rounded-full mr-3">
                            {reminder.id === 1 ? (
                              <Users className="w-5 h-5 text-orange-500" />
                            ) : reminder.id === 2 ? (
                              <BookOpen className="w-5 h-5 text-orange-500" />
                            ) : (
                              <Calendar className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                        </div>

                        <div className="pl-10 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-orange-400" />
                            <span>{reminder.date}</span>
                          </div>

                          <div className="flex items-start text-sm text-gray-600">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                            </div>
                            <span>{reminder.location}</span>
                          </div>

                          <p className="text-gray-700 mt-2">
                            {reminder.description}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            已了解
                          </button>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium ml-2 transition-colors">
                            加入日历
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'communication' && (
              <>
                {/* 沟通记录 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">沟通记录</h2>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-center justify-between p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'
                          } border rounded-lg`}
                      >
                        <div className="flex items-center">
                          {notification.type === 'academic' && <BookOpen className="w-5 h-5 text-blue-500 mr-2" />}
                          {notification.type === 'behavior' && <Heart className="w-5 h-5 text-green-500 mr-2" />}
                          {notification.type === 'event' && <Calendar className="w-5 h-5 text-amber-500 mr-2" />}
                          {notification.type === 'alert' && <Bell className="w-5 h-5 text-red-500 mr-2" />}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600">{notification.time}</p>
                          </div>
                        </div>
                        <button 
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleCommunicationDetail(notification.id)}
                        >
                          查看详情
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 消息中心 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">教师留言</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="font-medium text-blue-600">王</span>
                          </div>
                          <div>
                            <h3 className="font-medium">王老师（班主任）</h3>
                            <p className="text-xs text-gray-500">今天 10:30</p>
                          </div>
                        </div>
                        <button 
                          className="text-blue-500 text-sm hover:text-blue-600"
                          onClick={() => handleReplyTeacher('王老师（班主任）')}
                        >
                          回复
                        </button>
                      </div>
                      <p className="text-gray-700">张小明近期数学表现很好，特别是在三角函数部分的学习上有明显进步。建议继续保持这种学习状态，同时可以适当加强立体几何部分的练习。</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <span className="font-medium text-green-600">李</span>
                          </div>
                          <div>
                            <h3 className="font-medium">李老师（语文）</h3>
                            <p className="text-xs text-gray-500">昨天 16:45</p>
                          </div>
                        </div>
                        <button 
                          className="text-blue-500 text-sm hover:text-blue-600"
                          onClick={() => handleReplyTeacher('李老师（语文）')}
                        >
                          回复
                        </button>
                      </div>
                      <p className="text-gray-700">张小明的作文有很大提升，表达更加流畅，议论也更有深度。不过还需要加强一些古文的学习，特别是对文言实词的理解。</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <span className="font-medium text-purple-600">张</span>
                          </div>
                          <div>
                            <h3 className="font-medium">张老师（英语）</h3>
                            <p className="text-xs text-gray-500">3月28日</p>
                          </div>
                        </div>
                        <button 
                          className="text-blue-500 text-sm hover:text-blue-600"
                          onClick={() => handleReplyTeacher('张老师（英语）')}
                        >
                          回复
                        </button>
                      </div>
                      <p className="text-gray-700">英语听力测试成绩优秀，口语表达也很流利。建议多阅读一些英文原著，扩大词汇量，为高考做更充分的准备。</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                      onClick={() => navigateToAction('message')}
                    >
                      <MessageSquare className="w-5 h-5" />
                      发送新消息
                    </button>
                  </div>
                </div>

                {/* 家校互动 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">家校互动</h2>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">近期活动</h3>
                      <ul className="space-y-2">
                        {schoolActivities.slice(0, 3).map((activity, index) => (
                          <li key={index} className="flex items-center">
                            <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-gray-700">{activity.title} - {activity.date}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        onClick={handleViewAllActivities}
                      >
                        查看全部活动
                      </button>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">志愿服务</h3>
                      <p className="text-gray-700 mb-3">学校正在招募家长志愿者，参与校园活动组织和学生课外辅导。目前有{volunteerOpportunities.length}个志愿服务机会。</p>
                      <button 
                        className="text-sm text-green-600 hover:text-green-700"
                        onClick={handleVolunteerInfo}
                      >
                        了解更多
                      </button>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">学校通知</h3>
                      <ul className="space-y-2">
                        {schoolNotices.slice(0, 3).map((notice, index) => (
                          <li key={index} className="flex items-center">
                            <Bell className="w-4 h-4 text-amber-500 mr-2" />
                            <span className="text-gray-700">{notice.title}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        className="mt-3 text-sm text-amber-600 hover:text-amber-700"
                        onClick={handleViewAllNotices}
                      >
                        查看全部通知
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-8">
            {/* 快捷操作 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToAction('message')}
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                    <span>发送消息</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToAction('leave')}
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-500 mr-2" />
                    <span>请假申请</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToAction('report')}
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-amber-500 mr-2" />
                    <span>成绩单下载</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 联系方式 */}
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

            {/* AI教育顾问 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">AI教育顾问</h2>
              <p className="mb-4 text-white/90">
                智能分析学习数据，为您提供专业的教育建议。
              </p>
              <button
                className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-white font-medium transition-colors"
                onClick={() => navigateToAction('ai-advice')}
              >
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