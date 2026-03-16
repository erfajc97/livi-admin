import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { Combo, CreateComboPayload, UpdateComboPayload } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const combosService = {
  listCombos: async (): Promise<Combo[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Combo[]>>(API_ENDPOINTS.COMBOS)
    return data.data
  },

  getComboById: async (id: number): Promise<Combo> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Combo>>(`${API_ENDPOINTS.COMBOS}/${id}`)
    return data.data
  },

  createCombo: async (payload: CreateComboPayload): Promise<Combo> => {
    const { data } = await axiosInstance.post<CoreApiResponse<Combo>>(API_ENDPOINTS.COMBOS, payload)
    return data.data
  },

  updateCombo: async (id: number, payload: UpdateComboPayload): Promise<Combo> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Combo>>(
      `${API_ENDPOINTS.COMBOS}/${id}`,
      payload
    )
    return data.data
  },

  deleteCombo: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.COMBOS}/${id}`)
  },
}
