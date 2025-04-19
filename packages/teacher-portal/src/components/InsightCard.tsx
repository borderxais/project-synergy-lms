import React, { useState } from 'react';
import { TeachingInsight } from '../types/teacher';
import { getInsightIcon, getInsightColor } from '../utils/teacher';

interface InsightCardProps {
  insight: TeachingInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const InsightIcon = getInsightIcon(insight.type);
  const iconColor = getInsightColor(insight.type);

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center mb-2">
        <InsightIcon className={`w-5 h-5 ${iconColor} mr-2`} />
        <h3 className="font-medium text-gray-900 flex-1">{insight.content}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 text-sm hover:underline"
        >
          {expanded ? '收起详情' : '查看详情'}
        </button>
      </div>

      <div className="flex justify-between items-center text-sm mb-2">
        <span
          className={`px-2 py-1 rounded-full font-medium ${
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
      </div>

      {expanded && (
        <div className="text-sm text-gray-700 space-y-2 mt-2">
          <p><strong>问题分析：</strong>{insight.reason}</p>
          <p><strong>建议措施：</strong>{insight.suggestedAction}</p>
        </div>
      )}
    </div>
  );
}