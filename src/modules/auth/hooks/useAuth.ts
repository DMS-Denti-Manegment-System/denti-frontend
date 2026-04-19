// src/modules/auth/hooks/useAuth.ts

import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { authApi } from '../services/authApi';
import { LoginCredentials } from '../types/auth.types';
import { App } from 'antd';

export const useAuth = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        message.success('Giriş başarılı! Hoş geldiniz.');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      // Errors are handled in api interceptor
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      message.success('Başarıyla çıkış yapıldı.');
    }
  };

  const checkSession = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authApi.me();
      if (response.success) {
        // Token is still valid
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        storeLogout();
      }
    }
  }, [isAuthenticated, storeLogout]);

  return {
    login,
    logout,
    checkSession,
    loading,
    user,
    isAuthenticated
  };
};
