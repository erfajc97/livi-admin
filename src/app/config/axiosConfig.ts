import axios from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import { useAuthStore } from '@/app/store/auth/authStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de solicitud: agrega el token si existe y verifica expiración
axiosInstance.interceptors.request.use((config) => {
  const { token, tokenExpiration } = useAuthStore.getState()

  if (token && tokenExpiration) {
    if (Date.now() > tokenExpiration) {
      useAuthStore.getState().removeToken()
      return Promise.reject(new Error('Token expirado'))
    }
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }

  return config
})

// Interceptor de respuesta: renueva el token en 401 si hay refreshToken
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: { config: { _retry?: boolean; headers?: Record<string, string> }; response?: { status: number } }) => {
    const originalRequest = error.config
    const { refreshToken } = useAuthStore.getState()
    const hasRetried = originalRequest._retry

    if (error.response?.status === 502) {
      useAuthStore.getState().removeToken()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && refreshToken && !hasRetried) {
      originalRequest._retry = true
      try {
        const { data } = await axiosInstance.post<{
          content?: { access_token: string; refresh_token: string }
          data?: { access_token: string; refresh_token: string }
        }>(API_ENDPOINTS.RENEW_TOKEN, { refresh_token: refreshToken })

        const newToken = data?.content?.access_token ?? data?.data?.access_token ?? ''
        const newRefreshToken = data?.content?.refresh_token ?? data?.data?.refresh_token ?? ''
        const decoded = JSON.parse(atob(newToken.split('.')[1])) as { exp: number }
        const expiration = decoded.exp * 1000

        useAuthStore.getState().setToken(newToken, newRefreshToken, expiration)

        if (!originalRequest.headers) originalRequest.headers = {}
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        return axiosInstance(originalRequest)
      } catch {
        useAuthStore.getState().removeToken()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().removeToken()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
