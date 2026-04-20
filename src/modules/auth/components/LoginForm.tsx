// src/modules/auth/components/LoginForm.tsx

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Modal, Space } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, verify2fa, loading } = useAuth();
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorForm] = Form.useForm();

  const onFinish = async (values: any) => {
    const result = await login(values);
    if (result.requires2fa) {
      setShow2faModal(true);
    } else if (result.success) {
      navigate('/');
    }
  };

  const on2faFinish = async (values: { code: string }) => {
    const success = await verify2fa(values);
    if (success) {
      setShow2faModal(false);
      navigate('/');
    }
  };

  return (
    <>
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

      {/* 2FA Verification Modal */}
      <Modal
        title="İki Faktörlü Doğrulama"
        open={show2faModal}
        onOk={() => twoFactorForm.submit()}
        onCancel={() => setShow2faModal(false)}
        confirmLoading={loading}
        okText="Doğrula"
        cancelText="İptal"
        destroyOnClose
      >
        <div style={{ marginBottom: 20 }}>
          <Text>Hesabınızda 2FA aktif. Lütfen uygulamanızdaki 6 haneli kodu girin.</Text>
        </div>
        <Form
          form={twoFactorForm}
          onFinish={on2faFinish}
          layout="vertical"
        >
          <Form.Item
            name="code"
            rules={[
              { required: true, message: 'Lütfen 2FA kodunu girin!' },
              { len: 6, message: 'Kod 6 haneli olmalıdır!' },
              { pattern: /^\d+$/, message: 'Sadece rakam giriniz!' }
            ]}
          >
            <Input 
              prefix={<SafetyOutlined />} 
              placeholder="6 Haneli Kod" 
              maxLength={6} 
              autoFocus
              style={{ fontSize: '20px', textAlign: 'center', letterSpacing: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
