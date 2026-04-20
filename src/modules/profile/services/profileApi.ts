// src/modules/profile/services/profileApi.ts

import { api } from '../../../shared/services/api';
import { ApiResponse } from '../../../shared/types/common.types';
import { User } from '../../auth/types/auth.types';
import { UpdateProfileRequest, UpdatePasswordRequest } from '../types/profile.types';

export const profileApi = {
  /**
   * Updates basic profile information (name, email)
   */
  updateInfo: (data: UpdateProfileRequest): Promise<ApiResponse<User>> =>
    api.put('/profile/info', data),

  /**
   * Updates user password
   */
  updatePassword: (data: UpdatePasswordRequest): Promise<ApiResponse<null>> =>
    api.put('/profile/password', data),
};
