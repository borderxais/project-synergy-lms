import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const SubjectDetail = ({ subject, onBack }) => {
  const [activeTab, setActiveTab] = useState('homework');
  
  // Mock data for subject details
  const subjectData = {
    '数学': {
      teacher: '王老师',
      recentScore: 92,
      homework: [
        { id: 1, title: '三角函数练习题', date: '3月22日', status: 'completed', score: 95 },
        { id: 2, title: '概率统计作业', date: '3月18日', status: 'completed', score: 88 },
        { id: 3, title: '立体几何习题', date: '3月15日', status: 'completed', score: 92 },
        { id: 4, title: '函数图像分析', date: '3月10日', status: 'completed', score: 90 }
      ],
      wrongProblems: [
        { id: 1, question: '已知sin(α)=0.6，求cos(2α)的值。', answer: '0.28', userAnswer: '0.64', date: '3月18日' },
        { id: 2, question: '在球O中，点P到球心O的距离为2，点P到球面的最短距离是1，求球的半径。', answer: '3', userAnswer: '√5', date: '3月15日' },
        { id: 3, question: '已知f(x)=x²-2x+1，求f(x)的最小值。', answer: '0', userAnswer: '1', date: '3月10日' }
      ]
    },
    '语文': {
      teacher: '李老师',
      recentScore: 88,
      homework: [
        { id: 1, title: '古文阅读理解', date: '3月21日', status: 'completed', score: 90 },
        { id: 2, title: '现代文写作', date: '3月17日', status: 'completed', score: 85 },
        { id: 3, title: '诗词鉴赏', date: '3月14日', status: 'completed', score: 92 }
      ],
      wrongProblems: [
        { id: 1, question: '下列词语中加点字的读音完全正确的一项是（ ）', answer: 'C', userAnswer: 'B', date: '3月17日' },
        { id: 2, question: '下列句子中没有语病的一项是（ ）', answer: 'D', userAnswer: 'A', date: '3月14日' }
      ]
    },
    '英语': {
      teacher: '张老师',
      recentScore: 95,
      homework: [
        { id: 1, title: '完形填空练习', date: '3月23日', status: 'pending', score: null },
        { id: 2, title: '阅读理解作业', date: '3月19日', status: 'completed', score: 96 },
        { id: 3, title: '英语写作', date: '3月16日', status: 'completed', score: 92 }
      ],
      wrongProblems: [
        { id: 1, question: 'She _____ in this company for five years before she moved to another city.', answer: 'had worked', userAnswer: 'has worked', date: '3月16日' }
      ]
    },
    '物理': {
      teacher: '赵老师',
      recentScore: 86,
      homework: [
        { id: 1, title: '电磁学练习题', date: '3月20日', status: 'completed', score: 88 },
        { id: 2, title: '力学计算题', date: '3月16日', status: 'completed', score: 85 },
        { id: 3, title: '波动光学作业', date: '3月13日', status: 'completed', score: 80 }
      ],
      wrongProblems: [
        { id: 1, question: '电荷量为q的粒子，在电场强度为E的匀强电场中运动，则粒子所受电场力大小为多少？', answer: 'qE', userAnswer: 'qE/2', date: '3月20日' },
        { id: 2, question: '质量为m的物体以速度v撞上静止的质量为2m的物体，若为完全弹性碰撞，则碰撞后第一个物体的速度为多少？', answer: '-v/3', userAnswer: '-v/2', date: '3月16日' },
        { id: 3, question: '一束单色光从空气射入某介质中，若折射角为30°，入射角为45°，则该介质的折射率为多少？', answer: '√2', userAnswer: '√3/2', date: '3月13日' }
      ]
    }
  };
  
  const data = subjectData[subject] || subjectData['数学'];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject}课业详情</h1>
            <p className="text-gray-600">任课教师：{data.teacher} | 最近得分：{data.recentScore}分</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('homework')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'homework'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              近期作业
            </button>
            <button
              onClick={() => setActiveTab('wrongProblems')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'wrongProblems'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              错题记录
            </button>
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'homework' && (
            <>
              <h2 className="text-xl font-semibold mb-4">近期作业</h2>
              <div className="space-y-4">
                {data.homework.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">提交日期：{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {item.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                            <span className="font-medium">{item.score}分</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-amber-500 mr-1" />
                            <span className="text-amber-500 font-medium">待提交</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'wrongProblems' && (
            <>
              <h2 className="text-xl font-semibold mb-4">错题记录</h2>
              <div className="space-y-6">
                {data.wrongProblems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">题目：{item.question}</h3>
                        <p className="text-sm text-gray-600">日期：{item.date}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-600">正确答案</p>
                        <p className="font-medium text-green-600">{item.answer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">学生答案</p>
                        <p className="font-medium text-red-500">{item.userAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;