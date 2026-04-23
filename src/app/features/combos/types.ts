/* ── ComboProduct (join) ─────────────────────────────── */

export interface ComboProduct {
  id: number
  comboId: number
  productId: number
  productVariationId?: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    imageUrl?: string
  }
  productVariation?: {
    id: number
    name?: string
    mlSize: number
    isFullBottle: boolean
    price?: number
  }
}

/* ── Combo ───────────────────────────────────────────── */

export interface Combo {
  id: number
  name: string
  description?: string
  imageUrl?: string
  finalPrice: number
  discount?: number
  isActive: boolean
  comboProducts: ComboProduct[]
  createdAt: string
  updatedAt: string
}

/* ── Payloads ────────────────────────────────────────── */

export interface ComboProductPayload {
  productId: number
  productVariationId?: number
  quantity: number
}

export interface CreateComboPayload {
  name: string
  description?: string
  imageUrl?: string
  finalPrice: number
  discount?: number
  isActive?: boolean
  products: ComboProductPayload[]
}

export interface UpdateComboPayload extends Partial<CreateComboPayload> {}

/* ── Form data ───────────────────────────────────────── */

export interface ComboFormData {
  name: string
  description: string
  imageFile: File | null
  imageUrl: string
  finalPrice: string
  discount: string
  isActive: boolean
}

export interface ComboProductRow {
  productId: string
  productVariationId: string
  quantity: string
}
