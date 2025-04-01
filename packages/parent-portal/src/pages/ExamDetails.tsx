import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, BookOpen, Target, Users, Award } from 'lucide-react';

function ExamDetails() {
  const navigate = useNavigate();
  
  // 模拟考试数据
  const examData = {
    title: '期中数学测试',
    date: '2025-03-25',
    time: '08:30 - 10:00',
    location: '第二教学楼 401教室',
    subject: '数学',
    teacher: '王老师',
    description: '本次考试范围包括第一章至第五章的所有内容，重点考察三角函数、立体几何和概率统计。建议复习教材P15-P78，以及课堂笔记和练习题。',
    requirements: [
      '携带2B铅笔、黑色签字笔、橡皮、直尺、圆规、三角板',
      '禁止携带手机、智能手表等电子设备',
      '提前15分钟到达考场',
      '按照座位表就坐'
    ],
    score: {
      average: 76.5,
      highest: 98,
      passing: '85%',
      previousAverage: 72.8
    },
    preparation: [
      '复习课本知识点',
      '完成教师分配的复习题',
      '复习错题本',
      '进行时间管理练习'
    ]
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">考试详情</h1>
        </div>
        
        {/* 考试详情卡片 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 考试头部 */}
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{examData.title}</h2>
            <div className="flex items-center text-blue-100">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{examData.date}</span>
            </div>
          </div>
          
          {/* 考试信息 */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">时间</p>
                    <p className="font-medium text-gray-900">{examData.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">地点</p>
                    <p className="font-medium text-gray-900">{examData.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">科目</p>
                    <p className="font-medium text-gray-900">{examData.subject}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">任课老师</p>
                    <p className="font-medium text-gray-900">{examData.teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">平均成绩</p>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{examData.score.average}</p>
                      <span className="text-xs text-green-600 ml-2">↑ {(examData.score.average - examData.score.previousAverage).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">最高分</p>
                    <p className="font-medium text-gray-900">{examData.score.highest}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">考试内容</h3>
              <p className="text-gray-700">{examData.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">考试要求</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {examData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">备考建议</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {examData.preparation.map((prep, index) => (
                  <li key={index}>{prep}</li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                onClick={() => navigate(-1)}
              >
                返回
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700">
                设置提醒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetails;