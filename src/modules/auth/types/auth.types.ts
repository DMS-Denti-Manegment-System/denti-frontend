// src/modules/auth/types/auth.types.ts

export interface Role {
  id: number;
  name: string;
  guard_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'clinic_manager'; // Legacy field?
  roles?: Role[]; // Spatie roles
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

export interface AcceptInvitationPayload {
  token: string;
  name: string;
  password: string;
  password_confirmation: string;
}
