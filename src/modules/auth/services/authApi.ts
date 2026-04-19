// src/modules/auth/services/authApi.ts

import { api } from '../../../shared/services/api';
import { AuthResponse, LoginCredentials } from '../types/auth.types';

export const authApi = {
  // Try /login instead of /auth/login
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    api.post('/login', credentials),
    
  logout: (): Promise<{ success: boolean; message: string }> => 
    api.post('/logout'),
    
  me: (): Promise<AuthResponse> => 
    api.get('/user'), // Updated to /user for standard Laravel compatibility
};

export default authApi;
