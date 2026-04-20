// src/modules/users/types/user.types.ts

import { Role } from '../../roles/types/role.types';

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
}

export interface UpdateUserPayload {
  name: string;
  is_active: boolean;
  roles: string[]; // Role names or IDs
}

export interface InviteUserPayload {
  email: string;
  role: string;
}
