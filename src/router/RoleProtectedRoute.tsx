// src/router/RoleProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../shared/hooks/usePermissions';
import { Result, Button } from 'antd';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, roles }) => {
  const { hasAnyRole } = usePermissions();

  if (roles && !hasAnyRole(roles)) {
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
  }

  return <>{children}</>;
};
