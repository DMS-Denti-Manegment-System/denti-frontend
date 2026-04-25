// src/router/RoleProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../shared/hooks/usePermissions';
import { Result, Button } from 'antd';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, roles, permissions }) => {
  const { hasAnyRole, hasAnyPermission, isSuperAdmin } = usePermissions();

  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  const roleCheckPassed = roles ? hasAnyRole(roles) : false;
  const permissionCheckPassed = permissions ? hasAnyPermission(permissions) : false;
  
  // If neither are provided, allow access
  if (!roles && !permissions) {
    return <>{children}</>;
  }

  // If at least one check is passed, allow access
  if (roleCheckPassed || permissionCheckPassed) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <Result
        status="403"
        title="403"
        subTitle="Bu sayfaya erişim yetkiniz bulunmamaktadır."
        extra={
          <Button type="primary" onClick={() => window.location.href = '/'}>
            Ana Sayfaya Dön
          </Button>
        }
      />
    </div>
  );
};
