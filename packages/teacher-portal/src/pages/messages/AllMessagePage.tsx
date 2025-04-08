// src/pages/messages/AllMessagesPage.tsx
import { useNavigate } from 'react-router-dom';
import { recentMessages } from '../../data/teacher';
import { Mail, Plus } from 'lucide-react';
import { TeacherHeader } from '../../components/TeacherHeader';

export default function AllMessagesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="消息中心"
          description="查看学生/家长消息并进行回复"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Message list */}
          <div className="lg:col-span-2 space-y-4">
            {recentMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => navigate(`/messages/${message.id}`)}
                className="w-full text-left flex items-start space-x-3 bg-white p-4 rounded-lg border hover:bg-gray-50"
              >
                <Mail
                  className={`w-5 h-5 mt-1 ${
                    message.read ? 'text-gray-400' : 'text-blue-500'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {message.title}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-400">{message.time}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Sidebar: new message action */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
              <button
                onClick={() => navigate('/messages/new')}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                新建消息
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">AI沟通助手</h2>
              <p className="mb-4 text-white/90">
                智能分析沟通记录，帮助您更高效地与家长/学生互动。
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
