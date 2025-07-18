import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/dashboard';

interface AddScheduleItemFormProps {
  onSubmit: (item: Omit<ScheduleItem, 'id'>) => void;
  onCancel: () => void;
  existingSchedule: ScheduleItem[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Generate time slots with :00 and :30 intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) {
    slots.push(`${hour}:00`);
    if (hour < 17) {  // Don't add :30 for the last hour
      slots.push(`${hour}:30`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const SUBJECT_TYPES = [
  { value: 'athletics', label: 'Athletics', color: 'bg-gray-200 text-gray-800' },
  { value: 'math', label: 'Mathematics', color: 'bg-purple-300 text-purple-800' },
  { value: 'english', label: 'English', color: 'bg-pink-300 text-pink-800' },
  { value: 'science', label: 'Science', color: 'bg-green-300 text-green-800' },
  { value: 'history', label: 'History', color: 'bg-red-300 text-red-800' },
  { value: 'language', label: 'Language', color: 'bg-amber-300 text-amber-800' },
  { value: 'recess', label: 'Recess', color: 'bg-yellow-200 text-yellow-800' },
  { value: 'college', label: 'College Course', color: 'bg-orange-200 text-orange-800' },
  { value: 'club', label: 'Club & Volunteer', color: 'bg-blue-300 text-blue-800' },
];

const AddScheduleItemForm: React.FC<AddScheduleItemFormProps> = ({
  onSubmit,
  onCancel,
  existingSchedule
}) => {
  const [formData, setFormData] = useState({
    day: DAYS[0],
    startTime: '8:00',
    endTime: '9:00',
    subject: '',
    type: SUBJECT_TYPES[0].value as ScheduleItem['type'],
    notes: [''],
    room: '',
    instructor: '',
    isRecurring: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    if (formData.endTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Check for time slot conflicts
    const timeConflict = existingSchedule.some(item => {
      if (item.day !== formData.day) return false;
      
      const itemStart = item.time.split('-')[0];
      const itemEnd = item.time.split('-')[1] || itemStart;
      const newItemEnd = formData.endTime || formData.startTime;

      return (formData.startTime >= itemStart && formData.startTime <= itemEnd) ||
             (newItemEnd >= itemStart && newItemEnd <= itemEnd);
    });

    if (timeConflict) {
      newErrors.time = 'Time slot conflicts with an existing schedule item';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const time = formData.endTime 
      ? `${formData.startTime}-${formData.endTime}`
      : formData.startTime;

    const notes = formData.notes.filter(note => note.trim() !== '');

    onSubmit({
      day: formData.day,
      time,
      subject: formData.subject,
      type: formData.type,
      notes: notes.length > 0 ? notes : undefined,
      room: formData.room || undefined,
      instructor: formData.instructor || undefined,
      isRecurring: formData.isRecurring
    });
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...formData.notes];
    newNotes[index] = value;
    
    // Add new empty note field if last field is not empty
    if (index === newNotes.length - 1 && value.trim() !== '') {
      newNotes.push('');
    }
    
    // Remove empty notes except the last one
    const filteredNotes = newNotes.filter((note, i) => 
      i === newNotes.length - 1 || note.trim() !== ''
    );

    setFormData(prev => ({ ...prev, notes: filteredNotes }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Day and Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <select
            value={formData.day}
            onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <select
            value={formData.startTime}
            onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <select
            value={formData.endTime}
            onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            className={`w-full rounded-md border px-3 py-2 ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select end time</option>
            {TIME_SLOTS.filter(time => {
              // Convert times to minutes for comparison
              const startMinutes = formData.startTime.split(':').reduce((acc, val, i) => acc + (i === 0 ? parseInt(val) * 60 : parseInt(val)), 0);
              const currentMinutes = time.split(':').reduce((acc, val, i) => acc + (i === 0 ? parseInt(val) * 60 : parseInt(val)), 0);
              return currentMinutes > startMinutes;
            }).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <input
            type="text"
            value={formData.room}
            onChange={e => setFormData(prev => ({ ...prev, room: e.target.value }))}
            placeholder="e.g., ALP 1300"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Subject Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name*
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            className={`w-full rounded-md border ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
            required
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SUBJECT_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value as ScheduleItem['type'] }))}
                className={`${type.color} px-3 py-2 rounded-md text-sm transition-opacity
                  ${formData.type === type.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:opacity-80'}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructor (Optional)
          </label>
          <input
            type="text"
            value={formData.instructor}
            onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <div className="space-y-2">
            {formData.notes.map((note, index) => (
              <input
                key={index}
                type="text"
                value={note}
                onChange={e => handleNoteChange(index, e.target.value)}
                placeholder={index === 0 ? "Add a note" : "Add another note"}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurring"
            checked={formData.isRecurring}
            onChange={e => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
            Repeat weekly
          </label>
        </div>
      </div>

      {errors.time && (
        <p className="text-red-500 text-sm">{errors.time}</p>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Add Schedule Item
        </button>
      </div>
    </form>
  );
};

export default AddScheduleItemForm; 