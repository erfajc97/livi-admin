export type BannerType = 'hero' | 'category' | 'brand' | 'navbar'

export interface Banner {
  id: string | number
  title: string
  subtitle: string | null
  imageUrl: string | null
  imageKey: string | null
  link: string | null
  buttonText: string | null
  type: BannerType
  isVisible: boolean
  position: number
  categoryId: number | null
  marcaId: number | null
  category: { id: number; name: string } | null
  marca: { id: number; name: string } | null
  createdAt: string
  updatedAt: string
}

export interface CreateBannerPayload {
  title: string
  subtitle?: string
  link?: string
  buttonText?: string
  type?: BannerType
  isVisible?: boolean
  position?: number
  categoryId?: number
  marcaId?: number
}

export interface UpdateBannerPayload {
  title?: string
  subtitle?: string
  link?: string
  buttonText?: string
  type?: BannerType
  isVisible?: boolean
  position?: number
  categoryId?: number
  marcaId?: number
}

export interface BannerFormData {
  title: string
  subtitle: string
  link: string
  buttonText: string
  type: BannerType
  isVisible: boolean
  categoryId: string
  marcaId: string
}
