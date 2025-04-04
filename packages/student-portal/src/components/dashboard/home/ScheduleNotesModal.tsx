import React from 'react';
import { ScheduleItem } from '../../../types/dashboard';

interface ScheduleNotesModalProps {
  scheduleItem: ScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
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

const ScheduleNotesModal: React.FC<ScheduleNotesModalProps> = ({ scheduleItem, isOpen, onClose }) => {
  if (!isOpen || !scheduleItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className={`${getColorClass(scheduleItem.type)} px-6 py-4`}>
          <h3 className="text-lg font-medium">{scheduleItem.subject}</h3>
          <p className="text-sm opacity-90">{scheduleItem.day}, {scheduleItem.time}</p>
        </div>
        
        <div className="px-6 py-4">
          <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
          {scheduleItem.notes && scheduleItem.notes.length > 0 ? (
            <ul className="space-y-2">
              {scheduleItem.notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No additional notes.</p>
          )}
        </div>
        
        <div className="px-6 py-3 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleNotesModal;