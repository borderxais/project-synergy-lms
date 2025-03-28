import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('[PROTECTED_ROUTE] Current path:', location.pathname);
    console.log('[PROTECTED_ROUTE] Auth state:', { token: token?.substring(0, 10), isAuthenticated });
  }, [location.pathname, token, isAuthenticated]);

  if (!isAuthenticated || !token) {
    console.log('[PROTECTED_ROUTE] Not authenticated, redirecting to login');
    // Redirect to login if there's no token or not authenticated
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('[PROTECTED_ROUTE] Authenticated, rendering protected content');
  return <>{children}</>;
};
