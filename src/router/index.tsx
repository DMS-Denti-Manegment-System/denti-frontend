// src/router/index.tsx

import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../shared/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../modules/auth/pages/LoginPage'
// Yeni sayfayı import et
import { AcceptInvitationPage } from '../modules/auth/pages/AcceptInvitationPage' 
import { StocksPage } from '../modules/stock/pages/StocksPage'
import { SuppliersPage } from '../modules/supplier/pages/SuppliersPage'
import { ClinicsPage } from '../modules/clinics/pages/ClinicsPage'
import { StockRequestsPage } from '@/modules/stockRequest/pages/StockRequestsPage'
import { AlertsPage } from '@/modules/alerts/pages/AlertsPage'
import { ReportsPage } from '@/modules/reports/pages/ReportsPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  // Davet kabul rotası eklendi
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
      // ... diğer mevcut rotalar
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