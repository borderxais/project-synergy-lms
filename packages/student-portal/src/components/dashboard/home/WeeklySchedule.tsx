import React from 'react';
import { ScheduleItem } from '../../../types/dashboard';

interface WeeklyScheduleProps {
  schedule: ScheduleItem[];
  onScheduleItemClick: (item: ScheduleItem) => void;
}

const getColorClass = (type: string) => {
  switch (type) {
    case 'fencing':
      return 'bg-red-300 text-red-800';
    case 'education':
      return 'bg-purple-300 text-purple-800';
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

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule, onScheduleItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
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
                          className={`${getColorClass(item.type)} px-2 h-full flex items-center justify-center rounded-md cursor-pointer hover:opacity-80 transition-opacity text-center`}
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
          <div className="bg-red-300 text-red-800 px-2 py-1 rounded-md text-sm">Fencing Practice</div>
          <div className="bg-purple-300 text-purple-800 px-2 py-1 rounded-md text-sm">General Education</div>
          <div className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-sm">Recess</div>
          <div className="bg-orange-200 text-orange-800 px-2 py-1 rounded-md text-sm">College Course</div>
          <div className="bg-blue-300 text-blue-800 px-2 py-1 rounded-md text-sm">Club & Volunteer</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;