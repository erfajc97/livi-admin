/* ── Discount types ──────────────────────────────────── */

export type DiscountType = 'percentage' | 'fixed' | 'per_product'

/** Códigos que entiende el backend (y que los correos traducen a texto). */
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA'

/**
 * Entrega. Los SERVIENTREGA_* generan guía: la orden queda en "Pagado" y el
 * correo con el tracking sale cuando el admin carga el número. Las otras dos
 * se entregan en el acto y la orden nace entregada.
 */
export type DeliveryMethod =
  | 'ENTREGA_PERSONAL'
  | 'RETIRO_PIWU'
  | 'SERVIENTREGA_GYE'
  | 'SERVIENTREGA_NACIONAL'

/* ── Cart item for manual sale ──────────────────────── */

export interface ComboLineProduct {
  productId?: number
  productVariationId?: number
  quantity: number
}

export interface ManualSaleItem {
  productId: number
  productVariationId: number
  comboId?: number
  comboProducts?: ComboLineProduct[]
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

/** Cliente nuevo capturado a mano (canal redes: no existe en el sistema). */
export interface ManualSaleCustomerForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  cedula: string
  city: string
  province: string
  address: string
}

export type ClientMode = 'existing' | 'new'

/* ── Payload enviado al backend ──────────────────────── */

export interface ManualSalePayload {
  userId?: number
  customer?: {
    firstName: string
    lastName?: string
    email: string
    phone?: string
    cedula?: string
    city?: string
    province?: string
    address?: string
  }
  items: Array<{
    productId?: number
    productVariationId?: number
    quantity: number
  }>
  paymentMethod?: PaymentMethod
  deliveryMethod?: DeliveryMethod
  discountAmount?: number
  notes?: string
}

/* ── Form state ──────────────────────────────────────── */

export interface ManualSaleFormState {
  client: ManualSaleClient | null
  items: ManualSaleItem[]
  discountType: DiscountType
  discountValue: string
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
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
