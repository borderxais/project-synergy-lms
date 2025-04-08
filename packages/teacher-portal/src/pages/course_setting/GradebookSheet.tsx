import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { students as baseStudents, courses } from '../../data/teacher';
import { TeacherHeader } from '../../components/TeacherHeader';

const courseStudentMap: Record<string, string[]> = {
  'course-1': ['1', '2'],
  'course-2': ['2', '3'],
  'course-3': ['1', '3']
};

type GradeMap = Record<string, number>;

export default function GradebookSheet() {
  const { courseId = 'course-1' } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState(
    baseStudents.filter((s) => courseStudentMap['course-1'].includes(s.id)).map((s) => ({
      ...s,
      grades: {
        作业一: 85,
        作业二: 90,
      } as GradeMap
    }))
  );

  useEffect(() => {
    const filtered = baseStudents
      .filter((s) => courseStudentMap[courseId]?.includes(s.id))
      .map((s) => ({
        ...s,
        grades: {
          作业一: 85,
          作业二: 90,
        } as GradeMap
      }));
    setStudents(filtered);
  }, [courseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/courses/${e.target.value}/gradebook`);
  };

  const handleChange = (id: string, assignment: string, value: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, grades: { ...s.grades, [assignment]: value } } : s
      )
    );
  };

  const allAssignments = Object.keys(
    students.reduce((acc, s) => ({ ...acc, ...s.grades }), {} as GradeMap)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title="成绩记录"
          description="查看并记录学生各项作业和考试成绩"
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
                  {allAssignments.map((assignment) => (
                    <th key={assignment} className="px-4 py-2">{assignment}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{s.name}</td>
                    {allAssignments.map((assignment) => (
                      <td key={assignment} className="px-4 py-2">
                        <input
                          type="number"
                          value={s.grades[assignment] || 0}
                          onChange={(e) =>
                            handleChange(s.id, assignment, Number(e.target.value))
                          }
                          className="w-20 border rounded px-2"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">建议</h2>
              <p className="text-sm text-gray-600">
                成绩记录将用于期末评估和学生档案，建议及时录入。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
