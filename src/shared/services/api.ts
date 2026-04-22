// src/shared/services/api.ts

import axios from 'axios'
import { antdHelper } from '../utils/antdHelper'

// API instance oluştur
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // Cookies handle the session (Sanctum)
  withXSRFToken: true,   // Modern axios needs this for CSRF headers
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000,
})

// CSRF check helper
const ensureCsrf = async (configBaseURL: string) => {
  if (!document.cookie.includes('XSRF-TOKEN')) {
    // Determine the base URL for the sanctum endpoint
    let baseUrl = configBaseURL || api.defaults.baseURL || 'http://localhost:8000/api'
    
    // Ensure we have an absolute URL for the domain extraction
    if (baseUrl.startsWith('/')) {
      baseUrl = window.location.origin + baseUrl
    }
    
    const domain = baseUrl.split('/api')[0]
    await axios.get(`${domain}/sanctum/csrf-cookie`, { withCredentials: true })
  }
}

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase()
    // CSRF protection for state-changing requests (except GET)
    if (method && method !== 'get') {
      await ensureCsrf(config.baseURL || api.defaults.baseURL || '')
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
    } else if (error.response?.status === 419) {
      // 419 is often used for CSRF mismatch in Laravel
      antdHelper.message?.error('CSRF hatası, lütfen sayfayı yenileyin.')
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