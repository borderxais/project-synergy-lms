import React from 'react';
import { Course } from '../../../types/dashboard';

interface CurrentCoursesProps {
  courses: Course[];
}

const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Courses</h2>
      <div className="space-y-4 flex-grow overflow-auto">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4">
            <h3 className="font-medium text-lg">{course.name}</h3>
            <p className="text-gray-600 text-sm">Instructor: {course.instructor}</p>

            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
  className="h-2.5 rounded-full"
  style={{ width: `${course.progress}%`, backgroundColor: '#6fa68a' }}
></div>
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
        ))}
      </div>
    </div>
  );
};

export default CurrentCourses;