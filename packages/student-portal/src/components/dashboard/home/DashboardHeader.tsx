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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-semibold text-gray-900">Home Dashboard</h1>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              state={{
                userData: location.state?.userData,
                dataTimestamp: location.state?.dataTimestamp,
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              College Dashboard
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