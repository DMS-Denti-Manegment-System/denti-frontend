// src/modules/auth/hooks/useAuth.ts

import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { authApi } from '../services/authApi';
import { LoginCredentials, TwoFactorPayload } from '../types/auth.types';
import { App } from 'antd';

export const useAuth = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const {
    setAuth,
    logout: storeLogout,
    setSessionValidated,
    user,
    isAuthenticated,
    isSessionValidated,
    permissions
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Handle 2FA requirement
      if (response.requires_2fa) {
        return { requires2fa: true };
      }

      if (response.success && response.data) {
        // ✅ Backend'den gelen permissions array'ini store'a yaz
        setAuth(response.data.user, response.data.permissions ?? []);
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

  const adminLogin = async (credentials: Omit<LoginCredentials, 'clinic_code'>) => {
    setLoading(true);
    try {
      const response = await authApi.adminLogin(credentials);
      
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.permissions ?? []);
        message.success('Admin girişi başarılı! Hoş geldiniz.');
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      console.error('Admin login error:', error);
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
        // ✅ 2FA sonrası da permissions backend'den alınıyor
        setAuth(response.data.user, response.data.permissions ?? []);
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

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      message.success('Başarıyla çıkış yapıldı.');
    }
  }, [storeLogout, message]);

  /**
   * Uygulama açılışında sunucu taraflı session geçerliliğini doğrular.
   * Her iki durumda da (başarılı / 401) isSessionValidated = true yapılır
   * böylece ProtectedRoute yükleme ekranından çıkar.
   *
   * Auth Flicker önlemi: localStorage'daki user var olsa bile,
   * /auth/me 401 dönerse logout yapılır ve login sayfasına yönlendirilir.
   */
  const checkSession = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        // ✅ Session yenilenirken permissions de güncelleniyor
        setAuth(response.data.user, response.data.permissions ?? []);
      } else {
        setSessionValidated(true);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        storeLogout(); // localStorage + state temizle, isSessionValidated: false → tekrar false
        setSessionValidated(true); // Ama artık "doğrulandı: giriş yok" durumu
      } else {
        // Ağ hatası vs. — yine de validated sayalım, login sayfasına atma
        setSessionValidated(true);
      }
    }
  }, [setAuth, storeLogout, setSessionValidated]);

  return {
    login,
    adminLogin,
    verify2fa,
    logout,
    checkSession,
    loading,
    user,
    isAuthenticated,
    isSessionValidated,
    permissions
  };
};

