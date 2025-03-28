import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Task {
  id?: string;
  name: string;
  description: string;
  dueDate: string;
  category: string;
  school: string;
  isCompleted?: boolean;
}

interface TaskEditModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
}

const CATEGORIES = [
  'Test Prep',
  'Application',
  'Essay',
  'Interview',
  'Documents',
  'General'
];

const SCHOOLS = [
  'UCLA',
  'USC',
  'Stanford',
  'Harvard',
  'MIT',
  // Add more schools as needed
];

export function TaskEditModal({ task, isOpen, onClose, onSave }: TaskEditModalProps) {
  const [formData, setFormData] = useState<Task>({
    name: '',
    description: '',
    dueDate: '',
    category: 'General',
    school: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        category: task.category || 'General',
        school: task.school || '',
      });
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        name: '',
        description: '',
        dueDate: tomorrow.toISOString().split('T')[0],
        category: 'General',
        school: '',
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Task, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.school) {
      newErrors.school = 'School is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save task. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full p-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date*
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className={`w-full p-2 border rounded-md ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School*
            </label>
            <select
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className={`w-full p-2 border rounded-md ${
                errors.school ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a school</option>
              {SCHOOLS.map(school => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            {errors.school && (
              <p className="text-red-500 text-xs mt-1">{errors.school}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
              `}
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}