// src/modules/auth/services/authApi.ts

import { api } from '../../../shared/services/api';
import { AuthResponse, LoginCredentials, AcceptInvitationPayload, TwoFactorPayload } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    api.post('/login', credentials),

  verify2fa: (data: TwoFactorPayload): Promise<AuthResponse> =>
    api.post('/2fa/verify', data),

  logout: (): Promise<{ success: boolean; message: string }> => 
    api.post('/auth/logout'),

  me: (): Promise<AuthResponse> => 
    api.get('/auth/me'),

  // Yeni Eklenen: Davet Kabul İşlemi
  acceptInvitation: (data: AcceptInvitationPayload): Promise<AuthResponse> =>
    api.post('/invitations/accept', data),
};

export default authApi;