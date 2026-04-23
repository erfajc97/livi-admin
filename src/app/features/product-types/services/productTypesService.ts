import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { ProductType, CreateProductTypePayload, UpdateProductTypePayload } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

function unwrap<T>(data: T | CoreApiResponse<T>): T {
  if (data && typeof data === 'object' && 'statusCode' in data && 'data' in data) {
    return (data as CoreApiResponse<T>).data
  }
  return data as T
}

export const productTypesService = {
  list: async (): Promise<ProductType[]> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCT_TYPES)
    const unwrapped = unwrap(data)
    if (Array.isArray(unwrapped)) return unwrapped
    if (unwrapped && typeof unwrapped === 'object' && 'data' in unwrapped) {
      return (unwrapped as { data: ProductType[] }).data
    }
    return []
  },

  create: async (payload: CreateProductTypePayload): Promise<ProductType> => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.PRODUCT_TYPES, payload)
    return unwrap<ProductType>(data)
  },

  update: async (id: number, payload: UpdateProductTypePayload): Promise<ProductType> => {
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.PRODUCT_TYPES}/${id}`, payload)
    return unwrap<ProductType>(data)
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PRODUCT_TYPES}/${id}`)
  },
}
