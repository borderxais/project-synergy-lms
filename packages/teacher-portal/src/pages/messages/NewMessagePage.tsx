import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { students } from '../../data/teacher';
import { TeacherHeader } from '../../components/TeacherHeader';

export default function NewMessagePage() {
  const navigate = useNavigate();
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !title.trim() || !content.trim()) {
      alert('请填写完整的消息内容。');
      return;
    }

    const recipient = students.find((s) => s.id === recipientId);
    console.log('新建消息：', {
      to: recipient?.name || '未知对象',
      title,
      content
    });

    alert('消息已发送！');
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader title="新建消息" description="向学生或家长发送私信" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-sm space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  收件人
                </label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">请选择学生</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  消息标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="请输入标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  消息内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={5}
                  placeholder="请输入消息内容"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm"
              >
                发送消息
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">消息小贴士</h2>
              <p className="text-white/90 text-sm">
                发出消息后，对方将立即收到通知。确保信息清晰并带有适当称呼。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
