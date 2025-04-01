import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function SendMessage() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理表单提交
    alert('消息已发送！');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">发送消息</h1>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收件人</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              >
                <option value="">请选择收件人</option>
                <option value="班主任">王老师（班主任）</option>
                <option value="语文">李老师（语文）</option>
                <option value="英语">张老师（英语）</option>
                <option value="物理">赵老师（物理）</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-2 h-64" 
                placeholder="请输入消息内容..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600"
              >
                发送
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
