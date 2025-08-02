import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { Student } from '../../../types/student';

interface DashboardHeaderProps {
  studentData: Student | null;
  userEmail: string | null | undefined;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ studentData, userEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "90%" }}>
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-semibold text-gray-900">Home Dashboard</h1>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              state={{
                userData: location.state?.userData,
                dataTimestamp: location.state?.dataTimestamp,
              }}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-110"
              title="College Dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                />
              </svg>
            </Link>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {studentData?.firstName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {studentData?.firstName} {studentData?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {userEmail || 'No email available'}
                  </p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;