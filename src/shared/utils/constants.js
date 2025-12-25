/**
 * Application Constants
 */

// Tax rate (14% VAT)
export const TAX_RATE = 0.14;

// Application configuration
export const APP_CONFIG = {
  app_title: 'Car House Admin',
  dashboard_title: 'Dashboard',
  products_title: 'Products',
  categories_title: 'Categories',
  orders_title: 'Orders',
  users_title: 'Users',
  bookings_title: 'Workshop Bookings',
  service_types_title: 'Service Types',
  footer_text: 'Car House · Admin Panel'
};

// Order status values
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Booking status values
export const BOOKING_STATUS = {
  SCHEDULED: 'scheduled',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin'
};

// Storage buckets
export const STORAGE_BUCKETS = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100
};

// Validation rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_RATING: 0,
  MAX_RATING: 5,
  MIN_PRICE: 0,
  MIN_STOCK: 0
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  DATABASE: 'YYYY-MM-DD HH:mm:ss'
};
