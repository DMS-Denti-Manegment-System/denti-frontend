// src/shared/components/layout/AppLayout.tsx

import React, { useState } from 'react'
import { Layout, Menu, Button, Typography, Space, Avatar, Dropdown, Badge } from 'antd'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BankOutlined,
  SwapOutlined,
  BellOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { usePendingAlertCount } from '@/modules/alerts/hooks/useAlerts'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { DebugInfo } from '@/shared/components/DebugInfo'

const { Header, Sider, Content } = Layout
const { Title } = Typography


export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isSuperAdmin, isCompanyOwner, hasPermission, isAdmin } = usePermissions()
  
  // Bekleyen uyarı sayısını çek (API çağrısı yapacak, 30 saniyede bir güncelleyecek)
  const { data: pendingAlertCount } = usePendingAlertCount()

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout().then(() => navigate('/login'))
    } else if (key === 'profile') {
      navigate('/profile')
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Ana Sayfa',
      onClick: () => navigate('/')
    },
    {
      key: '/stocks',
      icon: <ShoppingCartOutlined />,
      label: 'Stok Yönetimi',
      onClick: () => navigate('/stocks')
    },
    {
      key: '/suppliers',
      icon: <TeamOutlined />,
      label: 'Tedarikçiler',
      onClick: () => navigate('/suppliers')
    },
    {
      key: '/clinics',
      icon: <BankOutlined />,
      label: 'Klinikler', 
      onClick: () => navigate('/clinics')
    },
    {
      key: '/stock-requests',
      icon: <SwapOutlined />,
      label: 'Stok Talepleri',
      onClick: () => navigate('/stock-requests')
    },
    {
      key: '/alerts',
      icon: <BellOutlined />,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: collapsed ? 0 : 8 }}>
          <span>Uyarılar</span>
          {pendingAlertCount !== undefined && pendingAlertCount > 0 && !collapsed && (
            <Badge count={pendingAlertCount} style={{ backgroundColor: '#ff4d4f' }} />
          )}
        </div>
      ),
      onClick: () => navigate('/alerts')
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Raporlar',
      onClick: () => navigate('/reports')
    },
    // Yönetim Alt Menüsü - manage-users yetkisine veya Admin/SuperAdmin/CompanyOwner role sahip kullanıcılara gösterilir
    ...((isAdmin || hasPermission('manage-users')) ? [
      {
        key: 'management',
        icon: <SettingOutlined />,
        label: 'Yönetim',
        children: [
          {
            key: '/employees',
            icon: <TeamOutlined />,
            label: 'Personel Yönetimi',
            onClick: () => navigate('/employees')
          },
          {
            key: '/roles',
            icon: <SafetyCertificateOutlined />,
            label: 'Rol ve Yetkiler',
            onClick: () => navigate('/roles')
          }
        ]
      }
    ] : []),
    // Şirket Yönetimi - Sadece Super Admin role sahip kullanıcılara gösterilir
    ...(isSuperAdmin() ? [
      {
        type: 'divider' as const,
      },
      {
        key: '/admin/companies',
        icon: <AppstoreOutlined />,
        label: 'Şirketler (Admin)',
        onClick: () => navigate('/admin/companies')
      }
    ] : [])
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap'
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)'
        }}
      >
        <div style={{ 
          height: 64, 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              🦷 Denti Management
            </Title>
          )}
          {collapsed && (
            <div style={{ fontSize: '24px' }}>🦷</div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                <span>{user?.name || 'Kullanıcı'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          <Outlet />
          <DebugInfo />
        </Content>
      </Layout>
    </Layout>
  )
}