import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/dashboard';

interface ScheduleNotesModalProps {
  scheduleItem: ScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateColor: (color: string) => void;
}

const colorOptions = [
  { name: 'Default', class: 'bg-gray-100 text-gray-800 border border-gray-300' },
  { name: 'Red', class: 'bg-red-300 text-red-800' },
  { name: 'Purple', class: 'bg-purple-300 text-purple-800' },
  { name: 'Pink', class: 'bg-pink-300 text-pink-800' },
  { name: 'Green', class: 'bg-green-300 text-green-800' },
  { name: 'Gray', class: 'bg-gray-300 text-gray-800' },
  { name: 'Brown', class: 'bg-amber-300 text-amber-800' },
  { name: 'Yellow', class: 'bg-yellow-200 text-yellow-800' },
  { name: 'Orange', class: 'bg-orange-200 text-orange-800' },
  { name: 'Blue', class: 'bg-blue-300 text-blue-800' },
];

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

const ScheduleNotesModal: React.FC<ScheduleNotesModalProps> = ({ 
  scheduleItem, 
  isOpen, 
  onClose,
  onUpdateColor 
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  if (!isOpen || !scheduleItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className={`${getColorClass(scheduleItem.type, scheduleItem.customColor)} px-6 py-4 relative`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{scheduleItem.subject}</h3>
              <p className="text-sm opacity-90">{scheduleItem.day}, {scheduleItem.time}</p>
            </div>
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
              title="Change Color"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
              </svg>
            </button>
          </div>
          
          {/* Color Picker Dropdown */}
          {isColorPickerOpen && (
            <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg border p-3 z-10">
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      onUpdateColor(color.class);
                      setIsColorPickerOpen(false);
                    }}
                    className={`w-8 h-8 rounded-full ${color.class} hover:opacity-80 transition-opacity`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
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