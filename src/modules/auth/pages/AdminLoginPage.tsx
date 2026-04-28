// src/modules/auth/pages/AdminLoginPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../components/AdminLoginForm';
import { useAuthStore } from '../../../shared/stores/authStore';

export const AdminLoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)'
    }}>
      <AdminLoginForm />
    </div>
  );
};
