import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/dashboard';
import Modal from '../../common/Modal';

interface WeeklyScheduleProps {
  schedule: ScheduleItem[];
  onScheduleItemClick: (item: ScheduleItem) => void;
  onScheduleUpdate: (schedule: ScheduleItem[]) => void;
  customTypeColors?: Record<string, string | null>;
}

const getColorClass = (type: string, customColor?: string) => {
  if (customColor) {
    return customColor;
  }

  switch (type) {
    case 'fencing':
      return 'bg-red-300 text-red-800';
    case 'math':
      return 'bg-purple-300 text-purple-800';
    case 'english':
      return 'bg-pink-300 text-pink-800';
    case 'science':
      return 'bg-green-300 text-green-800';
    case 'history':
      return 'bg-gray-300 text-gray-800';
    case 'language':
      return 'bg-amber-300 text-amber-800';
    case 'recess':
      return 'bg-yellow-200 text-yellow-800';
    case 'college':
      return 'bg-orange-200 text-orange-800';
    case 'club':
      return 'bg-blue-300 text-blue-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const scheduleKeyItems = [
  { type: 'fencing', label: 'Fencing Practice' },
  { type: 'math', label: 'Mathematics' },
  { type: 'english', label: 'English' },
  { type: 'science', label: 'Science' },
  { type: 'history', label: 'History' },
  { type: 'language', label: 'Language' },
  { type: 'recess', label: 'Recess' },
  { type: 'college', label: 'College Course' },
  { type: 'club', label: 'Club & Volunteer' },
];

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  schedule, 
  onScheduleItemClick,
  onScheduleUpdate,
  customTypeColors = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Add Schedule Item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <div className="w-full flex-grow">
        <table className="w-full divide-y divide-gray-200 h-full">
          {/* Table header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Time
              </th>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
              <tr key={time}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {time}
                </td>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const item = schedule.find((s) => s.day === day && s.time.startsWith(time));
                  return (
                    <td key={`${day}-${time}`} className="px-2 h-16 text-sm text-gray-500">
                      {item && (
                        <div 
                          className={`${getColorClass(item.type, customTypeColors[item.type] || undefined)} px-2 h-full w-[150px] mx-auto flex items-center justify-center rounded-md cursor-pointer hover:opacity-80 transition-opacity text-center`}
                          onClick={() => onScheduleItemClick(item)}
                        >
                          {item.subject}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Key */}
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule Key:</h3>
        <div className="flex flex-wrap gap-2">
          {scheduleKeyItems.map(item => (
            <div 
              key={item.type}
              className={`${getColorClass(item.type, customTypeColors[item.type] || undefined)} px-2 py-1 rounded-md text-sm`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Schedule Item"
      >
        <div className="space-y-4">
          {/* Content will be added based on your requirements */}
          <p className="text-gray-500 italic">Modal content will be implemented as specified.</p>
        </div>
      </Modal>
    </div>
  );
};

export default WeeklySchedule;