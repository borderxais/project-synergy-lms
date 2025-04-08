import { useParams, useNavigate } from 'react-router-dom';
import { students } from '../../data/teacher';
import { TeacherHeader } from '../../components/TeacherHeader';

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        未找到该学生信息。
      </div>
    );
  }

  const courseId = 'course-1'; // Default for now

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherHeader
          title={`学生档案：${student.name}`}
          description="查看该学生在出勤、参与和成绩方面的表现"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">出勤情况</h2>
                <button
                  onClick={() => navigate(`/courses/${courseId}/attendance-sheet`)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  查看出勤表
                </button>
              </div>
              <p className="text-sm text-gray-600">出勤次数：{student.attendance} / 30</p>
              <p className="text-sm text-gray-600">出勤率：{Math.round((student.attendance / 30) * 100)}%</p>
            </div>

            {/* Participation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">课堂参与</h2>
                <button
                  onClick={() => navigate(`/courses/${courseId}/participation-sheet`)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  查看参与表
                </button>
              </div>
              <p className="text-sm text-gray-600">平均发言次数：3 次/课</p>
              <p className="text-sm text-gray-600">参与度评分：{student.participation}%</p>
            </div>

            {/* Gradebook */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">成绩记录</h2>
                <button
                  onClick={() => navigate(`/courses/${courseId}/gradebook`)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  查看成绩表
                </button>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>作业一：85</li>
                <li>作业二：90</li>
                <li>小测验：92</li>
                <li>期中考试：88</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">学生状态</h2>
              <p className="text-sm text-gray-600">
                当前情绪：{student.emotionalState === 'positive' ? '积极' : student.emotionalState === 'neutral' ? '中性' : '需关注'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                最近表现：{student.recentPerformance === 'improving' ? '进步中' : student.recentPerformance === 'stable' ? '稳定' : '需关注'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
