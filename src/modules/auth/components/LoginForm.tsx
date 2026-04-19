// src/modules/auth/components/LoginForm.tsx

import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const onFinish = async (values: any) => {
    const success = await login(values);
    if (success) {
      navigate('/stocks');
    }
  };

  return (
    <Card 
      style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 12 }}
      styles={{ body: { padding: '32px' } }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>🦷 Denti</Title>
        <Text type="secondary">Klinik Yönetim Paneli</Text>
      </div>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }, { type: 'email', message: 'Geçerli bir e-posta girin!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-posta" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Şifre"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 45, borderRadius: 8 }}>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
