// Application constants for better maintainability and consistency

export const APP_CONFIG = {
  NAME: 'HostelHub',
  VERSION: '1.0.0',
  DESCRIPTION: 'Premium Hostel Booking Platform',
  CONTACT_EMAIL: 'support@hostelhub.com',
  CONTACT_PHONE: '+91 9876543210'
}

export const SECURITY_DEPOSIT = 1500

export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double', 
  TRIPLE: 'triple'
}

export const BOOKING_DURATION = {
  ONE_MONTH: '1',
  THREE_MONTHS: '3',
  SIX_MONTHS: '6',
  TWELVE_MONTHS: '12'
}

export const PRICE_MULTIPLIERS = {
  [ROOM_TYPES.SINGLE]: 1.0,
  [ROOM_TYPES.DOUBLE]: 0.7,
  [ROOM_TYPES.TRIPLE]: 0.5
}

export const DURATION_DISCOUNTS = {
  [BOOKING_DURATION.ONE_MONTH]: 0,
  [BOOKING_DURATION.THREE_MONTHS]: 0.05,
  [BOOKING_DURATION.SIX_MONTHS]: 0.10,
  [BOOKING_DURATION.TWELVE_MONTHS]: 0.15
}

export const HOSTEL_TYPES = {
  BOYS: 'boys',
  GIRLS: 'girls',
  CO_LIVING: 'co-living'
}

export const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '5000-7000', label: '₹5000 - ₹7000' },
  { value: '7000-8000', label: '₹7000 - ₹8000' },
  { value: '8000-9000', label: '₹8000 - ₹9000' },
  { value: '9000-12000', label: '₹9000 - ₹12000' },
  { value: '12000-20000', label: '₹12000 - ₹20000' }
]

export const LOCATION_SUGGESTIONS = [
  'Near Me', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
  'Koramangala', 'Whitefield', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'SR Nagar', 'Ameerpet', 
  'Madhapur', 'Gachibowli', 'Uppal', 'Kukatpally', 'Secunderabad', 'Banjara Hills', 'Jubilee Hills',
  'Kondapur', 'Miyapur', 'Dilsukhnagar', 'Begumpet', 'Somajiguda', 'LB Nagar'
]

export const WORK_LOCATION_SUGGESTIONS = [
  'Madhapur IT Hub', 'Gachibowli Financial District', 'Hi-Tech City', 'Kondapur IT Park',
  'Ameerpet Training Hub', 'Secunderabad Railway', 'Begumpet Airport', 'Banjara Hills Commercial',
  'Jubilee Hills Business', 'SR Nagar Metro', 'Uppal Industrial', 'Kukatpally KPHB'
]

export const AMENITIES = {
  WIFI: { icon: 'bi-wifi', label: 'Free WiFi', color: 'text-success' },
  WATER: { icon: 'bi-droplet', label: '24/7 Water', color: 'text-primary' },
  POWER_BACKUP: { icon: 'bi-lightning', label: 'Power Backup', color: 'text-warning' },
  SECURITY: { icon: 'bi-shield-check', label: 'Security', color: 'text-success' },
  LAUNDRY: { icon: 'bi-basket', label: 'Laundry', color: 'text-info' },
  FOOD: { icon: 'bi-cup-hot', label: 'Food Service', color: 'text-danger' },
  AC: { icon: 'bi-snow', label: 'AC Rooms', color: 'text-info' },
  TV: { icon: 'bi-tv', label: 'TV', color: 'text-dark' },
  BATHROOM: { icon: 'bi-door-open', label: 'Attached Bath', color: 'text-secondary' },
  STORAGE: { icon: 'bi-archive', label: 'Storage', color: 'text-brown' },
  STUDY_TABLE: { icon: 'bi-lamp', label: 'Study Table', color: 'text-warning' },
  BED: { icon: 'bi-bed', label: 'Comfortable Bed', color: 'text-success' }
}

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-()]{10,15}$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
  MAX_ADVANCE_BOOKING_DAYS: 365
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hostel_auth_token',
  FAVORITES: 'hostel-favorites',
  BOOKINGS: 'hostel_bookings',
  BED_AVAILABILITY: 'bed_availability',
  USER_PREFERENCES: 'user_preferences'
}

export const API_ENDPOINTS = {
  // Future API endpoints when backend is implemented
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  HOSTELS: '/api/hostels',
  BOOKINGS: '/api/bookings',
  PROFILE: '/api/profile'
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  LOCATION_DENIED: 'Location access denied. Please enable location services.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
}

export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites!'
}

export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true
}