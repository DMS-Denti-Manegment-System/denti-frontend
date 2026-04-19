// src/modules/auth/services/authApi.ts

import { api } from '../../../shared/services/api';
import { AuthResponse, LoginCredentials } from '../types/auth.types';

export const authApi = {
  // Login doğru, backend'deki Route::post('/login', ...) ile eşleşiyor.
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    api.post('/login', credentials),
    
  // HATA BURADAYDI: api.post('/logout') yazıyordu. 
  // Backend'de prefix var, bu yüzden /auth/logout olmalı.
  logout: (): Promise<{ success: boolean; message: string }> => 
    api.post('/auth/logout'),
    
  // HATA BURADAYDI: api.get('/user') yazıyordu. 
  // Backend'de Route::get('/auth/me', ...) olarak tanımlı.
  me: (): Promise<AuthResponse> => 
    api.get('/auth/me'), 
};

export default authApi;