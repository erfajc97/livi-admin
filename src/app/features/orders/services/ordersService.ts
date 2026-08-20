import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { Order, ResetOrdersResult, UpdateOrderPayload } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Order[]>>(
      API_ENDPOINTS.ORDERS,
    )
    return data.data
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Order>>(
      `${API_ENDPOINTS.ORDERS}/${id}`,
    )
    return data.data
  },

  update: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Order>>(
      `${API_ENDPOINTS.ORDERS}/${id}`,
      payload,
    )
    return data.data
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.ORDERS}/${id}`)
  },

  /**
   * Borra TODAS las órdenes. El backend exige confirm: 'RESET', así que ningún
   * clic accidental vacía la tabla.
   */
  resetAll: async (): Promise<ResetOrdersResult> => {
    const { data } = await axiosInstance.post<CoreApiResponse<ResetOrdersResult>>(
      API_ENDPOINTS.ORDERS_RESET,
      { confirm: 'RESET' },
    )
    return data.data
  },
}
