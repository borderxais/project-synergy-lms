import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Timeline } from '../components/demo/timeline/Timeline';
import { MainContent } from '../components/demo/MainContent';
import { DocumentStatus } from '../components/demo/DocumentStatus';
import { ResourcePreview } from '../components/demo/ResourcePreview';
import { KeyDates } from '../components/demo/KeyDates';
import { Progress } from '../components/ui/Progress';
import { DEMO_DATA } from '../data/demoData';
import { MONTHLY_DATA } from '../data/timeline/monthlyData';
import { KEY_DATES } from '../data/timeline/keyDates';
import { useTaskProgress } from '../hooks/useTaskProgress';
import { useLocalProgress } from '../hooks/useLocalProgress';

export function DemoPage() {
  const [selectedMonth, setSelectedMonth] = useState({ name: 'Jan', year: 2025 });
  const monthKey = `${selectedMonth.name}-${selectedMonth.year}`;
  const { getOverallProgress } = useTaskProgress(monthKey);
  
  // Initialize local storage progress tracking
  useLocalProgress();

  const handleMonthSelect = (month: { name: string; year: number }) => {
    setSelectedMonth(month);
  };

  const currentMonthData = MONTHLY_DATA[monthKey] || {
    milestones: [],
    weeks: [],
    events: []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to the Journey!
            </h1>
            <p className="text-gray-600">
              Viewing timeline for {selectedMonth.name} {selectedMonth.year}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <Progress value={getOverallProgress()} size="lg" />
          </div>
        </div>

        {/* Timeline */}
        <Timeline selectedMonth={selectedMonth} onMonthSelect={handleMonthSelect} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Milestones & Tasks */}
          <div className="lg:col-span-2">
            <MainContent
              monthlyData={currentMonthData}
              monthKey={monthKey}
            />
          </div>

          {/* Right Column: Key Dates, Documents & Resources */}
          <div className="space-y-6">
            <KeyDates dates={KEY_DATES} />
            <DocumentStatus
              documents={DEMO_DATA.documents}
              onUpload={(name) => console.log(`Upload ${name}`)}
            />
            <ResourcePreview
              resources={DEMO_DATA.resources}
              onView={(id) => console.log(`View resource ${id}`)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}