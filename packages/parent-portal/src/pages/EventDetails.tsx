import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText, Download } from 'lucide-react';

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // 模拟事件数据
  const events = [
    {
      id: 0,
      title: '家长会',
      date: '2025-03-20',
      time: '19:00 - 21:00',
      location: '学校多功能厅',
      description: '本次家长会将针对学生近期学习情况进行交流，请家长准时参加。班主任将详细分析学生成绩，提出针对性的学习建议。',
      organizer: '王老师（班主任）',
      attachments: ['家长会议程.pdf'],
      attendees: '全体家长'
    },
    {
      id: 1,
      title: '春季运动会',
      date: '2025-03-30',
      time: '08:30 - 17:00',
      location: '学校操场',
      description: '一年一度的春季运动会即将举行，学生将参加多项体育赛事。请家长为学生准备运动服装、水壶和防晒用品。学生可根据自身情况报名参加比赛项目。',
      organizer: '体育组',
      attachments: ['运动会项目表.pdf', '参赛注意事项.docx'],
      attendees: '全校师生'
    },
    {
      id: 2,
      title: '艺术节表演',
      date: '2025-04-05',
      time: '14:00 - 16:30',
      location: '学校礼堂',
      description: '学校艺术节将展示学生在音乐、舞蹈、戏剧等方面的才艺。您的孩子将参与合唱团表演，请在表演当天提前到场。',
      organizer: '艺术教研组',
      attachments: ['节目单.pdf', '座位安排.pdf'],
      attendees: '表演学生家长'
    }
  ];
  
  // 查找对应的事件
  const event = events[eventId] || events[0];
  
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
          <h1 className="text-2xl font-bold text-gray-900">活动详情</h1>
        </div>
        
        {/* 事件详情卡片 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 事件头部 */}
          <div className="bg-blue-500 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <div className="flex items-center text-blue-100">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{event.date}</span>
            </div>
          </div>
          
          {/* 事件信息 */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">时间</p>
                    <p className="font-medium text-gray-900">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">地点</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">参与人员</p>
                    <p className="font-medium text-gray-900">{event.attendees}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">组织者</p>
                    <p className="font-medium text-gray-900">{event.organizer}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">附件</p>
                    <div className="space-y-2 mt-1">
                      {event.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center">
                          <button className="flex items-center text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4 mr-1" />
                            <span>{attachment}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">活动描述</h3>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                onClick={() => navigate(-1)}
              >
                返回
              </button>
              <button className="px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600">
                添加到日历
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;