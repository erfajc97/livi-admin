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
  cost?: number
  availableQuantity?: number
  sku?: string
  name?: string
  colorHex?: string
  /** Talla de la variante (combo color × talla); vacío = sin talla. */
  size?: string
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
  isActive: boolean
  discount?: number
  detailDescription?: string
  benefits?: string
  commonUses?: string
  pairsWith?: string
  sizes?: string
  instagramPosts?: string
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
  categoryId: number
  marcaId: number
  isActive?: boolean
  discount?: number
  detailDescription?: string
  benefits?: string
  commonUses?: string
  pairsWith?: string
  sizes?: string
  instagramPosts?: string
}

export interface InstagramPostInput {
  url: string
  image: string
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
  categoryId: string
  marcaId: string
  isActive: boolean
  discount: string
  detailDescription: string
  benefits: string
  commonUses: string
  /** IDs de productos "Combina con" (Pairs With) */
  pairsWith: number[]
  /** Tallas disponibles (una por línea o separadas por coma) */
  sizes: string
  /** Posts de Instagram de la ficha */
  instagramPosts: InstagramPostInput[]
}

export interface VariationRow {
  id?: number
  name: string
  price: string
  sku: string
  /** Color del swatch en hex (picker) */
  colorHex?: string
  /** Talla de la variante (combo color × talla); vacío = sin talla */
  size?: string
  imageFiles?: File[]
  existingImages?: ProductImage[]
}
