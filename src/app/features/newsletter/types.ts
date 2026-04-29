export interface Subscriber {
  id: number
  email: string
  firstName?: string
  isActive: boolean
  unsubscribeToken: string
  subscribedAt: string
}

export interface SubscriberStats {
  total: number
  active: number
  inactive: number
}

export interface Campaign {
  id: number
  subject: string
  heading: string
  body: string
  ctaText?: string
  ctaUrl?: string
  imageUrl?: string
  status: 'draft' | 'sent' | 'failed'
  recipientCount: number
  sentAt?: string
  createdAt: string
}

export interface CreateCampaignPayload {
  subject: string
  heading: string
  body: string
  ctaText?: string
  ctaUrl?: string
  imageUrl?: string
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>
