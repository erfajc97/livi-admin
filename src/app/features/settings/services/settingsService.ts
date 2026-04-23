import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { Setting } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const settingsService = {
  getAll: async (): Promise<Setting[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Setting[]>>(API_ENDPOINTS.SETTINGS)
    return data.data
  },

  update: async (key: string, value: string, description?: string): Promise<Setting> => {
    const { data } = await axiosInstance.put<CoreApiResponse<Setting>>(
      `${API_ENDPOINTS.SETTINGS}/${key}`,
      { value, description },
    )
    return data.data
  },
}
