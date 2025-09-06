// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8080/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses'
  },
  PRODUCTS: {
    LIST: '/products',
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search'
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: '/orders',
    UPDATE_STATUS: '/orders/status'
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items',
    REMOVE_ITEM: '/cart/items',
    CLEAR: '/cart/clear'
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
