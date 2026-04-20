// src/router/index.tsx

import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../shared/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleProtectedRoute } from './RoleProtectedRoute'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { AcceptInvitationPage } from '../modules/auth/pages/AcceptInvitationPage' 
import { StocksPage } from '../modules/stock/pages/StocksPage'
import { SuppliersPage } from '../modules/supplier/pages/SuppliersPage'
import { ClinicsPage } from '../modules/clinics/pages/ClinicsPage'
import { StockRequestsPage } from '@/modules/stockRequest/pages/StockRequestsPage'
import { AlertsPage } from '@/modules/alerts/pages/AlertsPage'
import { ReportsPage } from '../modules/reports/pages/ReportsPage'
import { CompanyManagementPage } from '../modules/admin/pages/CompanyManagementPage'
import { UserManagementPage } from '../modules/users/pages/UserManagementPage'
import { RolesPage } from '../modules/roles/pages/RolesPage'
import { ProfilePage } from '../modules/profile/pages/ProfilePage'


const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/accept-invitation/:token',
    element: <AcceptInvitationPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/stocks" replace />
      },
      {
        path: 'stocks',
        element: <StocksPage />
      },
      {
        path: 'suppliers',
        element: <SuppliersPage />
      },
      {
        path: 'clinics',
        element: <ClinicsPage />
      },
      {
        path: 'stock-requests',
        element: <StockRequestsPage />
      },
      {
        path: 'alerts',
        element: <AlertsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'employees',
        element: (
          <RoleProtectedRoute roles={['Company Owner']}>
            <UserManagementPage />
          </RoleProtectedRoute>
        )
      },
      {
        path: 'roles',
        element: (
          <RoleProtectedRoute roles={['Company Owner']}>
            <RolesPage />
          </RoleProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'admin/companies',
        element: (
          <RoleProtectedRoute roles={['Super Admin']}>
            <CompanyManagementPage />
          </RoleProtectedRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/stocks" replace />
  }
])

export const Router: React.FC = () => {
  return <RouterProvider router={router} />
}
