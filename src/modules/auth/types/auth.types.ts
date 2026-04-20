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
  requires_2fa?: boolean; // 2FA requirement flag
  data?: {
    user: User;
    // Token is no longer returned in body, but in secure cookies.
  };
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface TwoFactorPayload {
  code: string;
}

export interface AcceptInvitationPayload {
  token: string;
  name: string;
  password: string;
  password_confirmation: string;
}
