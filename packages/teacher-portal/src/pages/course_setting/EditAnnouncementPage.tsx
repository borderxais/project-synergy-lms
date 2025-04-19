import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function EditAnnouncementPage() {
  const { announcementId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Simulate fetching data by ID
    if (announcementId === '1') {
      setTitle('第3周将进行小测');
      setContent('请同学们准备第3周的内容，将进行小测验。');
    } else if (announcementId === '2') {
      setTitle('本周作业已发布');
      setContent('请大家在本周五前提交。');
    }
  }, [announcementId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">编辑公告 #{announcementId}</h1>
      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
          保存更改
        </button>
      </div>
    </div>
  );
} 