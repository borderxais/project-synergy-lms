import React from 'react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export function NavigationTabs({ activeTab, setActiveTab, tabs }: NavigationTabsProps) {
  return (
    <div className="mb-8">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}