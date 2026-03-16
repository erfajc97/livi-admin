export interface DashboardStats {
  products: {
    total: number
    decants: number
  }
  stock: {
    available: number
    capacity: number
    lowStock: number
  }
  users: {
    total: number
    clients: number
  }
  orders: {
    total: number
    revenue: number
    byStatus: {
      pending: number
      paid: number
      accepted: number
      shipped: number
      delivered: number
      cancelled: number
      delayed: number
      rejected: number
    }
    recent: RecentOrder[]
  }
  categories: {
    total: number
  }
  banners: {
    total: number
    visible: number
  }
}

export interface RecentOrder {
  id: number
  orderNumber: string
  clientName: string
  paymentMethod: string
  paymentStatus: string
  status: string
  total: number
  createdAt: string
}
