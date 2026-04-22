// src/shared/hooks/usePermissions.ts

import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasRole = useCallback((roleName: string): boolean => {
    if (!user) return false;
    
    const target = roleName.toLowerCase().trim();
    
    // 1. Check legacy role field (string)
    if (user.role) {
      const r = user.role.toLowerCase();
      if (r === 'admin') return true; // admin is master role
      if (r === target) return true;
      if (r === 'clinic_manager' && target === 'clinic manager') return true;
    }

    // 2. Check roles array (Spatie / Roles objects)
    if (Array.isArray(user.roles)) {
      return user.roles.some((role: any) => {
        const name = (typeof role === 'string' ? role : role?.name || '').toLowerCase().trim();
        if (name === 'admin') return true;
        if (name === target) return true;
        // Handle common variations
        if (name.replace(/[-_]/g, ' ') === target.replace(/[-_]/g, ' ')) return true;
        return false;
      });
    }
    
    return false;
  }, [user]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    return roleNames.some(role => hasRole(role));
  }, [hasRole]);

  // Boolean values for easier internal logic
  const isSuperAdminVal = useMemo(() => hasRole('Super Admin'), [hasRole]);
  const isCompanyOwnerVal = useMemo(() => hasRole('Company Owner'), [hasRole]);

  return {
    hasRole,
    hasAnyRole,
    // Returned as functions for backward compatibility with AppLayout.tsx
    isSuperAdmin: () => isSuperAdminVal,
    isCompanyOwner: () => isCompanyOwnerVal,
    // Extra useful flags
    isAdmin: isSuperAdminVal || isCompanyOwnerVal,
    userRoles: user?.roles?.map((r: any) => typeof r === 'string' ? r : r.name) || (user?.role ? [user.role] : []),
  };
};
