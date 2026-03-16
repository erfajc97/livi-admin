export interface Banner {
  id: string | number
  title: string
  subtitle: string | null
  imageUrl: string | null
  link: string | null
  isVisible: boolean
  position: number
  createdAt: string
  updatedAt: string
}

export interface CreateBannerPayload {
  title: string
  subtitle?: string
  imageUrl?: string
  link?: string
  isVisible?: boolean
  position?: number
}

export interface UpdateBannerPayload {
  title?: string
  subtitle?: string
  imageUrl?: string
  link?: string
  isVisible?: boolean
  position?: number
}

export interface BannerFormData {
  title: string
  subtitle: string
  imageUrl: string
  link: string
  isVisible: boolean
}
