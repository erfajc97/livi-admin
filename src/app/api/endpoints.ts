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
  PRODUCTS_BULK_IMPORT: '/products/bulk-import',

  // Categorías
  CATEGORIES: '/categories',
  CATEGORY: '/categories',
  MARCAS: '/categories/marcas',

  // Tipos de Producto
  PRODUCT_TYPES: '/product-types',

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
  BANNERS_REORDER: '/banners/reorder',

  // Landing Sections
  LANDING_SECTIONS: '/landing-sections',
  LANDING_SECTIONS_ACTIVE: '/landing-sections/active',
  LANDING_SECTION: '/landing-sections',
  LANDING_SECTION_ADD_PRODUCT: '/landing-sections',
  LANDING_SECTION_REMOVE_PRODUCT: '/landing-sections',

  // Combos
  COMBOS: '/combos',

  // Blog
  BLOG: '/blog',
  BLOG_REORDER: '/blog/reorder',

  // Cupones
  COUPONS: '/coupons',
  COUPONS_VALIDATE: '/coupons/validate',

  // Finanzas
  FINANCE_TRANSACTIONS: '/finance/transactions',
  FINANCE_BILLS: '/finance/bills',
  FINANCE_STATS: '/finance/stats',
  FINANCE_PAYMENT_METHODS: '/finance/payment-methods',

  // Métodos de entrega
  DELIVERY_METHODS: '/delivery-methods',

  // Settings
  SETTINGS: '/settings',

  // Newsletter
  NEWSLETTER_SUBSCRIBERS: '/newsletter/subscribers',
  NEWSLETTER_SUBSCRIBERS_STATS: '/newsletter/subscribers/stats',
  NEWSLETTER_CAMPAIGNS: '/newsletter/campaigns',
} as const
