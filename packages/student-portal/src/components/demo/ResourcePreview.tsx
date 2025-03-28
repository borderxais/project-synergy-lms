import React from 'react';
import { ExternalLink, FileText, Video, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'practice_test';
  description: string;
}

interface ResourcePreviewProps {
  resources?: Resource[];
  onView?: (resourceId: string) => void;
}

const defaultResources: Resource[] = [
  {
    id: 'default-1',
    title: 'Getting Started Guide',
    type: 'document',
    description: 'Learn how to use our platform effectively'
  },
  {
    id: 'default-2',
    title: 'SAT Prep Overview',
    type: 'video',
    description: 'Introduction to SAT preparation'
  }
];

export function ResourcePreview({ resources = defaultResources, onView = () => {} }: ResourcePreviewProps) {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'practice_test':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Featured Resources</h3>
        <button className="text-sm text-blue-600 hover:text-blue-500">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={() => onView(resource.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                {getResourceIcon(resource.type)}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {resource.title}
                </h4>
                <p className="text-xs text-gray-500">{resource.description}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </Card>
  );
}