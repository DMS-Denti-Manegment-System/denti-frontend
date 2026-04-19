// src/modules/auth/pages/LoginPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../../../shared/stores/authStore';

export const LoginPage: React.FC = () => {
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
      background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)'
    }}>
      <LoginForm />
    </div>
  );
};
