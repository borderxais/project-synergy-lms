import React from 'react';
import { Brain, Users } from 'lucide-react';
import { InsightCard } from '../../components/InsightCard';
import { insights } from '../../data/teacher';

export function InsightList() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">AI教学建议</h2>
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">教学效果分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Brain className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="font-medium text-gray-900">知识点掌握度</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">78%</p>
            <p className="text-sm text-gray-600 mt-1">较上周提升3个百分点</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-gray-900">课堂参与度</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">85%</p>
            <p className="text-sm text-gray-600 mt-1">学生互动明显增加</p>
          </div>
        </div>
      </div>
    </div>
  );
}