// src/modules/auth/hooks/useAuth.ts

import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { authApi } from '../services/authApi';
import { LoginCredentials, TwoFactorPayload } from '../types/auth.types';
import { App } from 'antd';

export const useAuth = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Handle 2FA requirement
      if (response.requires_2fa) {
        return { requires2fa: true };
      }

      if (response.success && response.data) {
        setAuth(response.data.user);
        message.success('Giriş başarılı! Hoş geldiniz.');
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verify2fa = async (data: TwoFactorPayload) => {
    setLoading(true);
    try {
      const response = await authApi.verify2fa(data);
      if (response.success && response.data) {
        setAuth(response.data.user);
        message.success('2FA doğrulaması başarılı! Hoş geldiniz.');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('2FA verification error:', error);
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
    // We can check session status even if locally marked as authenticated
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        setAuth(response.data.user);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        storeLogout();
      }
    }
  }, [setAuth, storeLogout]);

  return {
    login,
    verify2fa,
    logout,
    checkSession,
    loading,
    user,
    isAuthenticated
  };
};
