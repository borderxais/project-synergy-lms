import React, { useState } from 'react';
import { Course } from '../../../types/dashboard';
import Modal from '../../common/Modal';

const COURSE_TYPES = [
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

interface EditCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
}

const emptyCourse: Omit<Course, 'id'> = {
  name: '',
  instructor: '',
  progress: 0,
  type: 'athletics',
  grade: { percentage: 0, letter: '' },
  room: '',
  nextAssignment: { title: '', dueDate: '' },
};

const EditCoursesModal: React.FC<EditCoursesModalProps> = ({ isOpen, onClose, courses, onCoursesUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);
  const [showForm, setShowForm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...courses[index] });
    setShowForm(true);
    setError('');
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setForm(emptyCourse);
    setShowForm(true);
    setError('');
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = courses.filter((_, i) => i !== deleteIndex);
      onCoursesUpdate(updated);
      setDeleteIndex(null);
    }
  };

  const handleFormChange = (field: keyof Omit<Course, 'id'>, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGradeChange = (field: 'percentage' | 'letter', value: any) => {
    setForm(prev => ({ ...prev, grade: { ...prev.grade, [field]: value } }));
  };

  const handleNextAssignmentChange = (field: 'title' | 'dueDate', value: any) => {
    setForm(prev => ({
      ...prev,
      nextAssignment: {
        title: field === 'title' ? value : prev.nextAssignment?.title || '',
        dueDate: field === 'dueDate' ? value : prev.nextAssignment?.dueDate || '',
      }
    }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.instructor.trim()) {
      setError('Course name and instructor are required.');
      return;
    }
    if (editingIndex !== null) {
      // Edit existing
      const updated = courses.map((c, i) => (i === editingIndex ? { ...c, ...form } : c));
      onCoursesUpdate(updated);
    } else {
      // Add new
      const newCourse: Course = {
        ...form,
        id: `course-${Date.now()}`,
      };
      onCoursesUpdate([...courses, newCourse]);
    }
    setShowForm(false);
    setEditingIndex(null);
    setForm(emptyCourse);
    setError('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setForm(emptyCourse);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Courses">
      <div className="space-y-6">
        {/* Course List */}
        {!showForm && (
          <>
            <button
              onClick={handleAdd}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              + Add Course
            </button>
            <ul className="divide-y">
              {courses.map((course, i) => (
                <li key={course.id} className="flex items-center justify-between py-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900">{course.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Delete Confirmation */}
        {deleteIndex !== null && (
          <div className="flex flex-col items-center space-y-3">
            <p className="text-red-600">Are you sure you want to delete this course?</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit/Add Form */}
        {showForm && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name*</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleFormChange('name', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor*</label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={e => handleFormChange('instructor', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  type="text"
                  value={form.room}
                  onChange={e => handleFormChange('room', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => handleFormChange('type', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  {COURSE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.grade.percentage}
                  onChange={e => handleGradeChange('percentage', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Letter</label>
                <input
                  type="text"
                  value={form.grade.letter}
                  onChange={e => handleGradeChange('letter', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={e => handleFormChange('progress', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Assignment Title</label>
                <input
                  type="text"
                  value={form.nextAssignment?.title || ''}
                  onChange={e => handleNextAssignmentChange('title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Assignment Due Date</label>
                <input
                  type="date"
                  value={form.nextAssignment?.dueDate || ''}
                  onChange={e => handleNextAssignmentChange('dueDate', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EditCoursesModal; 