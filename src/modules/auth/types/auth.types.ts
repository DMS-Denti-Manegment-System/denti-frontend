// src/modules/auth/types/auth.types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'clinic_manager';
  clinic_id?: number;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export interface LoginCredentials {
  email: string;
  password?: string; // Şimdilik opsiyonel, bazı sistemler sadece email ile başlayabilir
}
