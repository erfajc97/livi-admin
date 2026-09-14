export interface InventoryProduct {
  id: number
  name: string
  imageUrl?: string
  stock: number
  price: number
  category?: { id: number; name: string }
  marca?: { id: number; name: string }
}

export interface OrderHistoryItem {
  orderId: number
  orderNumber: string
  orderStatus: string
  variationName?: string
  quantity: number
  price: number
  orderCreatedAt: string
}

export interface InventoryVariation {
  id: number
  name?: string
  price: number
  isActive: boolean
}

export interface InventoryDetail {
  product: InventoryProduct
  inventory: {
    stock: number
  }
  variations: InventoryVariation[]
  orderHistory: OrderHistoryItem[]
}
