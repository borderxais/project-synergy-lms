import React, { useState, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useOnClickOutside(menuRef, () => setIsOpen(false));

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="text-gray-500 hover:text-gray-700"
      >
        <User className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 bg-white rounded-md">
            <div className="px-4 py-2 text-sm text-gray-700 border-b bg-white">
              <p className="font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center bg-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}