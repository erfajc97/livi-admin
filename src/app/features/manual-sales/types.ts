/* ── Discount types ──────────────────────────────────── */

export type DiscountType = 'percentage' | 'fixed' | 'per_product'

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta'

/* ── Cart item for manual sale ──────────────────────── */

export interface ManualSaleItem {
  productId: number
  productVariationId: number
  comboId?: number
  productName: string
  variationLabel: string
  imageUrl?: string
  price: number
  originalPrice?: number
  quantity: number
}

/* ── Selected client ─────────────────────────────────── */

export interface ManualSaleClient {
  id: number
  firstName: string
  lastName: string
  email: string
}

/* ── Form state ──────────────────────────────────────── */

export interface ManualSaleFormState {
  client: ManualSaleClient | null
  items: ManualSaleItem[]
  discountType: DiscountType
  discountValue: string
  paymentMethod: PaymentMethod
  notes: string
}

/* ── Order response (from backend) ───────────────────── */

export interface OrderResponse {
  id: number
  orderNumber: string
  userId: number
  status: string
  total: number
  paymentMethod?: string
  paymentStatus?: string
  notes?: string
  createdAt: string
  items: Array<{
    id: number
    productId?: number
    price: number
    quantity: number
    subtotal: number
  }>
}
