import React from 'react';
import { ExternalLink, FileText, Video, Link as LinkIcon } from 'lucide-react';
import { ResourceItem } from '../../types';
import { Card } from '../ui/Card';

interface ResourceListProps {
  resources: ResourceItem[];
}

export function ResourceList({ resources }: ResourceListProps) {
  const getResourceIcon = (type: ResourceItem['type']) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'link':
        return LinkIcon;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const Icon = getResourceIcon(resource.type);
        return (
          <Card key={resource.id} className="flex items-start space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {resource.description}
                  </p>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  Open
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}