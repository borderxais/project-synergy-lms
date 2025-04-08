import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { students as allStudents, courses } from '../../data/teacher';
import { TeacherHeader } from '../../components/TeacherHeader';

const courseStudentMap: Record<string, string[]> = {
  'course-1': ['1', '2'],
  'course-2': ['2', '3'],
  'course-3': ['1', '3']
};

export default function ParticipationSheet() {
  const { courseId = 'course-1' } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState(allStudents);

  useEffect(() => {
    const filtered = allStudents.filter((s) =>
      courseStudentMap[courseId]?.includes(s.id)
    );
    setStudents(filtered);
  }, [courseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/courses/${e.target.value}/participation-sheet`);
  };

  const handleChange = (id: string, value: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, participation: value } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="课堂参与度"
          description="查看并编辑各班级学生在课堂上的活跃程度"
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
                  <th className="px-4 py-2">参与度评分 (%)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.participation}
                        onChange={(e) =>
                          handleChange(s.id, Number(e.target.value))
                        }
                        className="w-24 border rounded px-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">教学建议</h2>
              <p className="text-sm text-gray-600">
                鼓励学生积极参与课堂互动，提升课堂氛围和学习效率。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
