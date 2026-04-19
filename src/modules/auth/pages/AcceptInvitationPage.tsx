// src/modules/auth/pages/AcceptInvitationPage.tsx

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { AcceptInvitationPayload } from '../types/auth.types';

const { Title, Text } = Typography;

export const AcceptInvitationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  // Token yoksa girişe yönlendir
  if (!token) {
    navigate('/login');
    return null;
  }

  const onFinish = async (values: Omit<AcceptInvitationPayload, 'token'>) => {
    setLoading(true);
    try {
      const payload: AcceptInvitationPayload = {
        ...values,
        token,
      };

      const response = await authApi.acceptInvitation(payload);

      if (response.success) {
        message.success('Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Accept invitation error:', error);
      // Axios interceptor will handle the error message display
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 12 }}
        styles={{ body: { padding: '40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>🦷 Denti</Title>
          <Title level={4} style={{ marginBottom: 4 }}>Daveti Kabul Et</Title>
          <Text type="secondary">Hesabınızı tamamlamak için bilgilerinizi girin.</Text>
        </div>

        <Form
          name="accept_invitation"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            label="Tam Adınız"
            name="name"
            rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı girin!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Örn: Ahmet Yılmaz" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[
              { required: true, message: 'Lütfen bir şifre belirleyin!' },
              { min: 8, message: 'Şifre en az 8 karakter olmalıdır!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifreniz" />
          </Form.Item>

          <Form.Item
            label="Şifre Tekrarı"
            name="password_confirmation"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Lütfen şifrenizi onaylayın!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Girdiğiniz şifreler eşleşmiyor!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifrenizi tekrar girin" />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              style={{ height: 45, borderRadius: 8, fontSize: 16 }}
            >
              Hesabı Tamamla
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/login')}>
              Zaten bir hesabınız var mı? Giriş yapın
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AcceptInvitationPage;
