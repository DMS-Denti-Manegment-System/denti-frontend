// src/modules/stock/components/StockFilters.tsx

import React from 'react'
import { Card, Row, Col, Input, Select, Button, Space } from 'antd'
import { PlusOutlined, ReloadOutlined, TagsOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { StockFilter } from '../types/stock.types'
import { useCategories } from '@/modules/category/hooks/useCategories'

const { Search } = Input
const { Option } = Select

interface StockFiltersProps {
  onSearch: (value: string) => void
  onFilterChange: (field: keyof StockFilter, value: string | number | undefined) => void
  onAdd: () => void
}

export const StockFilters: React.FC<StockFiltersProps> = ({
  onSearch,
  onFilterChange,
  onAdd,
}) => {
  const navigate = useNavigate()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const levelOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Düşük Seviye', value: 'low' },
    { label: 'Kritik Seviye', value: 'critical' },
    { label: 'Süresi Geçmiş', value: 'expired' }
  ]

  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={16} align="middle">
        <Col xs={24} md={6}>
          <Search
            placeholder="Stok adı ile ara..."
            onSearch={onSearch}
            style={{ width: '100%' }}
            allowClear
          />
        </Col>
        
        <Col xs={12} md={5}>
          <Select
            placeholder="Kategori"
            style={{ width: '100%' }}
            allowClear
            loading={isCategoriesLoading}
            onChange={(value) => onFilterChange('category', value)}
          >
            {(categories ?? []).map(option => (
              <Option key={option.id} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} md={4}>
          <Select
            placeholder="Seviye"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange('level', value)}
          >
            {levelOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} md={4}>
          <Select
            placeholder="Durum"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange('status', value)}
          >
            <Option value="active">Aktif</Option>
            <Option value="inactive">Pasif</Option>
            <Option value="expired">Süresi Geçmiş</Option>
          </Select>
        </Col>
        
        <Col xs={24} md={5} style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              icon={<TagsOutlined />} 
              onClick={() => navigate('/stock-categories')}
            >
              Kategorileri Yönet
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAdd}
            >
              Yeni Stok
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}