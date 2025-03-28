import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

interface StudentHeaderProps {
  title: string;
  description: string;
}

export function StudentHeader({ title, description }: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>返回首页</span>
      </button>
    </div>
  );
}