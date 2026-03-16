/* ── ComboProduct (join) ─────────────────────────────── */

export interface ComboProduct {
  id: number
  comboId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    brand: string
    price: number
    imageUrl?: string
  }
}

/* ── Combo ───────────────────────────────────────────── */

export interface Combo {
  id: number
  name: string
  description?: string
  imageUrl?: string
  finalPrice: number
  sizeLabel?: string
  isActive: boolean
  comboProducts: ComboProduct[]
  createdAt: string
  updatedAt: string
}

/* ── Payloads ────────────────────────────────────────── */

export interface ComboProductPayload {
  productId: number
  quantity: number
}

export interface CreateComboPayload {
  name: string
  description?: string
  imageUrl?: string
  finalPrice: number
  sizeLabel?: string
  isActive?: boolean
  products: ComboProductPayload[]
}

export interface UpdateComboPayload extends Partial<CreateComboPayload> {}

/* ── Form data ───────────────────────────────────────── */

export interface ComboFormData {
  name: string
  description: string
  imageUrl: string
  finalPrice: string
  sizeLabel: string
  isActive: boolean
}

export interface ComboProductRow {
  productId: string
  quantity: string
}
