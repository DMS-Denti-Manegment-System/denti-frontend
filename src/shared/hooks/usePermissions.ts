// src/shared/hooks/usePermissions.ts

import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => roleNames.includes(role.name));
  };

  const isSuperAdmin = (): boolean => hasRole('Super Admin');
  const isCompanyOwner = (): boolean => hasRole('Company Owner');

  return {
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isCompanyOwner,
    userRoles: user?.roles?.map(r => r.name) || [],
  };
};
