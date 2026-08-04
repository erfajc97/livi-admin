import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type {
  Campaign,
  CreateCampaignPayload,
  Subscriber,
  SubscriberStats,
  UpdateCampaignPayload,
} from '../types'

export const newsletterService = {
  // ─── Subscribers ──────────────────────────────────────

  async getSubscribers(): Promise<Subscriber[]> {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.NEWSLETTER_SUBSCRIBERS,
    )
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : []
  },

  async getSubscriberStats(): Promise<SubscriberStats> {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.NEWSLETTER_SUBSCRIBERS_STATS,
    )
    return data?.data ?? data
  },

  async deleteSubscriber(id: number): Promise<void> {
    await axiosInstance.delete(`${API_ENDPOINTS.NEWSLETTER_SUBSCRIBERS}/${id}`)
  },

  // ─── Campaigns ────────────────────────────────────────

  async getCampaigns(): Promise<Campaign[]> {
    const { data } = await axiosInstance.get(API_ENDPOINTS.NEWSLETTER_CAMPAIGNS)
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : []
  },

  async getCampaignById(id: number): Promise<Campaign> {
    const { data } = await axiosInstance.get(
      `${API_ENDPOINTS.NEWSLETTER_CAMPAIGNS}/${id}`,
    )
    return data?.data ?? data
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.NEWSLETTER_CAMPAIGNS,
      payload,
    )
    return data?.data ?? data
  },

  async updateCampaign(
    id: number,
    payload: UpdateCampaignPayload,
  ): Promise<Campaign> {
    const { data } = await axiosInstance.patch(
      `${API_ENDPOINTS.NEWSLETTER_CAMPAIGNS}/${id}`,
      payload,
    )
    return data?.data ?? data
  },

  async deleteCampaign(id: number): Promise<void> {
    await axiosInstance.delete(`${API_ENDPOINTS.NEWSLETTER_CAMPAIGNS}/${id}`)
  },

  async sendCampaign(id: number): Promise<Campaign> {
    const { data } = await axiosInstance.post(
      `${API_ENDPOINTS.NEWSLETTER_CAMPAIGNS}/${id}/send`,
    )
    return data?.data ?? data
  },

  getPreviewUrl(id: number): string {
    const baseURL = axiosInstance.defaults.baseURL ?? ''
    return `${baseURL}${API_ENDPOINTS.NEWSLETTER_CAMPAIGNS}/${id}/preview`
  },
}
