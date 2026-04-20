// src/modules/users/services/userApi.ts

import { api } from '../../../shared/services/api';
import { ApiResponse } from '../../../shared/types/common.types';
import { User, UpdateUserPayload, InviteUserPayload } from '../types/user.types';

export const userApi = {
  // Klinik personel listesini getir
  getAll: (): Promise<ApiResponse<User[]>> => 
    api.get('/users'),

  // Personel bilgilerini güncelle
  update: (id: number, data: UpdateUserPayload): Promise<ApiResponse<User>> => 
    api.put(`/users/${id}`, data),

  // Personeli klinikten sil
  delete: (id: number): Promise<ApiResponse<null>> => 
    api.delete(`/users/${id}`),

  // Yeni personel davet et (Email ile)
  inviteUser: (data: InviteUserPayload): Promise<ApiResponse<User>> => 
    api.post('/invitations', data),
};
