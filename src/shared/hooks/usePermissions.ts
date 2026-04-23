// src/shared/hooks/usePermissions.ts

import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user, permissions } = useAuthStore();

  /**
   * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder.
   * Rol bilgisi localStorage'daki user.roles array'inden alınır.
   *
   * ⚠️ Not: Bu kontrol client-side'da yapılır ve UI gösterimi için kullanılır.
   * Gerçek yetki kısıtlaması her zaman backend middleware/policy tarafından uygulanmalıdır.
   */
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

  /**
   * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder.
   *
   * ✅ Güvenli: İzin listesi backend'den alınır ve store'a yazılır.
   * Client tarafında manipüle edilemez (localStorage'a persist edilmez).
   *
   * Kullanım:
   *   const { hasPermission } = usePermissions()
   *   if (hasPermission('approve-stock-request')) { ... }
   */
  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!user || !permissions || permissions.length === 0) return false;
    return permissions.includes(permissionName);
  }, [user, permissions]);

  /**
   * Kullanıcının belirtilen izinlerden en az birine sahip olup olmadığını kontrol eder.
   */
  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    return permissionNames.some(p => hasPermission(p));
  }, [hasPermission]);

  // Boolean values for easier internal logic
  const isSuperAdminVal = useMemo(() => hasRole('Super Admin'), [hasRole]);
  const isCompanyOwnerVal = useMemo(() => hasRole('Company Owner'), [hasRole]);

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    // Returned as functions for backward compatibility with AppLayout.tsx
    isSuperAdmin: () => isSuperAdminVal,
    isCompanyOwner: () => isCompanyOwnerVal,
    // Extra useful flags
    isAdmin: isSuperAdminVal || isCompanyOwnerVal,
    userRoles: user?.roles?.map((r: any) => typeof r === 'string' ? r : r.name) || (user?.role ? [user.role] : []),
    userPermissions: permissions,
  };
};
