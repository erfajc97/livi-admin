export interface InventoryProduct {
  id: number
  name: string
  imageUrl?: string
  stock: number
  totalMl: number
  openBottleMlRemaining: number
  availableMl: number
  price: number
  category?: { id: number; name: string }
  marca?: { id: number; name: string }
}

export interface BottleEvent {
  id: number
  eventType: 'BOTTLE_OPENED' | 'STOCK_ADJUSTED' | 'ML_ADJUSTED'
  sealedBottlesBefore: number
  sealedBottlesAfter: number
  openMlBefore: number
  openMlAfter: number
  note?: string
  createdBy?: string
  createdAt: string
}

export interface OrderHistoryItem {
  orderId: number
  orderNumber: string
  orderStatus: string
  variationName?: string
  mlSize: number
  isFullBottle: boolean
  quantity: number
  mlDeducted: number
  bottlesOpened: number
  price: number
  orderCreatedAt: string
}

export interface InventoryDetail {
  product: InventoryProduct
  inventory: {
    stock: number
    totalMl: number
    openBottleMlRemaining: number
    availableMl: number
  }
  bottleEvents: BottleEvent[]
  orderHistory: OrderHistoryItem[]
}
