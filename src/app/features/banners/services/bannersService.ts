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

export const bannersService = {
  listBanners: async (): Promise<Banner[]> => {
    const { data } = await axiosInstance.get<Banner[] | CoreApiResponse<Banner[]>>(API_ENDPOINTS.BANNERS)
    return Array.isArray(data) ? data : data.data
  },

  getBannerById: async (id: string): Promise<Banner> => {
    const { data } = await axiosInstance.get<Banner | CoreApiResponse<Banner>>(`${API_ENDPOINTS.BANNERS}/${id}`)
    return 'data' in data && !('title' in data) ? (data as CoreApiResponse<Banner>).data : (data as Banner)
  },

  createBanner: async (payload: CreateBannerPayload): Promise<Banner> => {
    const { data } = await axiosInstance.post<Banner | CoreApiResponse<Banner>>(API_ENDPOINTS.BANNERS, payload)
    return 'data' in data && !('title' in data) ? (data as CoreApiResponse<Banner>).data : (data as Banner)
  },

  updateBanner: async (id: string, payload: UpdateBannerPayload): Promise<Banner> => {
    const { data } = await axiosInstance.patch<Banner | CoreApiResponse<Banner>>(`${API_ENDPOINTS.BANNERS}/${id}`, payload)
    return 'data' in data && !('title' in data) ? (data as CoreApiResponse<Banner>).data : (data as Banner)
  },

  deleteBanner: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.BANNERS}/${id}`)
  },
}
