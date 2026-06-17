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

// Extended payload type to include image file
interface CreateComboPayloadWithFile extends Omit<CreateComboPayload, 'imageUrl'> {
  imageUrl?: string
  imageFile?: File | null
}

interface UpdateComboPayloadWithFile extends Omit<UpdateComboPayload, 'imageUrl'> {
  imageUrl?: string
  imageFile?: File | null
}

function buildFormData(payload: CreateComboPayloadWithFile | UpdateComboPayloadWithFile): FormData {
  const formData = new FormData()
  formData.append('name', payload.name ?? '')
  if (payload.description) formData.append('description', payload.description)
  if (payload.finalPrice !== undefined) formData.append('finalPrice', String(payload.finalPrice))
  if (payload.discount !== undefined) formData.append('discount', String(payload.discount))
  if (payload.isActive !== undefined) formData.append('isActive', String(payload.isActive))
  if (payload.parentComboId !== undefined) formData.append('parentComboId', String(payload.parentComboId))
  if (payload.imageFile) formData.append('image', payload.imageFile)
  if (payload.products) {
    formData.append('products', JSON.stringify(payload.products))
  }
  return formData
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

  createCombo: async (payload: CreateComboPayloadWithFile): Promise<Combo> => {
    if (payload.imageFile) {
      const formData = buildFormData(payload)
      const { data } = await axiosInstance.post<CoreApiResponse<Combo>>(API_ENDPOINTS.COMBOS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    }
    const { imageFile, ...rest } = payload
    const { data } = await axiosInstance.post<CoreApiResponse<Combo>>(API_ENDPOINTS.COMBOS, rest)
    return data.data
  },

  updateCombo: async (id: number, payload: UpdateComboPayloadWithFile): Promise<Combo> => {
    if (payload.imageFile) {
      const formData = buildFormData(payload)
      const { data } = await axiosInstance.patch<CoreApiResponse<Combo>>(
        `${API_ENDPOINTS.COMBOS}/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data.data
    }
    const { imageFile, ...rest } = payload
    const { data } = await axiosInstance.patch<CoreApiResponse<Combo>>(
      `${API_ENDPOINTS.COMBOS}/${id}`,
      rest
    )
    return data.data
  },

  deleteCombo: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.COMBOS}/${id}`)
  },
}
