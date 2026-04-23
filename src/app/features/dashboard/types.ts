export interface DashboardStats {
  products: {
    total: number
  }
  stock: {
    available: number
    lowStock: number
  }
  users: {
    total: number
    clients: number
  }
  orders: {
    total: number
    totalRevenue: number
    totalPaidOrders: number
    todayRevenue: number
    todayOrders: number
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
  combos: {
    total: number
    active: number
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
