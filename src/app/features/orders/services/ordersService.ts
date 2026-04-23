import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { Order, UpdateOrderPayload } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Order[]>>(API_ENDPOINTS.ORDERS)
    return data.data
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Order>>(`${API_ENDPOINTS.ORDERS}/${id}`)
    return data.data
  },

  update: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Order>>(
      `${API_ENDPOINTS.ORDERS}/${id}`,
      payload
    )
    return data.data
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.ORDERS}/${id}`)
  },
}
