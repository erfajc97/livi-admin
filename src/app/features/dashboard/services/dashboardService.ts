import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { DashboardStats } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await axiosInstance.get<CoreApiResponse<DashboardStats>>(
      API_ENDPOINTS.DASHBOARD_STATS,
    )
    return data.data
  },
}
