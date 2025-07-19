import React, { useState } from 'react';
import { Course } from '../../../types/dashboard';
import Modal from '../../common/Modal';
import EditCoursesModal from './EditCoursesModal';

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

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          {/* Progress circle */}
          <circle
            className="text-green-600"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute text-xl font-semibold">{progress}%</span>
      </div>
      <span className="text-xs font-normal text-gray-400 mt-1">Progress</span>
    </div>
  );
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
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="font-medium text-lg line-clamp-2 inherit-text-color">{course.name}</h3>
                  <p className="text-sm opacity-90 inherit-text-color">Instructor: {course.instructor}</p>
                  {course.room && (
                    <p className="text-sm opacity-90 inherit-text-color">Room: {course.room}</p>
                  )}
                </div>
                  <div className="bg-white bg-opacity-20 px-2.5 py-0.5 rounded-full flex-shrink-0 inherit-text-color">
                    <span className="text-sm font-medium">
                      {typeof course.grade === 'object' 
                        ? course.grade?.letter || 'N/A'
                        : course.grade || 'N/A'
                      }
                    </span>
                  </div>
              </div>
            </div>

            <div className="p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {course.nextAssignment && (
                    <div>
                      <p className="text-sm font-medium">Next Assignment:</p>
                      <p className="text-sm">{course.nextAssignment.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(course.nextAssignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <CircularProgress progress={course.progress} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditCoursesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
        onCoursesUpdate={onCoursesUpdate}
      />
    </div>
  );
};

export default CurrentCourses;