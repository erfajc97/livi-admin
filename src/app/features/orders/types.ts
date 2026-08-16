export type OrderStatus =
  | 'order_created'
  | 'order_received'
  | 'order_accepted'
  | 'order_rejected'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_delayed'
  | 'order_cancelled'

export interface OrderItem {
  id: number
  productId?: number
  productVariationId?: number
  price: number
  quantity: number
  subtotal: number
  productName?: string
  productImage?: string
  mlSize?: number
  isFullBottle?: boolean
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  userName?: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  deliveryCost: number
  payphoneSurcharge: number
  couponDiscount: number
  total: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerCedula?: string
  deliveryMethod?: string
  paymentMethod?: string
  paymentStatus?: string
  paymentReference?: string
  shippingAddress?: string
  shippingCity?: string
  shippingProvince?: string
  trackingCode?: string
  transferReceiptUrl?: string
  notes?: string
  receivedAt?: string
  acceptedAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateOrderPayload {
  status?: OrderStatus
  paymentMethod?: string
  paymentStatus?: string
  paymentReference?: string
  trackingCode?: string
  statusNote?: string
  notes?: string
}
