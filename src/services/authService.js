// Simple authentication service
const AUTH_STORAGE_KEY = 'hostel_auth_token'

// Mock user credentials (in production, this would be handled by backend)
const VALID_CREDENTIALS = [
  { email: 'admin@hostel.com', password: 'admin123', role: 'admin' },
  { email: 'user@hostel.com', password: 'user123', role: 'user' },
  { email: 'srikanthsirangi7@gmail.com', password: 'password123', role: 'user' }
]

export const authService = {
  // Authenticate user credentials
  authenticate: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = VALID_CREDENTIALS.find(
          cred => cred.email === email && cred.password === password
        )
        
        if (user) {
          const token = btoa(JSON.stringify({ email: user.email, role: user.role, timestamp: Date.now() }))
          localStorage.setItem(AUTH_STORAGE_KEY, token)
          resolve({ success: true, user: { email: user.email, role: user.role }, token })
        } else {
          reject({ success: false, message: 'Invalid email or password' })
        }
      }, 1000) // Simulate network delay
    })
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) return false
    
    try {
      const decoded = JSON.parse(atob(token))
      // Check if token is not older than 24 hours
      const isValid = (Date.now() - decoded.timestamp) < 24 * 60 * 60 * 1000
      return isValid
    } catch {
      return false
    }
  },

  // Get current user info
  getCurrentUser: () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) return null
    
    try {
      return JSON.parse(atob(token))
    } catch {
      return null
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}