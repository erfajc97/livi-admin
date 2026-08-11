/* ── Enums ────────────────────────────────────────────── */

export type Gender = 'HOMBRE' | 'MUJER' | 'UNISEX'

export type TimeOfDay = 'DIA' | 'NOCHE'

export type Concentration =
  | 'EAU_DE_PARFUM'
  | 'EAU_DE_TOILETTE'
  | 'EAU_DE_TOILETTE_INTENSE'
  | 'EAU_DE_COLOGNE'
  | 'BODY_MIST'
  | 'ELIXIR'
  | 'PARFUM'
  | 'EXTRAIT_DE_PARFUM'

export type Projection = 'DISCRETA' | 'MODERADA' | 'ALTA'

/**
 * Tipo de presentación de una variante:
 * - decant: decant fraccionado de la botella abierta (default)
 * - sellada: botella sellada
 * - original: presentación original (50ml, 100ml, etc.)
 */
export type PresentationType = 'decant' | 'sellada' | 'original'

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
  presentationType?: PresentationType
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

/* ── Perfil olfativo ─────────────────────────────────── */

export interface ScentNote {
  name: string
  color: string
}

export interface ScentSection {
  title: string
  notes: ScentNote[]
  description: string
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
  // ── PDP editorial ──
  scentProfileTitle?: string
  scentSections?: ScentSection[]
  mood?: string[]
  occasion?: string[]
  longevity?: number
  projectionScore?: number
  signatureTitle?: string
  signatureDescription?: string
  signatureImageUrl?: string
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
  // ── PDP editorial ──
  scentProfileTitle?: string
  scentSections?: ScentSection[]
  mood?: string[]
  occasion?: string[]
  longevity?: number
  projectionScore?: number
  signatureTitle?: string
  signatureDescription?: string
  signatureImageUrl?: string
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
  // ── PDP editorial ──
  scentProfileTitle: string
  scentSections: ScentSection[]
  mood: string[]
  occasion: string[]
  longevity: string
  projectionScore: string
  signatureTitle: string
  signatureDescription: string
  signatureImageUrl: string
  signatureImageFile: File | null
}

export interface VariationRow {
  id?: number
  name: string
  price: string
  mlSize: string
  sku: string
  presentationType: PresentationType
  imageFiles?: File[]
  existingImages?: ProductImage[]
}
