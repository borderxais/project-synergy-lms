import React from 'react';
import { BookOpen, PenTool, Users, FileText, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';

const categories = [
  { id: 'test-prep', label: 'Test Preparation', icon: PenTool },
  { id: 'academic', label: 'Academic Resources', icon: BookOpen },
  { id: 'interview', label: 'Interview Preparation', icon: Users },
  { id: 'documents', label: 'Application Documents', icon: FileText },
  { id: 'general', label: 'General Guidance', icon: HelpCircle },
];

interface ResourceCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function ResourceCategories({
  selectedCategory,
  onSelectCategory,
}: ResourceCategoriesProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() =>
                onSelectCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}