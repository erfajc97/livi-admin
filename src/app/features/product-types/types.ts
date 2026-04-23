export interface ProductType {
  id: number
  name: string
  slug: string | null
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductTypeFormData {
  name: string
  description: string
  isActive: boolean
}

export interface CreateProductTypePayload {
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateProductTypePayload {
  name?: string
  description?: string
  isActive?: boolean
}
