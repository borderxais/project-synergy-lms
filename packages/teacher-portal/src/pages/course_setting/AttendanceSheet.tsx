import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { students as allStudents, courses } from '../../data/teacher';
import { Student } from '../../types/teacher';
import { TeacherHeader } from '../../components/TeacherHeader';

const courseStudentMap: Record<string, string[]> = {
  'course-1': ['1', '2'],
  'course-2': ['2', '3'],
  'course-3': ['1', '3']
};

type ExtendedStudent = Student & { total: number };

export default function AttendanceSheet() {
  const { courseId = 'course-1' } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<ExtendedStudent[]>([]);

  useEffect(() => {
    const filtered = allStudents
      .filter((s) => courseStudentMap[courseId]?.includes(s.id))
      .map((s) => ({ ...s, total: 30 }));
    setStudents(filtered);
  }, [courseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/courses/${e.target.value}/attendance-sheet`);
  };

  const handleChange = (id: string, key: 'attendance' | 'total', value: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="出勤记录"
          description="管理各班级学生的出勤情况"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
            <div className="flex justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">选择班级：</label>
              <select
                value={courseId}
                onChange={handleCourseChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">学生姓名</th>
                  <th className="px-4 py-2">已出勤</th>
                  <th className="px-4 py-2">总课次</th>
                  <th className="px-4 py-2">出勤率</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.attendance}
                        onChange={(e) => handleChange(s.id, 'attendance', Number(e.target.value))}
                        className="w-20 border rounded px-2"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.total}
                        onChange={(e) => handleChange(s.id, 'total', Number(e.target.value))}
                        className="w-20 border rounded px-2"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {Math.round((s.attendance / s.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">提示</h2>
              <p className="text-sm text-gray-600">
                出勤数据实时更新，可用于学生档案与课程分析。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
