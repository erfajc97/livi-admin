/* ── Enums ────────────────────────────────────────────── */

export type Gender = 'HOMBRE' | 'MUJER' | 'UNISEX'

export type TimeOfDay = 'DIA' | 'NOCHE'

export type Concentration =
  | 'EAU_DE_PARFUM'
  | 'EAU_DE_TOILETTE'
  | 'ELIXIR_DE_PARFUM'
  | 'EAU_DE_COLOGNE'
  | 'BODY_MIST'
  | 'PARFUM_EXTRAIT'

export type Projection = 'DISCRETA' | 'MODERADA' | 'ALTA'

/* ── Category / Marca ──────────────────────────── */

export interface Category {
  id: number
  name: string
  description?: string
  slug?: string
  isActive: boolean
  marcas: Marca[]
}

export interface Marca {
  id: number
  name: string
  description?: string
  slug?: string
  categoryId: number
  isActive: boolean
}

/* ── Product Image / Video ───────────────────────────── */

export interface ProductImage {
  id: number | string
  productId: number
  url: string
  key: string
  alt?: string
  displayOrder: number
  isActive: boolean
}

export interface ProductVideo {
  id: number
  productId: number
  url: string
  key?: string
  title?: string
  displayOrder: number
  isActive: boolean
}

/* ── Variation ───────────────────────────────────────── */

export interface OptionValue {
  id: number
  value: string
  displayName?: string
  option: { id: number; name: string }
}

export interface ProductVariation {
  id: number
  productId: number
  price?: number
  mlSize: number
  isFullBottle: boolean
  availableQuantity?: number
  sku?: string
  name?: string
  optionValues: OptionValue[]
  isActive: boolean
  images?: ProductImage[]
  videos?: ProductVideo[]
  createdAt: string
  updatedAt: string
}

/* ── Product ─────────────────────────────────────────── */

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  imageUrl?: string
  stock: number
  totalMl: number
  openBottleMlRemaining: number
  availableMl: number
  isActive: boolean
  bajoPedido: boolean
  gender?: Gender
  timeOfDay?: TimeOfDay
  concentration?: Concentration
  projection?: Projection
  discount?: number
  detailDescription?: string
  benefits?: string
  categoryId: number
  marcaId: number
  category?: Category
  marca?: Marca
  variations?: ProductVariation[]
  images?: ProductImage[]
  videos?: ProductVideo[]
  createdAt: string
  updatedAt: string
}

/* ── Payloads ────────────────────────────────────────── */

export interface CreateProductPayload {
  name: string
  price: number
  description?: string
  imageUrl?: string
  stock?: number
  totalMl: number
  categoryId: number
  marcaId: number
  isActive?: boolean
  bajoPedido?: boolean
  gender?: Gender
  timeOfDay?: TimeOfDay
  concentration?: Concentration
  projection?: Projection
  discount?: number
  detailDescription?: string
  benefits?: string
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

/* ── Filters ─────────────────────────────────────────── */

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  marcaId?: number
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt'
  sortOrder?: 'ASC' | 'DESC'
}

/* ── Paginated response ──────────────────────────────── */

export interface PaginatedProducts {
  data: Product[]
  total: number
  page: number
  limit: number
}

/* ── Form data (for the create/edit form) ────────────── */

export interface ProductFormData {
  name: string
  price: string
  description: string
  stock: string
  totalMl: string
  categoryId: string
  marcaId: string
  isActive: boolean
  bajoPedido: boolean
  gender: string
  timeOfDay: string
  concentration: string
  projection: string
  discount: string
  detailDescription: string
  benefits: string
}

export interface VariationRow {
  id?: number
  name: string
  price: string
  mlSize: string
  sku: string
  imageFiles?: File[]
  existingImages?: ProductImage[]
}
