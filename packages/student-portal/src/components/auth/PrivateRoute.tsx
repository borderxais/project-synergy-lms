import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
}