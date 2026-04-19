// src/router/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../shared/stores/authStore';
import { LoadingSpinner } from '../shared/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir, 
    // giriş yaptıktan sonra geri dönebilmesi için mevcut konumu sakla.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
