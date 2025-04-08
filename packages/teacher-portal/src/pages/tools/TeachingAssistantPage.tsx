// src/pages/tools/TeachingAssistantPage.tsx
import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { Sparkles, X, Send } from 'lucide-react';

export default function TeachingAssistantPage() {
  const suggestions = [
    '使用更多可视化图表提升学生对数学概念的理解。',
    '为参与度低的学生安排一对一答疑。',
    '根据学生作业完成情况调整下周教学重点。',
    '建议在物理课程中加入更多实验环节提升互动。'
  ];

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '您好，我是您的 AI 教学助手，请问有什么我可以帮您？' }
  ]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    setChatInput('');
    // Simulated response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '谢谢您的提问，我们建议根据学生参与度调整互动策略。'
        }
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="AI 教学助手"
          description="基于教学数据的智能分析与个性化建议"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {suggestions.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-start">
                <Sparkles className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
              <h2 className="text-lg font-semibold mb-2">助手简介</h2>
              <p className="text-sm text-gray-600">
                本助手基于学生参与度、出勤、情绪和作业表现等数据，提供自动生成的教学优化建议，助您更高效地进行课堂管理。
              </p>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="mt-4 w-full text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {chatOpen ? '关闭对话' : '打开 AI 对话'}
              </button>

              {chatOpen && (
                <div className="absolute bottom-full right-0 w-96 bg-white rounded-lg shadow-lg border mt-2 p-4 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">AI 聊天</span>
                    <button onClick={() => setChatOpen(false)}>
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                  <div className="h-48 overflow-y-auto text-sm space-y-2 mb-2">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-3 py-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} max-w-xs`}> 
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="输入问题..."
                      className="flex-grow border rounded-md px-3 py-1 text-sm"
                    />
                    <button
                      onClick={handleSend}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
