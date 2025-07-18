import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/dashboard';
import Modal from '../../common/Modal';
import AddScheduleItemForm from './AddScheduleItemForm';
import ScheduleNotesModal from './ScheduleNotesModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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
    case 'athletics':
      return 'bg-gray-200 text-gray-800';
    case 'math':
      return 'bg-purple-300 text-purple-800';
    case 'english':
      return 'bg-pink-300 text-pink-800';
    case 'science':
      return 'bg-green-300 text-green-800';
    case 'history':
      return 'bg-red-300 text-red-800';
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

const TIME_SLOTS = [
  '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00'
];

const getItemPosition = (time: string) => {
  const [start, end] = time.split('-');
  const startIndex = TIME_SLOTS.indexOf(start);
  const endIndex = end ? TIME_SLOTS.indexOf(end) : startIndex + 2; // +2 for 1-hour default
  
  return {
    gridRowStart: startIndex + 1,
    gridRowEnd: endIndex + 1,
  };
};

const scheduleKeyItems = [
  { type: 'athletics', label: 'Athletics' },
  { type: 'math', label: 'Mathematics' },
  { type: 'english', label: 'English' },
  { type: 'science', label: 'Science' },
  { type: 'history', label: 'History' },
  { type: 'language', label: 'Language' },
  { type: 'recess', label: 'Recess' },
  { type: 'college', label: 'College Course' },
  { type: 'club', label: 'Club & Volunteer' },
];

const getTimeSlotHeight = (time: string) => {
  // Check if there's a range and if it's 30 minutes
  const [start, end] = time.split('-');
  if (!end) return 'h-full'; // Single time slot = full height

  const startMinutes = start.split(':').reduce((acc, val, i) => acc + (i === 0 ? parseInt(val) * 60 : parseInt(val)), 0);
  const endMinutes = end.split(':').reduce((acc, val, i) => acc + (i === 0 ? parseInt(val) * 60 : parseInt(val)), 0);
  
  const duration = endMinutes - startMinutes;
  return duration === 30 ? 'h-1/2 mt-0' : 'h-full';
};

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  schedule, 
  onScheduleItemClick,
  onScheduleUpdate,
  customTypeColors = {}
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);

  const handleAddItem = (newItem: Omit<ScheduleItem, 'id'>) => {
    const id = `schedule-${Date.now()}`;
    const itemWithId = { ...newItem, id };
    onScheduleUpdate([...schedule, itemWithId]);
    setIsAddModalOpen(false);
  };

  const handleScheduleItemClick = (item: ScheduleItem) => {
    setSelectedScheduleItem(item);
    setIsNotesModalOpen(true);
  };

  const handleDeleteItem = (deleteAllFuture: boolean) => {
    if (!selectedScheduleItem) return;

    let newSchedule;
    if (deleteAllFuture && selectedScheduleItem.isRecurring) {
      // Delete all future occurrences of this recurring event
      newSchedule = schedule.filter(item => 
        !(item.subject === selectedScheduleItem.subject && 
          item.time === selectedScheduleItem.time && 
          DAYS.indexOf(item.day) >= DAYS.indexOf(selectedScheduleItem.day))
      );
    } else {
      // Delete only this specific event
      newSchedule = schedule.filter(item => 
        !(item.day === selectedScheduleItem.day && 
          item.time === selectedScheduleItem.time && 
          item.subject === selectedScheduleItem.subject)
      );
    }

    onScheduleUpdate(newSchedule);
    setIsNotesModalOpen(false);
    setSelectedScheduleItem(null);
  };

  const handleUpdateColor = (color: string) => {
    if (!selectedScheduleItem) return;

    const newSchedule = schedule.map(item => {
      if (item.type === selectedScheduleItem.type) {
        return { ...item, customColor: color || undefined };
      }
      return item;
    });

    onScheduleUpdate(newSchedule);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Time
              </th>
              {DAYS.map((day) => (
                <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
              <tr key={time}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {time}
                </td>
                {DAYS.map((day) => {
                  const item = schedule.find((s) => s.day === day && (
                    s.time.startsWith(time) || // Exact hour match
                    (s.time.includes('-') && s.time.split('-')[0] === time) // Start of range
                  ));
                  return (
                    <td key={`${day}-${time}`} className="px-2 h-16 text-sm text-gray-500 relative">
                      {item && (
                        <div 
                          className={`${getColorClass(item.type, customTypeColors[item.type] || undefined)} 
                            ${getTimeSlotHeight(item.time)}
                            px-2 w-[150px] mx-auto flex items-center justify-center 
                            rounded-md cursor-pointer hover:opacity-80 transition-opacity text-center`}
                          onClick={() => handleScheduleItemClick(item)}
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Schedule Item"
      >
        <AddScheduleItemForm
          onSubmit={handleAddItem}
          onCancel={() => setIsAddModalOpen(false)}
          existingSchedule={schedule}
        />
      </Modal>

      <ScheduleNotesModal
        scheduleItem={selectedScheduleItem}
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setSelectedScheduleItem(null);
        }}
        onUpdateColor={handleUpdateColor}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default WeeklySchedule;