import React, { useState } from 'react';
import { TeacherHeader } from '../../components/TeacherHeader';
import { format, startOfWeek, differenceInCalendarWeeks } from 'date-fns';
import { course_sidebar } from './course_sidebar';

type ScheduleItem = {
  id: number;
  type: '作业' | '公告';
  title: string;
  description: string;
  datetime: string;
};

export default function CourseSchedulePage() {
//   const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [activeWeekForForm, setActiveWeekForForm] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'>>({
    type: '作业',
    title: '',
    description: '',
    datetime: ''
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: 1,
      type: '公告',
      title: '课程导入说明',
      description: '请阅读本周课程导入内容，准备好第一次讨论课。',
      datetime: '2025-04-01T10:00'
    },
    {
      id: 2,
      type: '作业',
      title: '第一次作业：课程自我介绍',
      description: '请在平台上提交一段简短的自我介绍视频。',
      datetime: '2025-04-03T23:59'
    },
    {
      id: 3,
      type: '作业',
      title: '第二次作业：课程反馈',
      description: '请填写问卷，提供对课程前两周的反馈。',
      datetime: '2025-04-08T23:59'
    }
  ]);
  

  const resetForm = () => {
    setFormData({ type: '作业', title: '', description: '', datetime: '' });
    setActiveWeekForForm(null);
    setEditingItemId(null);
  };

  const handleSubmit = (e: React.FormEvent, week: number) => {
    e.preventDefault();

    if (editingItemId !== null) {
      setScheduleItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId ? { ...item, ...formData } : item
        )
      );
    } else {
      setScheduleItems((prev) => [
        ...prev,
        { ...formData, id: Date.now() }
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: ScheduleItem, week: number) => {
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      datetime: item.datetime
    });
    setEditingItemId(item.id);
    setActiveWeekForForm(week);
  };

  const handleDelete = (id: number) => {
    setScheduleItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) resetForm();
  };

  const getWeekNumber = (dateStr: string) => {
    const date = new Date(dateStr);
    const firstDate = scheduleItems.length
      ? startOfWeek(new Date(Math.min(...scheduleItems.map(i => +new Date(i.datetime)))))
      : startOfWeek(new Date());
    return differenceInCalendarWeeks(date, firstDate) + 1;
  };

  const groupedByWeek = scheduleItems.reduce<Record<number, ScheduleItem[]>>((acc, item) => {
    const week = getWeekNumber(item.datetime);
    if (!acc[week]) acc[week] = [];
    acc[week].push(item);
    return acc;
  }, {});

  const allWeeks = Object.keys(groupedByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  const renderWeekBlock = (week: number) => (
    <div key={week} className="bg-white rounded-2xl shadow p-6 space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">第 {week} 周</h2>
        <button
          onClick={() => {
            resetForm();
            setActiveWeekForForm(week);
          }}
          className="text-sm px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          添加作业 / 公告
        </button>
      </div>

      {/* Form for current week */}
      {activeWeekForForm === week && (
        <form onSubmit={(e) => handleSubmit(e, week)} className="bg-gray-50 p-4 rounded-md space-y-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as '作业' | '公告' })
              }
              className="rounded-md border-gray-300"
            >
              <option value="作业">作业</option>
              <option value="公告">公告</option>
            </select>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              required
              className="rounded-md border-gray-300"
            />
          </div>

          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="标题"
            required
            className="w-full rounded-md border-gray-300"
          />

          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述"
            required
            className="w-full rounded-md border-gray-300"
            rows={3}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              {editingItemId ? '更新' : '添加'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {/* Items for the week */}
      {groupedByWeek[week].map((item) => (
        <div
          key={item.id}
          className="border rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div>
            <span className="text-xs text-indigo-500 font-medium">[{item.type}]</span>
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {format(new Date(item.datetime), 'yyyy-MM-dd HH:mm')}
            </p>
          </div>
          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={() => handleEdit(item, week)}
              className="text-indigo-500 text-sm hover:underline"
            >
              编辑
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 text-sm hover:underline"
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="课程安排"
          description="按周管理作业和公告，支持添加、编辑和删除"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {allWeeks.length === 0 ? (
              <p className="text-sm text-gray-500">暂无安排，点击“添加作业 / 公告”开始。</p>
            ) : (
              allWeeks.map(renderWeekBlock)
            )}
          </div>

          {course_sidebar() }
        </div>
      </div>
    </div>
  );
}
