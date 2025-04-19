import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function EditAssignmentPage() {
  const { assignmentId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (assignmentId === '1') {
      setTitle('作业一：函数极限计算');
      setDescription('请完成课本第3章所有奇数编号习题。');
      setDueDate('2025-04-10');
    } else if (assignmentId === '2') {
      setTitle('作业二：导数定义与几何意义');
      setDescription('结合几何图像，完成第4章应用题练习。');
      setDueDate('2025-04-17');
    }
  }, [assignmentId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">编辑作业 #{assignmentId}</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
