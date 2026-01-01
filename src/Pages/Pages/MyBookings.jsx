import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import { authService } from '../../services/authService'
import { hostelsData } from '../../data/hostelsData'
import Navbar from '../../Components/Navbar'
import MobileBottomNav from '../../Components/MobileBottomNav'

const MyBookings = () => {
  const currentUser = authService.getCurrentUser()
  const [bookings, setBookings] = useState(() => {
    if (currentUser?.email) {
      return bookingService.getUserBookings(currentUser.email)
    }
    return []
  })

  const getHostelDetails = useCallback((hostelId) => {
    return hostelsData.find(h => h.id === hostelId) || {
      name: `Hostel ${hostelId}`,
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop&crop=center&q=80'
    }
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <Navbar />
      <div className="container" style={{paddingTop: '80px', paddingBottom: '80px'}}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="bi bi-calendar-check text-primary me-2"></i>My Bookings</h2>
          <Link to="/home" className="btn btn-outline-primary">
            <i className="bi bi-plus-circle me-2"></i>Book New
          </Link>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
            <h4 className="text-muted mb-3">No Bookings Found</h4>
            <p className="text-muted mb-4">You haven't made any bookings yet. Start exploring hostels!</p>
            <Link to="/home" className="btn btn-primary">
              <i className="bi bi-search me-2"></i>Browse Hostels
            </Link>
          </div>
        ) : (
          <div className="row">
            {bookings.map((booking) => {
              const hostel = getHostelDetails(booking.hostelId)
              return (
                <div key={booking.id} className="col-lg-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="row g-0 h-100">
                      <div className="col-4">
                        <img 
                          src={hostel.image} 
                          className="img-fluid rounded-start h-100" 
                          alt={hostel.name}
                          style={{objectFit: 'cover'}}
                        />
                      </div>
                      <div className="col-8">
                        <div className="card-body d-flex flex-column h-100">
                          <div className="flex-grow-1">
                            <h5 className="card-title mb-2">{hostel.name}</h5>
                            <p className="text-muted mb-2 small">
                              <i className="bi bi-geo-alt me-1"></i>{hostel.location}
                            </p>
                            
                            <div className="mb-2">
                              <span className="badge bg-primary me-2">
                                <i className="bi bi-bed me-1"></i>Bed #{booking.bedNumber}
                              </span>
                              <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                                {booking.status === 'confirmed' ? 'Active' : booking.status}
                              </span>
                            </div>
                            
                            <div className="small text-muted mb-2">
                              <div><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</div>
                              <div><strong>Room Type:</strong> {booking.roomType} occupancy</div>
                              <div><strong>Duration:</strong> {booking.duration} month(s)</div>
                            </div>
                            
                            <div className="mb-2">
                              <strong className="text-primary">₹{booking.totalAmount.toLocaleString()}</strong>
                              <small className="text-muted"> total paid</small>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="d-flex gap-2">
                              <Link 
                                to={`/hostel/${booking.hostelId}`} 
                                className="btn btn-sm btn-outline-primary flex-fill"
                              >
                                <i className="bi bi-eye me-1"></i>View
                              </Link>
                              <button className="btn btn-sm btn-outline-secondary flex-fill">
                                <i className="bi bi-telephone me-1"></i>Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {bookings.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded shadow-sm">
            <h5 className="mb-3"><i className="bi bi-info-circle text-info me-2"></i>Booking Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2"><strong>Total Bookings:</strong> {bookings.length}</p>
                <p className="mb-2"><strong>Active Bookings:</strong> {bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-2"><strong>Total Spent:</strong> ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</p>
                <p className="mb-2"><strong>Member Since:</strong> {formatDate(bookings[0]?.bookingDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default MyBookings