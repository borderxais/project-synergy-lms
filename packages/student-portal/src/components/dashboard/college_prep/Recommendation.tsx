// src/components/dashboard/Recommendations.tsx
import React from 'react';

interface RecommendationProps {
  recommendations?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    actions?: Array<{
      text: string;
      completed?: boolean;
    }>;
  }>;
  onToggleAction?: (recommendationId: string, actionIndex: number) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Recommendations: React.FC<RecommendationProps> = ({ recommendations = [], onToggleAction }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recommendations available yet</p>
        <p className="text-sm text-gray-400 mt-2">Recommendations will be generated based on your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recommendations.map((recommendation) => (
        <div key={recommendation.id} className="py-2 flex items-start">
          <div className="text-blue-600 mr-2 mt-1">•</div>
          <div className="flex-grow">
            <div className="flex justify-between">
              <div className="flex-grow">
                {recommendation.title ? (
                  <h3 className="font-medium text-lg text-gray-900">{recommendation.title}</h3>
                ) : null}
                
                <p className="text-gray-700 font-medium">{recommendation.description}</p>
                
                {recommendation.actions && recommendation.actions.length > 0 && (
                  <div className="mt-2 pl-4">
                    <ul className="list-disc space-y-1">
                      {recommendation.actions.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={action.completed}
                            onChange={() => onToggleAction && onToggleAction(recommendation.id, index)}
                            className="mt-0.5 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${action.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {action.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="ml-4 min-w-[100px]">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)} text-center inline-block`}>
                  {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;