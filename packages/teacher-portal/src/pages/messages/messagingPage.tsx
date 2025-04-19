import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';

type ChatMessage = {
  sender: 'student' | 'instructor';
  content: string;
  timestamp: string;
  attachment?: string;
};

export default function MessagingPage() {
  const { messageId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'student',
      content: '老师您好，我想请教一下作业的要求。',
      timestamp: '2025-04-01 10:00'
    },
    {
      sender: 'instructor',
      content: '你好，请仔细阅读作业描述，有问题随时问我。',
      timestamp: '2025-04-01 10:10'
    }
  ]);

  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const sendMessage = () => {
    if (!input.trim() && !attachment) return;

    const newMessage: ChatMessage = {
      sender: 'instructor',
      content: input.trim(),
      timestamp: new Date().toLocaleString(),
      attachment: attachment ? attachment.name : undefined
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setAttachment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title={`消息对话 #${messageId}`}
          description="与学生或家长的消息往来记录"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-4 bg-white rounded-xl shadow-sm p-6">
            <div className="h-96 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-sm ${
                    msg.sender === 'instructor' ? 'ml-auto text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.sender === 'instructor'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    {msg.attachment && (
                      <p className="text-xs text-indigo-600 mt-1">
                        📎 附件：{msg.attachment}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:border-indigo-400"
              />
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                className="text-sm text-gray-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                发送
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">操作</h2>
              <button
                onClick={() => navigate('/messages')}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                返回消息列表
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
