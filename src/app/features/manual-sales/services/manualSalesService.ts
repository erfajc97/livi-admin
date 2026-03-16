import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { OrderResponse, ManualSaleClient } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const manualSalesService = {
  searchUsers: async (): Promise<ManualSaleClient[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<ManualSaleClient[]>>(API_ENDPOINTS.USERS)
    return data.data
  },

  createManualOrder: async (payload: {
    userId: number
    items: Array<{ productId: number; quantity: number }>
    paymentMethod?: string
    discountAmount?: number
    notes?: string
  }): Promise<OrderResponse> => {
    const { data } = await axiosInstance.post<CoreApiResponse<OrderResponse>>(
      `${API_ENDPOINTS.ORDERS}/manual`,
      payload
    )
    return data.data
  },
}
