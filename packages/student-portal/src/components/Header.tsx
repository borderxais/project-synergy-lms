import React from 'react';
import { GraduationCap, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserMenu } from './auth/UserMenu';
import { useAuthContext } from './auth/AuthContext';

export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const isDemoPage = location.pathname === '/demo';
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Private School Prep</span>
            </Link>
          </div>
          
          {(isAuthenticated || isDemoPage) && (
            <nav className="hidden sm:flex sm:space-x-8">
              <Link
                to={isDemoPage ? "/demo" : "/dashboard"}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${location.pathname === '/dashboard' || location.pathname === '/demo' 
                    ? 'text-gray-900 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/resources"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${location.pathname === '/resources' 
                    ? 'text-gray-900 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Resources
              </Link>
              <Link
                to="/calendar"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${location.pathname === '/calendar' 
                    ? 'text-gray-900 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Calendar
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {(isAuthenticated || isDemoPage) && (
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
              </button>
            )}
            {!isDemoPage && <UserMenu />}
            {isDemoPage && (
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}