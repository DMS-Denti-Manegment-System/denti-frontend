// src/modules/alerts/components/AlertDashboard.tsx

import React from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress,
  Space,
  Typography,
  Alert as AntAlert,
  Spin
} from 'antd'
import { 
  BellOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { useAlertStats, useActiveAlerts } from '../hooks/useAlerts'
import { AlertSeverityBadge } from './AlertSeverityBadge'
import { AlertTypeBadge } from './AlertTypeBadge'
import { AlertType } from '../types/alert.types' // ✅ AlertType import eklendi

const { Text } = Typography

interface AlertDashboardProps {
  clinicId?: number
}

export const AlertDashboard: React.FC<AlertDashboardProps> = ({ clinicId }) => {
  const { data: stats, isLoading: statsLoading } = useAlertStats(clinicId)
  const { data: activeAlerts, isLoading: alertsLoading } = useActiveAlerts(clinicId)

  if (statsLoading || alertsLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Uyarı verileri yükleniyor...</div>
        </div>
      </Card>
    )
  }

  const criticalAlerts = activeAlerts?.filter(alert => alert.severity === 'critical') || []
  const highAlerts = activeAlerts?.filter(alert => alert.severity === 'high') || []

  return (
    <div>
      {/* Kritik Uyarı Banner */}
      {criticalAlerts.length > 0 && (
        <AntAlert
          message={`${criticalAlerts.length} kritik uyarı var!`}
          description="Hemen müdahale edilmesi gereken kritik uyarılar bulunmaktadır."
          type="error"
          icon={<FireOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Space>
              <Text strong style={{ color: '#ff4d4f' }}>
                Kritik: {criticalAlerts.length}
              </Text>
            </Space>
          }
        />
      )}

      {/* Yüksek Öncelik Uyarı Banner */}
      {highAlerts.length > 0 && criticalAlerts.length === 0 && (
        <AntAlert
          message={`${highAlerts.length} yüksek öncelikli uyarı var`}
          description="Dikkat edilmesi gereken uyarılar bulunmaktadır."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* İstatistik Kartları */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Toplam Aktif Uyarı"
              value={stats?.total_active || 0}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Düşük Stok"
              value={stats?.low_stock || 0}
              prefix={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Kritik Stok"
              value={stats?.critical_stock || 0}
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12}>
          <Card>
            <Statistic
              title="Son Kullanması Yaklaşan"
              value={stats?.near_expiry || 0}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={12} sm={12}>
          <Card>
            <Statistic
              title="Süresi Geçmiş"
              value={stats?.expired || 0}
              prefix={<CloseCircleOutlined style={{ color: '#595959' }} />}
              valueStyle={{ color: '#595959' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}