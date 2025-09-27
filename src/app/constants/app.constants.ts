// API Endpoints - Basado en el backend Spring Boot
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8080/api',
  
  // Autenticación (AuthController)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  // Productos públicos (PublicController)
  PUBLIC: {
    PRODUCTS: '/public/product',
    PRODUCT_SECTIONS: '/public/product-sections',
    CATEGORIES: '/public/category/get-all' // Endpoint público para obtener categorías
  },

  // Usuarios (UserDetailController)
  USERS: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    ADDRESSES: '/user/address',
    CREATE_ADDRESS: '/user/address',
    UPDATE_ADDRESS: '/user/address',
    DELETE_ADDRESS: '/user/address'
  },

  // Pedidos (OrderController)
  ORDERS: {
    CREATE: '/order',
    BOLETA: '/order', // /{orderId}/boleta
    FACTURA: '/order' // /{orderId}/factura
  },

  // Panel de administración (AdminController)
  ADMIN: {
    // Marcas
    BRANDS: '/admin/brand',
    BRANDS_ALL: '/admin/brand/get-all',
    
    // Categorías
    CATEGORIES: '/admin/category',
    CATEGORIES_ALL: '/admin/category/get-all',
    CATEGORY_BUTTONS: '/admin/category-button',
    
    // Productos
    PRODUCTS: '/admin/product',
    PRODUCTS_ALL: '/admin/product/get-all',
    PRODUCT_SECTIONS: '/admin/product-section',
    
    // Usuarios
    USERS: '/admin/user',
    USERS_ALL: '/admin/user/get-all',
    
    // Pedidos
    ORDERS: '/admin/orders',
    ORDERS_ALL: '/admin/orders/get-all',
    ORDERS_STATISTICS: '/admin/orders/statistics',
    
    // Descuentos
    DISCOUNTS: '/admin/discount',
    DISCOUNTS_ALL: '/admin/discount/get-all',
    
    // Roles
    AUTHORITIES: '/admin/authority',
    AUTHORITIES_ALL: '/admin/authority/get-all',
    
    // Imágenes slider
    SLIDER_IMAGES: '/admin/slider-image',
    SLIDER_IMAGES_ALL: '/admin/slider-image/get-all'
  },

  // Pagos (PaymentController) 
  PAYMENTS: {
    PROCESS: '/payment/process'
  }
} as const;

// Application Constants
export const APP_CONSTANTS = {
  TOKEN_KEY: 'tambo_token',
  REFRESH_TOKEN_KEY: 'tambo_refresh_token',
  USER_KEY: 'tambo_user',
  ITEMS_PER_PAGE: 10,
  MAX_CART_ITEMS: 50,
  DELIVERY_FEE: 5.0,
  FREE_DELIVERY_THRESHOLD: 30.0
} as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  PENDING: 'text-yellow-600 bg-yellow-100',
  CONFIRMED: 'text-blue-600 bg-blue-100',
  PREPARING: 'text-purple-600 bg-purple-100',
  OUT_FOR_DELIVERY: 'text-orange-600 bg-orange-100',
  DELIVERED: 'text-green-600 bg-green-100',
  CANCELLED: 'text-red-600 bg-red-100'
} as const;
