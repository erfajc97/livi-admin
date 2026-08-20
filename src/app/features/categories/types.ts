export interface Category {
  id: number
  name: string
  description: string | null
  slug: string | null
  imageUrl: string | null
  imageKey: string | null
  /** Portada vertical para teléfono. Si es null el front usa `imageUrl`. */
  mobileImageUrl: string | null
  mobileImageKey: string | null
  isActive: boolean
  bajoPedido: boolean
  createdAt: string
  updatedAt: string
  marcas?: Marca[]
}

export interface Marca {
  id: number
  name: string
  description: string | null
  slug: string | null
  imageUrl: string | null
  imageKey: string | null
  /** Portada vertical para teléfono. Si es null el front usa `imageUrl`. */
  mobileImageUrl: string | null
  mobileImageKey: string | null
  isActive: boolean
  bajoPedido: boolean
  categoryId: number
}

export interface CategoryFormData {
  name: string
  description: string
  isActive: boolean
  bajoPedido: boolean
}

export interface CreateCategoryPayload {
  name: string
  description?: string
  isActive?: boolean
  bajoPedido?: boolean
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string
  isActive?: boolean
  bajoPedido?: boolean
}

export interface MarcaFormData {
  name: string
  description: string
  isActive: boolean
  bajoPedido: boolean
  imageFile: File | null
  imagePreview: string | null
  mobileImageFile: File | null
  mobileImagePreview: string | null
}

export interface CreateMarcaPayload {
  name: string
  categoryId: number
  description?: string
  isActive?: boolean
  bajoPedido?: boolean
}

export interface UpdateMarcaPayload {
  name?: string
  description?: string
  isActive?: boolean
  bajoPedido?: boolean
}
