import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { Banner, CreateBannerPayload, UpdateBannerPayload } from '../types'

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

function buildFormData(payload: Record<string, unknown>, file?: File): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      fd.append(key, String(value))
    }
  }
  if (file) {
    fd.append('image', file)
  }
  return fd
}

export const bannersService = {
  listBanners: async (): Promise<Banner[]> => {
    const { data } = await axiosInstance.get<Banner[] | CoreApiResponse<Banner[]>>(API_ENDPOINTS.BANNERS)
    return Array.isArray(data) ? data : unwrap(data) as Banner[]
  },

  getBannerById: async (id: string): Promise<Banner> => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.BANNERS}/${id}`)
    return unwrap<Banner>(data)
  },

  createBanner: async (payload: CreateBannerPayload, file?: File): Promise<Banner> => {
    const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
    const { data } = await axiosInstance.post(API_ENDPOINTS.BANNERS, fd)
    return unwrap<Banner>(data)
  },

  updateBanner: async (id: string, payload: UpdateBannerPayload, file?: File): Promise<Banner> => {
    if (!file) {
      const { data } = await axiosInstance.patch(`${API_ENDPOINTS.BANNERS}/${id}`, payload)
      return unwrap<Banner>(data)
    }
    const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.BANNERS}/${id}`, fd)
    return unwrap<Banner>(data)
  },

  deleteBanner: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.BANNERS}/${id}`)
  },

  reorderBanners: async (orderedIds: number[]): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.BANNERS_REORDER, { orderedIds })
  },
}
