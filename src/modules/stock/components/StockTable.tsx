// src/modules/stock/components/StockTable.tsx

import React from 'react'
import { Table, Tag, Tooltip, Space, Button, Dropdown, Modal } from 'antd'
import { 
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  MinusOutlined,
  PlusOutlined,
  CalendarOutlined,
  ShopOutlined,
  BankOutlined,
  ExclamationCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  StopOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import { Stock } from '../types/stock.types'
import { StockLevelBadge } from './StockLevelBadge'

interface StockTableProps {
  stocks: Stock[]
  loading: boolean
  onEdit: (stock: Stock) => void
  onDelete: (id: number) => void          // ✅ YENİ - Standart Akıllı Silme
  onSoftDelete: (id: number) => void      // Pasif yap
  onHardDelete: (id: number) => void      // Zorla (Force) kalıcı sil
  onReactivate: (id: number) => void      // Aktif et
  onAdjust: (stock: Stock) => void
  onUse: (stock: Stock) => void
}

export const StockTable: React.FC<StockTableProps> = ({
  stocks,
  loading,
  onEdit,
  onDelete,         // Standart Delete
  onSoftDelete,     // Deactivate
  onHardDelete,     // Force Delete
  onReactivate,     // Reactivate
  onAdjust,
  onUse,
}) => {
  const [advancedModalStock, setAdvancedModalStock] = React.useState<Stock | null>(null)

  // Standart Silme Onayı
  const handleDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: 'Stoku Silmek İstediğinize Emin Misiniz?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bu işlem, stok kullanım geçmişine göre ya kalıcı olarak siler ya da otomatik olarak pasife alır.',
      okText: 'Evet, Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: () => {
        onDelete(id);
      }
    });
  };

  const handleAdvancedDelete = (record: Stock) => {
    setAdvancedModalStock(record);
  };

  // Status hesaplama - DÜZELTİLMİŞ VERSİYON
  const getStockStatus = (record: Stock) => {
    console.log('🔍 Stock Debug:', {
      name: record.name,
      status: record.status,
      is_active: record.is_active,
      type: typeof record.is_active
    })

    // Backend'den status field'ı varsa öncelik ver
    if (record.status) {
      if (record.status === 'deleted') return { type: 'deleted', text: '🗑️ Silindi', color: 'red' }
      if (record.status === 'inactive') return { type: 'inactive', text: '⏸️ Pasif', color: 'orange' }
      if (record.status === 'active') return { type: 'active', text: '✅ Aktif', color: 'green' }
    }

    // is_active field'ına göre değerlendir - STRICT CHECK
    if (record.is_active === false) {
      return { type: 'inactive', text: '⏸️ Pasif', color: 'orange' }
    }
    
    // Default olarak aktif kabul et (true, null, undefined için)
    return { type: 'active', text: '✅ Aktif', color: 'green' }
  }

  const columns: ColumnsType<Stock> = [
    {
      title: 'Ürün Bilgileri',
      key: 'product_info',
      width: 300,
      render: (_, record) => {
        const status = getStockStatus(record)
        
        return (
          <div>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: 4,
              opacity: status.type === 'deleted' ? 0.5 : 1,
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none',
              color: status.type === 'deleted' ? '#999' : 'inherit'
            }}>
              {record.name}
              {status.type === 'deleted' && (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  🗑️ SİLİNDİ
                </Tag>
              )}
              {status.type === 'inactive' && (
                <Tag color="orange" style={{ marginLeft: 8 }}>
                  ⏸️ PASİF
                </Tag>
              )}
            </div>
            {record.brand && (
              <Tag 
                color="blue" 
                style={{ 
                  opacity: status.type === 'deleted' ? 0.5 : 1 
                }}
              >
                {record.brand}
              </Tag>
            )}
            {record.description && (
              <div style={{ 
                fontSize: 12, 
                color: status.type === 'deleted' ? '#ccc' : '#666', 
                marginTop: 4,
                textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
              }}>
                {record.description}
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => (
        <Tag color="geekblue">{category}</Tag>
      ),
    },
    {
      title: 'Mevcut Stok',
      key: 'current_stock',
      width: 180,
      align: 'center',
      render: (_, record) => {
        const status = getStockStatus(record)
        
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontWeight: 600, 
              fontSize: 16,
              color: record.current_stock === 0 ? '#999' : 
                     status.type === 'deleted' ? '#ccc' : 'inherit',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
            }}>
              {record.current_stock}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: status.type === 'deleted' ? '#ccc' : '#666',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none',
              marginBottom: record.has_sub_unit ? '8px' : '0'
            }}>
              {record.unit}
            </div>
            {record.has_sub_unit && (
              <>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 14,
                  color: record.current_sub_stock === 0 ? '#999' : 
                         status.type === 'deleted' ? '#ccc' : '#1890ff',
                  textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
                }}>
                  + {record.current_sub_stock} Açık
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: status.type === 'deleted' ? '#ccc' : '#1890ff',
                  textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
                }}>
                  {record.sub_unit_name} (Top: {record.total_base_units})
                </div>
              </>
            )}
          </div>
        )
      },
    },
    {
      title: 'Durum',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const status = getStockStatus(record)
        
        return (
          <div>
            <Tag color={status.color}>
              {status.text}
            </Tag>
            {status.type === 'active' && <StockLevelBadge stock={record} />}
          </div>
        )
      },
    },
    {
      title: 'Min/Kritik',
      key: 'limits',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const status = getStockStatus(record)
        
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 12,
              color: status.type === 'deleted' ? '#ccc' : 'inherit',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
            }}>
              Min: {record.min_stock_level}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: status.type === 'deleted' ? '#ccc' : '#ff4d4f',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
            }}>
              Kritik: {record.critical_stock_level}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Fiyat',
      key: 'price',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const status = getStockStatus(record)
        
        return (
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontWeight: 600,
              color: status.type === 'deleted' ? '#ccc' : 'inherit',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
            }}>
              {record.purchase_price} {record.currency || 'TRY'}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: status.type === 'deleted' ? '#ccc' : '#666',
              textDecoration: status.type === 'deleted' ? 'line-through' : 'none'
            }}>
              Toplam: {(record.purchase_price * record.current_stock).toLocaleString()} {record.currency || 'TRY'}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Son Kullanma',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      width: 120,
      align: 'center',
      render: (expiry_date) => {
        if (!expiry_date) return <span style={{ color: '#999' }}>-</span>
        
        const expiryDate = dayjs(expiry_date)
        const today = dayjs()
        const daysLeft = expiryDate.diff(today, 'day')
        
        let color = 'green'
        if (daysLeft <= 0) color = 'red'
        else if (daysLeft <= 7) color = 'orange'
        else if (daysLeft <= 30) color = 'yellow'
        
        return (
          <Tooltip title={`${daysLeft} gün kaldı`}>
            <Tag color={color} icon={<CalendarOutlined />}>
              {expiryDate.format('DD/MM/YYYY')}
            </Tag>
          </Tooltip>
        )
      },
    },
    {
      title: 'Tedarikçi',
      key: 'supplier',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>
            <ShopOutlined /> {record.supplier?.name || 'Bilinmiyor'}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            <BankOutlined /> {record.clinic?.name || 'Bilinmiyor'}
          </div>
        </div>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const status = getStockStatus(record)
        const isDeleted = status.type === 'deleted'
        const isInactive = status.type === 'inactive'
        
        const menuItems: MenuProps['items'] = [
          {
            key: 'adjust',
            label: 'Stok Ayarla',
            icon: <PlusOutlined />,
            onClick: () => onAdjust(record),
            disabled: isDeleted || isInactive
          },
          {
            key: 'use',
            label: 'Stok Kullan',
            icon: <MinusOutlined />,
            onClick: () => onUse(record),
            disabled: isDeleted || isInactive || record.current_stock <= 0
          },
          {
            type: 'divider'
          },
          {
            key: 'edit',
            label: 'Düzenle',
            icon: <EditOutlined />,
            onClick: () => onEdit(record),
            disabled: isDeleted
          },
          {
            key: 'delete-standard',
            label: 'Sil (Güvenli)',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteConfirm(record.id),
            disabled: isDeleted
          },
          {
            key: 'delete-options',
            label: 'Gelişmiş Seçenekler',
            icon: <MoreOutlined />,
            onClick: () => handleAdvancedDelete(record)
          }
        ]

        return (
          <Space>
            <Tooltip title={isDeleted || isInactive ? 'Pasif/Silinmiş stok düzenlenemez' : 'Düzenle'}>
              <Button 
                type="text" 
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                disabled={isDeleted}
              />
            </Tooltip>
            
            <Tooltip title="Stok Kullan (Düş)">
              <Button 
                type="text" 
                size="small"
                icon={<MinusOutlined />}
                onClick={() => onUse(record)}
                disabled={isDeleted || isInactive || record.current_stock <= 0}
              />
            </Tooltip>

            <Tooltip title="Güvenli Sil">
              <Button 
                type="text" 
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteConfirm(record.id)}
                disabled={isDeleted}
              />
            </Tooltip>
            
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  return (
    <>
    <Table
      columns={columns}
      dataSource={stocks}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} / ${total} ürün`,
      }}
      scroll={{ x: 1600 }}
      size="middle"
      onRow={(record) => {
        const status = getStockStatus(record)
        return {
          style: {
            backgroundColor: 
              status.type === 'deleted' ? '#fff2f0' : 
              status.type === 'inactive' ? '#fffbe6' : 
              undefined,
            opacity: 
              status.type === 'deleted' ? 0.6 : 
              status.type === 'inactive' ? 0.8 : 
              1,
          }
        }
      }}
    />

    {/* Gelişmiş Seçenekler Modalı */}
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <span>Gelişmiş Durum & Güvenlik İşlemleri</span>
        </div>
      }
      open={!!advancedModalStock}
      onCancel={() => setAdvancedModalStock(null)}
      footer={null}
      width={500}
      destroyOnClose
    >
      {advancedModalStock && (
        <div>
          <p><strong>Stok:</strong> {advancedModalStock.name}</p>
          <p><strong>Mevcut Durum:</strong> {
             advancedModalStock.status === 'deleted' ? '🗑️ Silinmiş' : 
             advancedModalStock.is_active === false ? '⏸️ Pasif' : 
             '✅ Aktif'
          }</p>
          
          <div style={{ background: '#fff1f0', padding: 12, borderRadius: 6, margin: '16px 0' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#cf1322' }}>
              <strong>⚠️ Zorla Silme (Force Delete):</strong><br/>
              İşlem geçmişi olan stokları bile zorla siler. Raporlarda tutarsızlığa neden olabilir.
            </p>
          </div>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setAdvancedModalStock(null)}>İptal</Button>
            
            {/* Pasife Al */}
            {advancedModalStock.is_active !== false && advancedModalStock.status !== 'deleted' && (
              <Button 
                icon={<PauseOutlined />}
                onClick={async () => {
                  await onSoftDelete(advancedModalStock.id)
                  setAdvancedModalStock(null)
                }}
              >
                Pasife Al
              </Button>
            )}

            {/* Aktif Et */}
            {advancedModalStock.is_active === false && advancedModalStock.status !== 'deleted' && (
              <Button 
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={async () => {
                  await onReactivate(advancedModalStock.id)
                  setAdvancedModalStock(null)
                }}
              >
                Aktif Et
              </Button>
            )}

            {/* Zorla Sil */}
            {advancedModalStock.status !== 'deleted' && (
              <Button 
                type="primary" 
                danger 
                icon={<StopOutlined />}
                onClick={async () => {
                  await onHardDelete(advancedModalStock.id)
                  setAdvancedModalStock(null)
                }}
              >
                Zorla Sil
              </Button>
            )}
          </Space>
        </div>
      )}
    </Modal>
    </>
  )
}