import React, { useState } from 'react';
import { Course } from '../../../types/dashboard';
import Modal from '../../common/Modal';

interface CurrentCoursesProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
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

const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses, onCoursesUpdate, customTypeColors = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Current Courses</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Edit Courses"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-4 flex-grow overflow-auto">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg overflow-hidden">
            <div className={`${getColorClass(course.type, customTypeColors[course.type] || undefined)} p-4 rounded-t-lg`}>
              <h3 className="font-medium text-lg">{course.name}</h3>
              <p className="text-sm opacity-90">Instructor: {course.instructor}</p>
            </div>

            <div className="p-4 bg-white">
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${course.progress}%`, backgroundColor: '#6fa68a' }}
                  />
                </div>
              </div>

              {course.nextAssignment && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">Next Assignment:</p>
                  <p className="text-sm">{course.nextAssignment.title}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(course.nextAssignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Courses"
      >
        <div className="space-y-4">
          {/* Content will be added based on your requirements */}
          <p className="text-gray-500 italic">Modal content will be implemented as specified.</p>
        </div>
      </Modal>
    </div>
  );
};

export default CurrentCourses;