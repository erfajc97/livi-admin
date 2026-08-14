import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { InventoryDetail } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

export const inventoryService = {
  getDetail: async (productId: number): Promise<InventoryDetail> => {
    const { data } = await axiosInstance.get<CoreApiResponse<InventoryDetail>>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/inventory`,
    )
    return data.data
  },

  /**
   * Corrige los ml que quedan en la botella abierta (derrame, rotura, conteo
   * mal hecho). Queda registrado como evento en la línea de tiempo.
   */
  adjustOpenMl: async (
    productId: number,
    newOpenMl: number,
    note?: string,
  ): Promise<void> => {
    await axiosInstance.patch(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/adjust-ml`,
      { newOpenMl, note },
    )
  },
}
