// Enhanced booking service with better error handling and validation
const BOOKINGS_STORAGE_KEY = 'hostel_bookings'
const BED_AVAILABILITY_KEY = 'bed_availability'

// Validate booking data
const validateBookingData = (bookingDetails) => {
  const errors = []
  
  if (!bookingDetails.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingDetails.userEmail)) {
    errors.push('Valid email is required')
  }
  
  if (!bookingDetails.userName || bookingDetails.userName.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  
  if (!bookingDetails.checkInDate) {
    errors.push('Check-in date is required')
  } else {
    const checkInDate = new Date(bookingDetails.checkInDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (checkInDate < today) {
      errors.push('Check-in date cannot be in the past')
    }
  }
  
  if (!bookingDetails.roomType || !['single', 'double', 'triple'].includes(bookingDetails.roomType)) {
    errors.push('Valid room type is required')
  }
  
  if (!bookingDetails.duration || !['1', '3', '6', '12'].includes(bookingDetails.duration)) {
    errors.push('Valid duration is required')
  }
  
  if (!bookingDetails.totalAmount || bookingDetails.totalAmount < 1000) {
    errors.push('Valid total amount is required')
  }
  
  return errors
}

// Initialize bed availability with error handling
const initializeBedAvailability = () => {
  try {
    const existing = localStorage.getItem(BED_AVAILABILITY_KEY)
    if (existing) {
      const parsed = JSON.parse(existing)
      // Validate structure
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Error parsing bed availability data, reinitializing:', error)
  }
  
  // Initialize fresh data
  const bedData = {}
  for (let i = 1; i <= 100; i++) {
    const rooms = []
    let totalBeds = 0
    
    for (let roomNum = 1; roomNum <= 30; roomNum++) {
      const bedsInRoom = Math.floor(Math.random() * 4) + 1
      const room = {
        roomNumber: roomNum,
        bedsCount: bedsInRoom,
        beds: []
      }
      
      for (let bedNum = 1; bedNum <= bedsInRoom; bedNum++) {
        totalBeds++
        room.beds.push({
          bedId: totalBeds,
          bedNumber: `R${roomNum}B${bedNum}`,
          isBooked: false
        })
      }
      rooms.push(room)
    }
    
    bedData[i] = {
      totalRooms: 30,
      totalBeds: totalBeds,
      availableBeds: totalBeds,
      rooms: rooms,
      bookedBeds: []
    }
  }
  
  try {
    localStorage.setItem(BED_AVAILABILITY_KEY, JSON.stringify(bedData))
  } catch (error) {
    console.error('Error saving bed availability data:', error)
  }
  
  return bedData
}

export const bookingService = {
  // Get bed availability with error handling
  getBedAvailability: (hostelId) => {
    try {
      const bedData = initializeBedAvailability()
      const hostelData = bedData[hostelId]
      
      if (!hostelData) {
        return { totalRooms: 0, totalBeds: 0, availableBeds: 0, rooms: [], bookedBeds: [] }
      }
      
      return hostelData
    } catch (error) {
      console.error('Error getting bed availability:', error)
      return { totalRooms: 0, totalBeds: 0, availableBeds: 0, rooms: [], bookedBeds: [] }
    }
  },

  // Get user bookings with validation
  getUserBookings: (userEmail) => {
    try {
      if (!userEmail || typeof userEmail !== 'string') {
        return []
      }
      
      const bookings = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      if (!bookings) return []
      
      const allBookings = JSON.parse(bookings)
      if (!Array.isArray(allBookings)) return []
      
      return allBookings.filter(booking => 
        booking && booking.userEmail === userEmail
      )
    } catch (error) {
      console.error('Error getting user bookings:', error)
      return []
    }
  },

  // Enhanced bed booking with validation
  bookBed: (hostelId, bedId, bookingDetails) => {
    try {
      // Validate input parameters
      if (!hostelId || !bedId || !bookingDetails) {
        throw new Error('Missing required booking parameters')
      }
      
      // Validate booking details
      const validationErrors = validateBookingData(bookingDetails)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      const bedData = initializeBedAvailability()
      const hostelBeds = bedData[hostelId]
      
      if (!hostelBeds) {
        throw new Error('Hostel not found')
      }
      
      // Find the bed
      let targetBed = null
      let targetRoom = null
      
      for (const room of hostelBeds.rooms) {
        if (!room || !Array.isArray(room.beds)) continue
        
        const bed = room.beds.find(b => b && b.bedId === bedId)
        if (bed) {
          targetBed = bed
          targetRoom = room
          break
        }
      }
      
      if (!targetBed) {
        throw new Error('Bed not found')
      }
      
      if (targetBed.isBooked) {
        throw new Error('Bed is already booked')
      }
      
      // Update bed status
      targetBed.isBooked = true
      hostelBeds.bookedBeds.push(bedId)
      hostelBeds.availableBeds = Math.max(0, hostelBeds.totalBeds - hostelBeds.bookedBeds.length)
      
      // Create booking record
      const booking = {
        id: Date.now() + Math.random(),
        hostelId: parseInt(hostelId),
        roomNumber: targetRoom.roomNumber,
        bedId: bedId,
        bedNumber: targetBed.bedNumber,
        userEmail: bookingDetails.userEmail.trim(),
        userName: bookingDetails.userName.trim(),
        checkInDate: bookingDetails.checkInDate,
        roomType: bookingDetails.roomType,
        duration: bookingDetails.duration,
        totalAmount: bookingDetails.totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      // Save booking
      const existingBookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]')
      existingBookings.push(booking)
      
      localStorage.setItem(BED_AVAILABILITY_KEY, JSON.stringify(bedData))
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existingBookings))
      
      return booking
    } catch (error) {
      console.error('Booking error:', error)
      throw error
    }
  },

  // Generate bed layout with error handling
  generateBedLayout: (hostelId) => {
    try {
      const bedData = initializeBedAvailability()
      const hostelBeds = bedData[hostelId]
      
      if (!hostelBeds || !Array.isArray(hostelBeds.rooms)) {
        return []
      }
      
      const bedLayout = []
      
      hostelBeds.rooms.forEach(room => {
        if (room && Array.isArray(room.beds)) {
          room.beds.forEach(bed => {
            if (bed) {
              bedLayout.push({
                bedId: bed.bedId,
                bedNumber: bed.bedNumber,
                roomNumber: room.roomNumber,
                isBooked: Boolean(bed.isBooked),
                isAvailable: !bed.isBooked
              })
            }
          })
        }
      })
      
      return bedLayout
    } catch (error) {
      console.error('Error generating bed layout:', error)
      return []
    }
  },

  // Get sharing-wise beds with realistic data
  getSharingWiseBeds: () => {
    try {
      return {
        '1-sharing': { available: 3, total: 5, price: 12000 },
        '2-sharing': { available: 8, total: 12, price: 9000 },
        '3-sharing': { available: 15, total: 18, price: 7500 },
        '4-sharing': { available: 12, total: 20, price: 6500 },
        '5-sharing': { available: 0, total: 10, price: 5500 }
      }
    } catch (error) {
      console.error('Error getting sharing beds:', error)
      return {}
    }
  },

  // Get booking statistics with error handling
  getBookingStats: (hostelId) => {
    try {
      const bedData = initializeBedAvailability()
      const hostelBeds = bedData[hostelId]
      
      if (!hostelBeds) {
        return { totalRooms: 0, totalBeds: 0, availableBeds: 0, bookedBeds: 0, occupancyRate: 0 }
      }
      
      const bookedCount = Array.isArray(hostelBeds.bookedBeds) ? hostelBeds.bookedBeds.length : 0
      const totalBeds = hostelBeds.totalBeds || 0
      
      return {
        totalRooms: hostelBeds.totalRooms || 0,
        totalBeds: totalBeds,
        availableBeds: Math.max(0, totalBeds - bookedCount),
        bookedBeds: bookedCount,
        occupancyRate: totalBeds > 0 ? Math.round((bookedCount / totalBeds) * 100) : 0
      }
    } catch (error) {
      console.error('Error getting booking stats:', error)
      return { totalRooms: 0, totalBeds: 0, availableBeds: 0, bookedBeds: 0, occupancyRate: 0 }
    }
  },

  // Cancel booking
  cancelBooking: (bookingId, userEmail) => {
    try {
      if (!bookingId || !userEmail) {
        throw new Error('Booking ID and email are required')
      }
      
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]')
      const bookingIndex = bookings.findIndex(b => 
        b && b.id === bookingId && b.userEmail === userEmail
      )
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found')
      }
      
      const booking = bookings[bookingIndex]
      
      // Free up the bed
      const bedData = initializeBedAvailability()
      const hostelBeds = bedData[booking.hostelId]
      
      if (hostelBeds) {
        // Find and free the bed
        for (const room of hostelBeds.rooms) {
          if (room && Array.isArray(room.beds)) {
            const bed = room.beds.find(b => b && b.bedId === booking.bedId)
            if (bed) {
              bed.isBooked = false
              break
            }
          }
        }
        
        // Update availability
        hostelBeds.bookedBeds = hostelBeds.bookedBeds.filter(id => id !== booking.bedId)
        hostelBeds.availableBeds = hostelBeds.totalBeds - hostelBeds.bookedBeds.length
        
        localStorage.setItem(BED_AVAILABILITY_KEY, JSON.stringify(bedData))
      }
      
      // Remove booking
      bookings.splice(bookingIndex, 1)
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
      
      return true
    } catch (error) {
      console.error('Error canceling booking:', error)
      throw error
    }
  }
}