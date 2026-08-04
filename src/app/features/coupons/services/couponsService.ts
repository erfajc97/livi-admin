import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { Coupon, CreateCouponPayload, UpdateCouponPayload } from '../types'

function unwrap<T>(data: unknown): T {
  if (
    data &&
    typeof data === 'object' &&
    'statusCode' in data &&
    'data' in data
  ) {
    return (data as { data: T }).data
  }
  return data as T
}

export const couponsService = {
  listCoupons: async (): Promise<Coupon[]> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.COUPONS)
    const result = unwrap<Coupon[]>(data)
    return Array.isArray(result) ? result : []
  },

  getCouponById: async (id: string): Promise<Coupon> => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.COUPONS}/${id}`)
    return unwrap<Coupon>(data)
  },

  createCoupon: async (payload: CreateCouponPayload): Promise<Coupon> => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.COUPONS, payload)
    return unwrap<Coupon>(data)
  },

  updateCoupon: async (
    id: string,
    payload: UpdateCouponPayload,
  ): Promise<Coupon> => {
    const { data } = await axiosInstance.patch(
      `${API_ENDPOINTS.COUPONS}/${id}`,
      payload,
    )
    return unwrap<Coupon>(data)
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.COUPONS}/${id}`)
  },
}
