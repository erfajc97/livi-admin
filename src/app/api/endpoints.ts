export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  RENEW_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',

  // Users / Clientes
  USERS: '/users',
  USER_INFO: '/users/me',

  // Productos
  PRODUCTS: '/products',
  PRODUCT: '/products',

  // Categorías
  CATEGORIES: '/categories',
  CATEGORY: '/categories',

  // Inventario
  INVENTORY: '/inventory',

  // Órdenes
  ORDERS: '/orders',
  ORDER: '/orders',

  // Finanzas / Pagos
  PAYMENTS: '/payments',
  PAYMENT: '/payments',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',

  // Banners
  BANNERS: '/banners',
  BANNER: '/banners',

  // Combos
  COMBOS: '/combos',

  // Finanzas
  FINANCE_TRANSACTIONS: '/finance/transactions',
  FINANCE_BILLS: '/finance/bills',
  FINANCE_STATS: '/finance/stats',

  // Métodos de entrega
  DELIVERY_METHODS: '/delivery-methods',
} as const
