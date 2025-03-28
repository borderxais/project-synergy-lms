import React from 'react';
import { TeachingInsight } from '../../types/teacher';
import { getInsightIcon, getInsightColor } from '../../utils/teacher';

interface InsightCardProps {
  insight: TeachingInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const InsightIcon = getInsightIcon(insight.type);
  const iconColor = getInsightColor(insight.type);

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center mb-2">
        <InsightIcon className={`w-5 h-5 ${iconColor} mr-2`} />
        <h3 className="font-medium text-gray-900">{insight.content}</h3>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span
          className={`px-2 py-1 rounded-full ${
            insight.impact === 'high'
              ? 'bg-red-100 text-red-700'
              : insight.impact === 'medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {insight.impact === 'high'
            ? '高优先级'
            : insight.impact === 'medium'
            ? '中优先级'
            : '低优先级'}
        </span>
        <button className="text-blue-500 hover:text-blue-600">查看详情</button>
      </div>
    </div>
  );
}