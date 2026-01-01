// Backend-ready API service
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants'
import { handleError, AppError } from '../utils/errorHandler'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('hostel_auth_token')
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new AppError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 'API_ERROR',
          { status: response.status, url }
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      
      // Network or other errors
      throw new AppError(
        ERROR_MESSAGES.NETWORK_ERROR,
        'NETWORK_ERROR',
        { originalError: error.message, url }
      )
    }
  }

  // Authentication endpoints
  async login(credentials) {
    const response = await this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      this.token = response.token
      localStorage.setItem('hostel_auth_token', response.token)
    }
    
    return response
  }

  async register(userData) {
    return await this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    this.token = null
    localStorage.removeItem('hostel_auth_token')
  }

  // Hostel endpoints
  async getHostels(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `${API_ENDPOINTS.HOSTELS}?${queryString}` : API_ENDPOINTS.HOSTELS
    return await this.request(endpoint)
  }

  async getHostelById(id) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/${id}`)
  }

  async searchHostels(searchParams) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/search`, {
      method: 'POST',
      body: JSON.stringify(searchParams),
    })
  }

  // Booking endpoints
  async createBooking(bookingData) {
    return await this.request(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
  }

  async getUserBookings() {
    return await this.request(API_ENDPOINTS.BOOKINGS)
  }

  async getBookingById(id) {
    return await this.request(`${API_ENDPOINTS.BOOKINGS}/${id}`)
  }

  async cancelBooking(id) {
    return await this.request(`${API_ENDPOINTS.BOOKINGS}/${id}/cancel`, {
      method: 'PUT',
    })
  }

  // Profile endpoints
  async getProfile() {
    return await this.request(API_ENDPOINTS.PROFILE)
  }

  async updateProfile(profileData) {
    return await this.request(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Bed availability endpoints
  async getBedAvailability(hostelId) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/${hostelId}/beds`)
  }

  async bookBed(hostelId, bedId, bookingDetails) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/${hostelId}/beds/${bedId}/book`, {
      method: 'POST',
      body: JSON.stringify(bookingDetails),
    })
  }

  // Location-based search
  async getNearbyHostels(lat, lng, radius = 10) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/nearby`, {
      method: 'POST',
      body: JSON.stringify({ lat, lng, radius }),
    })
  }

  // Favorites endpoints
  async getFavorites() {
    return await this.request('/favorites')
  }

  async addToFavorites(hostelId) {
    return await this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ hostelId }),
    })
  }

  async removeFromFavorites(hostelId) {
    return await this.request(`/favorites/${hostelId}`, {
      method: 'DELETE',
    })
  }

  // Reviews endpoints
  async getHostelReviews(hostelId) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/${hostelId}/reviews`)
  }

  async addReview(hostelId, reviewData) {
    return await this.request(`${API_ENDPOINTS.HOSTELS}/${hostelId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  }

  // Payment endpoints
  async createPaymentIntent(amount, currency = 'INR') {
    return await this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    })
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    return await this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, paymentMethodId }),
    })
  }

  // File upload
  async uploadFile(file, type = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return await this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    })
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Wrapper functions with error handling
export const withApiErrorHandling = (apiCall) => {
  return async (...args) => {
    try {
      return await apiCall(...args)
    } catch (error) {
      handleError(error, 'API Call')
      throw error
    }
  }
}

// Ready-to-use API methods with error handling
export const api = {
  // Auth
  login: withApiErrorHandling(apiService.login.bind(apiService)),
  register: withApiErrorHandling(apiService.register.bind(apiService)),
  logout: withApiErrorHandling(apiService.logout.bind(apiService)),

  // Hostels
  getHostels: withApiErrorHandling(apiService.getHostels.bind(apiService)),
  getHostelById: withApiErrorHandling(apiService.getHostelById.bind(apiService)),
  searchHostels: withApiErrorHandling(apiService.searchHostels.bind(apiService)),
  getNearbyHostels: withApiErrorHandling(apiService.getNearbyHostels.bind(apiService)),

  // Bookings
  createBooking: withApiErrorHandling(apiService.createBooking.bind(apiService)),
  getUserBookings: withApiErrorHandling(apiService.getUserBookings.bind(apiService)),
  getBookingById: withApiErrorHandling(apiService.getBookingById.bind(apiService)),
  cancelBooking: withApiErrorHandling(apiService.cancelBooking.bind(apiService)),

  // Profile
  getProfile: withApiErrorHandling(apiService.getProfile.bind(apiService)),
  updateProfile: withApiErrorHandling(apiService.updateProfile.bind(apiService)),

  // Beds
  getBedAvailability: withApiErrorHandling(apiService.getBedAvailability.bind(apiService)),
  bookBed: withApiErrorHandling(apiService.bookBed.bind(apiService)),

  // Favorites
  getFavorites: withApiErrorHandling(apiService.getFavorites.bind(apiService)),
  addToFavorites: withApiErrorHandling(apiService.addToFavorites.bind(apiService)),
  removeFromFavorites: withApiErrorHandling(apiService.removeFromFavorites.bind(apiService)),

  // Reviews
  getHostelReviews: withApiErrorHandling(apiService.getHostelReviews.bind(apiService)),
  addReview: withApiErrorHandling(apiService.addReview.bind(apiService)),

  // Payments
  createPaymentIntent: withApiErrorHandling(apiService.createPaymentIntent.bind(apiService)),
  confirmPayment: withApiErrorHandling(apiService.confirmPayment.bind(apiService)),

  // Upload
  uploadFile: withApiErrorHandling(apiService.uploadFile.bind(apiService)),
}

export default api