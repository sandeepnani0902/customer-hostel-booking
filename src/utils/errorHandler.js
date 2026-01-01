import { toast } from 'react-toastify'
import { ERROR_MESSAGES, TOAST_CONFIG } from '../constants'

// Enhanced error handling utility
export class AppError extends Error {
  constructor(message, code = 'GENERIC_ERROR', details = null) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Error handler with logging and user notification
export const handleError = (error, context = 'Unknown') => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    code: error.code || 'UNKNOWN',
    details: error.details || null,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })

  // Show user-friendly error message
  const userMessage = getUserFriendlyMessage(error)
  toast.error(userMessage, TOAST_CONFIG)
}

// Get user-friendly error message
const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    return error.message
  }

  // Network errors
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  // Validation errors
  if (error.message.includes('validation') || error.message.includes('required')) {
    return ERROR_MESSAGES.VALIDATION_FAILED
  }

  // Location errors
  if (error.message.includes('location') || error.message.includes('geolocation')) {
    return ERROR_MESSAGES.LOCATION_DENIED
  }

  // Booking errors
  if (error.message.includes('booking') || error.message.includes('bed')) {
    return ERROR_MESSAGES.BOOKING_FAILED
  }

  // Default error message
  return ERROR_MESSAGES.GENERIC_ERROR
}

// Async error wrapper
export const withErrorHandling = (asyncFn, context = 'Operation') => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleError(error, context)
      throw error
    }
  }
}

// Validation helper
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new AppError(`${fieldName} is required`, 'VALIDATION_ERROR')
  }
}

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('Please enter a valid email address', 'VALIDATION_ERROR')
  }
}

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/
  if (!phoneRegex.test(phone)) {
    throw new AppError('Please enter a valid phone number', 'VALIDATION_ERROR')
  }
}

// Date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate < today) {
    throw new AppError(`${fieldName} cannot be in the past`, 'VALIDATION_ERROR')
  }
}

// Safe JSON parse
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.warn('Failed to parse JSON:', error)
    return defaultValue
  }
}

// Safe localStorage operations
export const safeLocalStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get localStorage item ${key}:`, error)
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set localStorage item ${key}:`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove localStorage item ${key}:`, error)
      return false
    }
  }
}

// Retry mechanism for failed operations
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }
  
  throw lastError
}