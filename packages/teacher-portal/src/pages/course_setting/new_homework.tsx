import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { course_sidebar } from './course_sidebar';

export default function HomeworkPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [totalStudents, setTotalStudents] = useState(50); // mock data
  const [submittedStudents, setSubmittedStudents] = useState(20); // mock data
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with actual submission logic
    console.log({
      name,
      description,
      attachment,
    });

    setMessage('作业已成功发布！');
  };

  const progressPercentage = Math.round((submittedStudents / totalStudents) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="作业发布与管理"
          description="编辑作业内容并查看学生提交进度"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-2xl shadow"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  作业名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  作业描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  上传附件（可选）
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
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  发布作业
                </button>
              </div>

              {message && (
                <p className="text-green-600 text-sm font-medium">{message}</p>
              )}
            </form>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                提交进度
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                已提交：{submittedStudents} / {totalStudents} ({progressPercentage}%)
              </p>
            </div>
          </div>

          {course_sidebar()}
        </div>
      </div>
    </div>
  );
}
