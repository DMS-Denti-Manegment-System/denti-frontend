// src/App.tsx

import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, App as AntdApp } from 'antd'
import trTR from 'antd/locale/tr_TR'
import { Router } from './router'
import { useAuth } from './modules/auth/hooks/useAuth'
import { AntdStaticHelper } from './shared/utils/antdHelper'

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,   // ✅ 1 dakika (5 dk'ıdan indirildi)
      gcTime: 1000 * 60 * 5,      // ✅ Garbage collect 5 dakika
      refetchOnWindowFocus: true,  // ✅ Sekme'ye dönünce tazele
      refetchOnReconnect: true,    // ✅ İnternet yeniden bağlanınca tazele
      retry: 1,                    // Oturum hatalarında çok fazla retry yapmasın
    },
  },
})

const AppContent = () => {
  const { checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <Router />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider 
        locale={trTR}
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
            colorSuccess: '#52c41a',
            colorWarning: '#faad14', 
            colorError: '#ff4d4f',
          },
        }}
      >
        <AntdApp>
          <AntdStaticHelper>
            <AppContent />
          </AntdStaticHelper>
        </AntdApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App