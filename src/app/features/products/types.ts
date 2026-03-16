/* ── Enums ────────────────────────────────────────────── */

export type ProductType = 'PERFUME'

export type MeasureUnit = 'ML' | 'OZ' | 'G' | 'KG'

/* ── Category / Subcategory ──────────────────────────── */

export interface Category {
  id: number
  name: string
  description?: string
  slug?: string
  isActive: boolean
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: number
  name: string
  description?: string
  slug?: string
  categoryId: number
  isActive: boolean
}

/* ── Product Image / Video ───────────────────────────── */

export interface ProductImage {
  id: number
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
  stock: number
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
  brand: string
  price: number
  type: ProductType
  description?: string
  imageUrl?: string
  stock: number
  isActive: boolean
  measureValue?: number
  measureUnit?: MeasureUnit
  categoryId: number
  subcategoryId: number
  parentProductId?: number
  decants?: Product[]
  variations?: ProductVariation[]
  images?: ProductImage[]
  videos?: ProductVideo[]
  createdAt: string
  updatedAt: string
}

/* ── Payloads ────────────────────────────────────────── */

export interface CreateProductPayload {
  name: string
  brand: string
  price: number
  type: ProductType
  description?: string
  imageUrl?: string
  stock?: number
  measureValue?: number
  measureUnit?: MeasureUnit
  categoryId: number
  subcategoryId: number
  parentProductId?: number
  isActive?: boolean
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

/* ── Filters ─────────────────────────────────────────── */

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  subcategoryId?: number
  brand?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  sortBy?: 'name' | 'price' | 'brand' | 'createdAt' | 'updatedAt'
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
  brand: string
  price: string
  type: ProductType
  description: string
  stock: string
  measureValue: string
  measureUnit: MeasureUnit
  categoryId: string
  subcategoryId: string
  parentProductId: string
  isActive: boolean
  imageUrl: string
}

export interface VariationRow {
  id?: number
  name: string
  price: string
  stock: string
  sku: string
}
