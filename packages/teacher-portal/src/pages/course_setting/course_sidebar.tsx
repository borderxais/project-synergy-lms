import React from 'react';
import { FileText, Megaphone, Calendar, Mail, ChevronRight } from 'lucide-react';
import { QuickAction } from '../../types/teacher';
import { recentMessages } from '../../data/teacher';

const quickActions: QuickAction[] = [
  {
    icon: FileText,
    label: '发布作业',
    color: 'text-blue-500',
    onClick: () => console.log('跳转到作业创建页面')
  },
  {
    icon: Megaphone,
    label: '发布公告',
    color: 'text-green-500',
    onClick: () => console.log('跳转到公告创建页面')
  },
  {
    icon: Calendar,
    label: '课程安排',
    color: 'text-amber-500',
    onClick: () => console.log('查看课程安排')
  }
];

export function course_sidebar() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <action.icon className={`w-5 h-5 ${action.color} mr-2`} />
                <span>{action.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">最近消息</h2>
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <Mail className={`w-5 h-5 ${message.read ? 'text-gray-400' : 'text-blue-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{message.title}</p>
                <p className="text-sm text-gray-600">{message.content}</p>
                <p className="text-xs text-gray-400">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">AI教学助手</h2>
        <p className="mb-4 text-white/90">
          智能分析教学数据，为您提供个性化教学建议。
        </p>
        <button className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-white font-medium transition-colors">
          获取建议
        </button>
      </div>
    </div>
  );
}
