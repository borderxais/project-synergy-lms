import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { Sidebar } from '../teachers/Sidebar';

import { useParams } from 'react-router-dom';

export default function CourseAnnouncementPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement actual send logic here
    console.log({
      subject,
      content,
      attachment,
      scheduledTime,
    });

    setMessage('公告已成功安排发送！');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="发布课程公告"
          description="编辑并安排发送课程公告给所有学生"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-2xl shadow"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  公告主题
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  公告内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  附件（可选）
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setAttachment(e.target.files ? e.target.files[0] : null)
                  }
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  发送时间（可安排未来时间）
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  发送公告
                </button>
              </div>

              {message && (
                <p className="text-green-600 text-sm font-medium">{message}</p>
              )}
            </form>
          </div>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
