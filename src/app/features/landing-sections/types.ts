export interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string
  isActive: boolean
}

/** Dónde se pinta la sección: home o recomendados del carrito. */
export type SectionPlacement = 'home' | 'cart'

export interface LandingSection {
  id: number
  title: string
  order: number
  placement: SectionPlacement
  isActive: boolean
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface CreateLandingSectionDto {
  title: string
  order: number
  placement?: SectionPlacement
  isActive?: boolean
  productIds?: number[]
}

export interface UpdateLandingSectionDto {
  title?: string
  order?: number
  placement?: SectionPlacement
  isActive?: boolean
  productIds?: number[]
}
