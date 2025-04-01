import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { subjectDetails } from '../data/mockData';

function SubjectDetail() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('homework');

  const data = subjectDetails[subjectName] || subjectDetails['数学'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subjectName}课业详情</h1>
            <p className="text-gray-600">任课教师：{data.teacher} | 最近得分：{data.recentScore}分</p>
          </div>
        </div>

        {/* 导航标签 */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('homework')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'homework'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              近期作业
            </button>
            <button
              onClick={() => setActiveTab('wrongProblems')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'wrongProblems'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              错题记录
            </button>
          </nav>
        </div>

        {/* 内容区域 */}
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
}

export default SubjectDetail;