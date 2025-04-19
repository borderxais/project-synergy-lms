import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Megaphone, Calendar, Mail, ChevronRight, Sparkles, X, Bot } from 'lucide-react';
import { QuickAction } from '../../types/teacher';
import { recentMessages } from '../../data/teacher';

export function Sidebar() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const quickActions: QuickAction[] = [
    {
      icon: FileText,
      label: '发布作业',
      color: 'text-blue-500',
      onClick: () => navigate(`/courses/${courseId}/create-assignment`)
    },
    {
      icon: Megaphone,
      label: '发布公告',
      color: 'text-green-500',
      onClick: () => navigate(`/courses/${courseId}/create-announcement`)
    },
    {
      icon: Calendar,
      label: '课程安排',
      color: 'text-amber-500',
      onClick: () => navigate(`/courses/${courseId}/schedule`)
    }
  ];

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatLog([...chatLog, chatInput]);
    setChatInput('');
  };

  return (
    <>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">最近消息</h2>
            <button
              onClick={() => navigate('/messages')}
              className="text-sm text-indigo-600 hover:underline"
            >
              查看全部消息
            </button>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => navigate(`/messages/${message.id}`)}
                className="w-full text-left flex items-start space-x-3 hover:bg-gray-50 rounded-md p-2"
              >
                <Mail
                  className={`w-5 h-5 ${
                    message.read ? 'text-gray-400' : 'text-blue-500'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{message.title}</p>
                  <p className="text-sm text-gray-600 truncate">{message.content}</p>
                  <p className="text-xs text-gray-400">{message.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Assistant Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        aria-label="AI 教学助手"
      >
        <Bot className="w-5 h-5" />
      </button>

      {showAssistant && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-xl border p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" /> AI教学助手
            </h3>
            <button
              onClick={() => setShowAssistant(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48 overflow-y-auto text-sm space-y-2 mb-3">
            {chatLog.map((msg, idx) => (
              <div key={idx} className="bg-gray-100 rounded px-2 py-1">
                {msg}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="请输入问题..."
              className="flex-grow border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={sendChat}
              className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
}