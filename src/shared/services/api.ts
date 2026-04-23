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

// CSRF singleton promise — eşzamanlı POST isteklerinde tek bir CSRF isteği atılır
let csrfPromise: Promise<void> | null = null

// CSRF check helper
const ensureCsrf = async (configBaseURL: string) => {
  if (document.cookie.includes('XSRF-TOKEN')) return

  // Race condition önleme: zaten devam eden bir CSRF isteği varsa onu bekle
  if (!csrfPromise) {
    let baseUrl = configBaseURL || api.defaults.baseURL || 'http://localhost:8000/api'
    if (baseUrl.startsWith('/')) {
      baseUrl = window.location.origin + baseUrl
    }

    // ✅ Güvenli URL parsing — split('/api')[0] yerine standart URL API kullanılıyor
    // Bu sayede /api/v1, /api/v2 gibi path prefix'ler de doğru çalışır
    const url = new URL(baseUrl)
    const domain = `${url.protocol}//${url.host}`

    csrfPromise = axios
      .get(`${domain}/sanctum/csrf-cookie`, { withCredentials: true })
      .then(() => {}) // Promise<AxiosResponse> → Promise<void> tip uyumu
      .finally(() => {
        // Başarılı veya başarısız olsun, bir sonraki login için sıfırla
        csrfPromise = null
      })
  }

  await csrfPromise
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
      // ✅ 404 artık kullanıcıya warning olarak gösteriliyor
      const msg = error.response.data?.message || 'İstenen kayıt bulunamadı.'
      antdHelper.message?.warning(msg)
      console.warn('404 Error:', error.config?.url)
    } else if (error.response?.status === 419) {
      // 419 is often used for CSRF mismatch in Laravel
      antdHelper.message?.error('CSRF hatası, lütfen sayfayı yenileyin.')
    } else if (error.response?.status === 422) {
      // ✅ Validation hataları tek bir özet mesajla gösteriliyor
      // Önceden: her hata ayrı ayrı gösteriliyordu → DB sütun adı gibi iç detaylar sızabilirdi
      const errors = error.response.data?.errors
      const backendMessage = error.response.data?.message

      if (errors && Object.keys(errors).length > 0) {
        antdHelper.message?.error('Girilen veriler geçerli değil. Lütfen formu kontrol edin.')
      } else if (backendMessage) {
        antdHelper.message?.error(backendMessage)
      } else {
        antdHelper.message?.error('Doğrulama hatası oluştu.')
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