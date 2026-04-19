// src/shared/services/api.ts

import axios from 'axios'
import { antdHelper } from '../utils/antdHelper'
import { useAuthStore } from '../stores/authStore'

// API instance oluştur
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request Interceptor - Token ekleme
api.interceptors.request.use(
  (config) => {
    // Store'dan doğrudan token'ı al (En güvenli yol)
    const token = useAuthStore.getState().token

    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Error handling
    if (error.response?.status === 401) {
      antdHelper.message?.error('Oturum süreniz doldu!')
    } else if (error.response?.status === 403) {
      antdHelper.message?.error('Bu işlemi yapmaya yetkiniz yok!')
    } else if (error.response?.status === 404) {
      // Background checks (like /user or /stats) might fail with 404 on some setups
      console.warn('404 Error:', error.config.url)
    } else if (error.response?.status === 422) {
      // Validation errors
      const errors = error.response.data?.errors
      if (errors) {
        (Object.values(errors).flat() as string[]).forEach((err) => {
          antdHelper.message?.error(err)
        })
      } else {
        antdHelper.message?.error(error.response.data?.message || 'Validation hatası!')
      }
    } else if (error.response?.status >= 500) {
      antdHelper.message?.error('Sunucu hatası! Backend çalışıyor mu kontrol edin.')
    } else {
      const msg = error.response?.data?.message || error.message || 'Bir hata oluştu!'
      antdHelper.message?.error(msg)
    }
    
    return Promise.reject(error)
  }
)

// Default export da ekleyelim
export default api