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
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  userName?: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  paymentMethod?: string
  paymentStatus?: string
  paymentReference?: string
  shippingAddress?: string
  shippingCity?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateOrderPayload {
  status?: OrderStatus
  paymentMethod?: string
  paymentStatus?: string
  paymentReference?: string
  notes?: string
}
