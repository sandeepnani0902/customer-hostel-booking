import React, { useState, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { hostelsData } from '../../data/hostelsData'
import { generateNearbyPlaces, getPlaceColor } from '../../utils/nearbyPlaces'
import { bookingService } from '../../services/bookingService'
import { authService } from '../../services/authService'
import Navbar from '../../Components/Navbar'
import MobileBottomNav from '../../Components/MobileBottomNav'
import BedLayout from '../../Components/BedLayout'
import BookingForm from '../../Components/BookingForm'
import './HostelDetails.css'

const HostelDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const SECURITY_DEPOSIT = 1500
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPayment, setShowPayment] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedBed, setSelectedBed] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    roomType: 'single',
    duration: '1'
  })
  const galleryImages = useMemo(() => [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center&q=80"
  ], [])

  const hostel = useMemo(() => {
    if (!id) return null
    
    try {
      const foundHostel = hostelsData?.find(h => h.id === parseInt(id))
      if (foundHostel) {
        return foundHostel
      }
      
      return {
        id: parseInt(id) || 1,
        name: `Premium Hostel ${id || 1}`,
        location: "Ameerpet, Hyderabad",
        price: 8500,
        rating: 4.3,
        reviewCount: 142,
        image: galleryImages?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&crop=center&q=80",
        lat: 17.4374,
        lng: 78.4482
      }
    } catch (error) {
      console.error('Error loading hostel data:', error)
      return {
        id: 1,
        name: "Premium Hostel",
        location: "Ameerpet, Hyderabad",
        price: 8500,
        rating: 4.3,
        reviewCount: 142,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&crop=center&q=80",
        lat: 17.4374,
        lng: 78.4482
      }
    }
  }, [id, galleryImages])

  if (!id || !hostel) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-warning">
          <h4>Invalid Hostel ID</h4>
          <p>Please select a valid hostel from the home page.</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Get bed availability and layout
  const bedStats = useMemo(() => {
    try {
      return bookingService.getBookingStats(parseInt(id) || 1)
    } catch (error) {
      console.error('Error loading bed stats:', error)
      return { totalRooms: 0, totalBeds: 0, availableBeds: 0, bookedBeds: 0, occupancyRate: 0 }
    }
  }, [id])
  
  const bedLayout = useMemo(() => {
    try {
      return bookingService.generateBedLayout(parseInt(id) || 1)
    } catch (error) {
      console.error('Error loading bed layout:', error)
      return []
    }
  }, [id])
  
  const sharingWiseBeds = useMemo(() => {
    try {
      return bookingService.getSharingWiseBeds()
    } catch (error) {
      console.error('Error loading sharing beds:', error)
      return {}
    }
  }, [])
  
  const currentUser = useMemo(() => {
    try {
      return authService.getCurrentUser()
    } catch (error) {
      console.error('Error loading current user:', error)
      return null
    }
  }, [])

  // Generate dynamic nearby places
  const nearbyPlaces = useMemo(() => {
    try {
      return generateNearbyPlaces(hostel?.location || 'Hyderabad')
    } catch (error) {
      console.error('Error generating nearby places:', error)
      return []
    }
  }, [hostel?.location])

  // Helper function to calculate room price based on type
  const getRoomPrice = useCallback((roomType, basePrice) => {
    return roomType === 'single' ? basePrice : 
           roomType === 'double' ? Math.round(basePrice * 0.7) :
           Math.round(basePrice * 0.5)
  }, [])

  const handleBedSelect = useCallback((bed) => {
    setSelectedBed(bed)
  }, [])

  const validateBooking = useCallback(() => {
    try {
      const errors = []
      if (!selectedBed) errors.push('Please select a bed first')
      if (!bookingDetails.checkInDate) errors.push('Please select check-in date')
      
      if (bookingDetails.checkInDate) {
        const checkInDate = new Date(bookingDetails.checkInDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (checkInDate < today) {
          errors.push('Check-in date cannot be in the past')
        }
      }
      
      if (errors.length > 0) {
        toast.error(errors.join('. '))
        return false
      }
      return true
    } catch (error) {
      console.error('Error validating booking:', error)
      toast.error('Validation error occurred')
      return false
    }
  }, [selectedBed, bookingDetails.checkInDate])

  const handleBookingSubmit = useCallback(() => {
    if (!validateBooking()) return
    setShowConfirmDialog(true)
  }, [validateBooking])

  const confirmBooking = useCallback(() => {
    setShowConfirmDialog(false)
    setShowPayment(true)
  }, [])

  const minSwipeDistance = 50

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && selectedImage < galleryImages.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }, [touchStart, touchEnd, selectedImage, galleryImages.length])

  const calculateTotal = useCallback(() => {
    try {
      const basePrice = getRoomPrice(bookingDetails.roomType, hostel?.price || 8500)
      const months = parseInt(bookingDetails.duration) || 1
      const securityDeposit = SECURITY_DEPOSIT
      return (basePrice * months) + securityDeposit
    } catch (error) {
      console.error('Error calculating total:', error)
      return SECURITY_DEPOSIT
    }
  }, [bookingDetails.roomType, bookingDetails.duration, hostel?.price, getRoomPrice])

  const handlePayment = useCallback(async () => {
    if (!currentUser || !selectedBed) {
      toast.error('Missing required information for booking')
      return
    }
    
    setIsBooking(true)
    try {
      const totalAmount = calculateTotal()
      bookingService.bookBed(parseInt(id) || 1, selectedBed.bedId, {
        userEmail: currentUser.email || 'user@example.com',
        userName: currentUser.name || [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || currentUser.email || 'User',
        checkInDate: bookingDetails.checkInDate,
        roomType: bookingDetails.roomType,
        duration: bookingDetails.duration,
        totalAmount: totalAmount
      })
      
      toast.success(
        <div className="d-flex align-items-center">
          <div className="me-3" style={{fontSize: '2rem'}}>🎉</div>
          <div>
            <div className="fw-bold">Booking Confirmed!</div>
            <div className="small">Bed {selectedBed.bedNumber} in Room {selectedBed.roomNumber} is reserved</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'success-toast'
        }
      )
      
      setShowPayment(false)
      setSelectedBed(null)
      
      setTimeout(() => {
        navigate('/my-bookings')
      }, 3000)
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Booking failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }, [id, selectedBed, currentUser, bookingDetails, calculateTotal, navigate])

  const renderStars = useCallback((rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>)
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>)
    }
    
    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>)
    }
    
    return stars
  }, [])

  return (
    <div className="hostel-details-container">
      <Navbar />
      
      <div className="container" style={{marginTop: '60px', paddingBottom: '100px'}}>
        {/* Back to Home Button */}
        <button 
          className="btn btn-outline-primary mb-4 d-flex align-items-center fade-in"
          onClick={() => navigate('/home')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </button>
        
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4 fade-in">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/home" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item active">{hostel.name}</li>
          </ol>
        </nav>

        <div className="row">
          {/* Left Column - Images & Details */}
          <div className="col-lg-8">
            {/* Main Image Gallery */}
            <div className="hostel-hero-section fade-in">
              <div className="hostel-gallery">
                <div className="position-relative">
                  <img 
                    src={galleryImages[selectedImage]} 
                    className="w-100 h-100" 
                    alt={hostel.name} 
                    style={{objectFit: 'cover'}} 
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`availability-badge ${bedStats.availableBeds > 0 ? '' : 'bg-danger'}`}>
                      {bedStats.availableBeds > 0 ? `${bedStats.availableBeds} Beds Available` : 'Fully Booked'}
                    </span>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="gallery-thumbnails">
                  <div className="row g-2">
                    {galleryImages.map((img, index) => (
                      <div key={index} className="col-2">
                        <img 
                          src={img} 
                          className={`w-100 thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                          style={{height: '60px', objectFit: 'cover'}}
                          onClick={() => setSelectedImage(index)}
                          alt={`Gallery ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing-wise Bed Availability */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="bi bi-people text-primary me-2"></i>
                  Room Sharing Options
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {Object.entries(sharingWiseBeds).map(([sharing, data]) => (
                    <div key={sharing} className="col-md-6 col-lg-4">
                      <div className={`border rounded-3 p-3 h-100 ${data.available > 0 ? 'border-success bg-light' : 'border-secondary bg-light'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 text-capitalize">{sharing.replace('-', ' ')}</h6>
                          <span className={`badge ${data.available > 0 ? 'bg-success' : 'bg-secondary'}`}>
                            {data.available > 0 ? 'Available' : 'Full'}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">Available: </small>
                          <strong className={data.available > 0 ? 'text-success' : 'text-danger'}>
                            {data.available}/{data.total} beds
                          </strong>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">Price: </small>
                          <strong className="text-primary">₹{data.price.toLocaleString()}/month</strong>
                        </div>
                        <div className="progress" style={{height: '6px'}}>
                          <div 
                            className={`progress-bar ${data.available > 0 ? 'bg-success' : 'bg-danger'}`}
                            style={{width: `${data.total > 0 ? (data.available / data.total) * 100 : 0}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bed Selection */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="bi bi-bed text-primary me-2"></i>
                  Available Beds ({bedStats.availableBeds}/{bedStats.totalBeds})
                </h5>
              </div>
              <div className="card-body">
                <BedLayout 
                  bedLayout={bedLayout}
                  selectedBed={selectedBed}
                  onBedSelect={handleBedSelect}
                  style={{minHeight: '48px'}} // Larger touch targets
                />
              </div>
            </div>

            {/* Hostel Details */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="mb-2">{hostel.name} <i className="bi bi-patch-check-fill text-success"></i></h2>
                    <p className="text-muted mb-2 fs-5">
                      <i className="bi bi-geo-alt text-primary"></i> {hostel.location}
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-2">{renderStars(hostel.rating)}</div>
                      <span className="fw-bold me-2 fs-5">{hostel.rating}</span>
                      <span className="text-muted">({hostel.reviewCount || hostel.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <h3 className="text-primary mb-0">₹{hostel.price.toLocaleString()}</h3>
                    <small className="text-muted">per month</small>
                  </div>
                </div>

                <p className="mb-4 text-muted">Experience comfortable living with modern amenities, 24/7 security, and excellent connectivity to major IT hubs and educational institutions.</p>

                {/* Amenities */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="mb-3"><i className="bi bi-star text-warning me-2"></i>Amenities</h5>
                    <div className="row">
                      <div className="col-6 mb-2"><i className="bi bi-wifi text-success me-2"></i>Free WiFi</div>
                      <div className="col-6 mb-2"><i className="bi bi-droplet text-primary me-2"></i>24/7 Water</div>
                      <div className="col-6 mb-2"><i className="bi bi-lightning text-warning me-2"></i>Power Backup</div>
                      <div className="col-6 mb-2"><i className="bi bi-shield-check text-success me-2"></i>Security</div>
                      <div className="col-6 mb-2"><i className="bi bi-basket text-info me-2"></i>Laundry</div>
                      <div className="col-6 mb-2"><i className="bi bi-cup-hot text-danger me-2"></i>Food Service</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3"><i className="bi bi-house text-primary me-2"></i>Room Features</h5>
                    <div className="row">
                      <div className="col-6 mb-2"><i className="bi bi-snow text-info me-2"></i>AC Rooms</div>
                      <div className="col-6 mb-2"><i className="bi bi-tv text-dark me-2"></i>TV</div>
                      <div className="col-6 mb-2"><i className="bi bi-door-open text-secondary me-2"></i>Attached Bath</div>
                      <div className="col-6 mb-2"><i className="bi bi-archive text-brown me-2"></i>Storage</div>
                      <div className="col-6 mb-2"><i className="bi bi-lamp text-warning me-2"></i>Study Table</div>
                      <div className="col-6 mb-2"><i className="bi bi-bed text-success me-2"></i>Comfortable Bed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0"><i className="bi bi-geo-alt text-primary me-2"></i>Location & Nearby Places</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="bg-light rounded p-3 mb-3" style={{height: '250px'}}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-center">
                          <i className="bi bi-map display-1 text-muted"></i>
                          <p className="text-muted mt-2">Interactive Map</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.location)}`, '_blank')}
                          >
                            <i className="bi bi-geo-alt-fill me-2"></i>Open in Google Maps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-3">Nearby Places</h6>
                    <div className="small">
                      {nearbyPlaces.map((place, index) => (
                        <div key={index} className="mb-2 d-flex justify-content-between align-items-center">
                          <span>
                            <i className={`bi ${place.icon} ${getPlaceColor(place.icon)} me-2`}></i>
                            {place.name} - {place.distance} km
                          </span>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' near ' + hostel.location)}`, '_blank')}
                              title="Find location"
                            >
                              <i className="bi bi-geo-alt-fill"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => window.open(`https://www.google.com/maps/dir/${encodeURIComponent(hostel.location)}/${encodeURIComponent(place.name + ' near ' + hostel.location)}`, '_blank')}
                              title="Get directions"
                            >
                              <i className="bi bi-arrow-right-circle-fill"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Payment */}
          <div className="col-lg-4">
            {/* Mobile Booking Card */}
            <div className="d-lg-none mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Book Now</h5>
                </div>
                <div className="card-body">
                  <BookingForm 
                    bookingDetails={bookingDetails}
                    setBookingDetails={setBookingDetails}
                    hostel={hostel}
                    selectedBed={selectedBed}
                    getRoomPrice={getRoomPrice}
                    calculateTotal={calculateTotal}
                    securityDeposit={SECURITY_DEPOSIT}
                    isMobile={true}
                  />
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Monthly Rent:</span>
                    <span>₹{getRoomPrice(bookingDetails.roomType, hostel.price).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Duration:</span>
                    <span>{bookingDetails.duration} month(s)</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Security Deposit:</span>
                    <span>₹{SECURITY_DEPOSIT.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 fw-bold border-top pt-2">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleBookingSubmit}
                    disabled={!selectedBed || bedStats.availableBeds === 0 || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        {!selectedBed ? 'Select a Bed First' : 'Proceed to Payment'}
                      </>
                    )}
                  </button>
                  <button className="btn btn-outline-primary w-100">
                    <i className="bi bi-telephone me-2"></i>Call Now: +91 9876543210
                  </button>
                </div>
              </div>
            </div>
            
            <div className="sticky-top d-none d-lg-block" style={{top: '80px'}}>
              {/* Desktop Booking Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Book Now</h5>
                </div>
                <div className="card-body">
                  <BookingForm 
                    bookingDetails={bookingDetails}
                    setBookingDetails={setBookingDetails}
                    hostel={hostel}
                    selectedBed={selectedBed}
                    getRoomPrice={getRoomPrice}
                    calculateTotal={calculateTotal}
                    securityDeposit={SECURITY_DEPOSIT}
                    isMobile={false}
                  />
                  
                  <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleBookingSubmit}
                    disabled={!selectedBed || bedStats.availableBeds === 0 || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        {!selectedBed ? 'Select a Bed First' : 'Proceed to Payment'}
                      </>
                    )}
                  </button>
                  <button className="btn btn-outline-primary w-100">
                    <i className="bi bi-telephone me-2"></i>Call Now: +91 9876543210
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0"><i className="bi bi-person-circle me-2"></i>Contact Information</h6>
                </div>
                <div className="card-body">
                  <p className="mb-2"><i className="bi bi-person text-primary me-2"></i><strong>Manager:</strong> Rajesh Kumar</p>
                  <p className="mb-2"><i className="bi bi-telephone text-success me-2"></i><strong>Phone:</strong> +91 9876543210</p>
                  <p className="mb-2"><i className="bi bi-envelope text-info me-2"></i><strong>Email:</strong> info@hostel.com</p>
                  <p className="mb-0"><i className="bi bi-clock text-warning me-2"></i><strong>Timing:</strong> 9 AM - 8 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-question-circle me-2"></i>Confirm Booking</h5>
                  <button className="btn-close" onClick={() => setShowConfirmDialog(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to book <strong>Bed {selectedBed?.bedNumber}</strong> in <strong>Room {selectedBed?.roomNumber}</strong>?</p>
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Check-in Date:</span>
                      <span>{new Date(bookingDetails.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Duration:</span>
                      <span>{bookingDetails.duration} month(s)</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={confirmBooking}>
                    <i className="bi bi-check-circle me-2"></i>Confirm & Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-credit-card me-2"></i>Payment Details</h5>
                  <button className="btn-close" onClick={() => setShowPayment(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                      <h6 className="mb-3">Payment Methods</h6>
                      <div className="d-grid gap-2">
                        <button className="btn btn-outline-primary text-start">
                          <i className="bi bi-credit-card me-2"></i>Credit/Debit Card
                        </button>
                        <button className="btn btn-outline-success text-start">
                          <i className="bi bi-phone me-2"></i>UPI Payment
                        </button>
                        <button className="btn btn-outline-info text-start">
                          <i className="bi bi-bank me-2"></i>Net Banking
                        </button>
                        <button className="btn btn-outline-warning text-start">
                          <i className="bi bi-wallet2 me-2"></i>Digital Wallet
                        </button>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h6 className="mb-3">Booking Summary</h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-2"><strong>{hostel.name}</strong></p>
                        <p className="mb-2 small text-muted">{hostel.location}</p>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between mb-1">
                          <span>Monthly Rent:</span>
                          <span>₹{getRoomPrice(bookingDetails.roomType, hostel.price).toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Duration:</span>
                          <span>{bookingDetails.duration} month(s)</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Security Deposit:</span>
                          <span>₹{SECURITY_DEPOSIT.toLocaleString()}</span>
                        </div>
                        {selectedBed && (
                          <div className="d-flex justify-content-between mb-1">
                            <span>Selected Bed:</span>
                            <span>{selectedBed.bedNumber} (Room {selectedBed.roomNumber})</span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total:</span>
                          <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowPayment(false)} disabled={isBooking}>Cancel</button>
                  <button className="btn btn-success" onClick={handlePayment} disabled={isBooking}>
                    {isBooking ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check me-2"></i>Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Sticky Booking Card */}
      <div className="d-lg-none position-fixed bottom-0 start-0 end-0 bg-white border-top p-3" style={{zIndex: 1000}}>
        <div className="d-flex gap-2 align-items-center">
          <div className="flex-grow-1">
            <div className="fw-bold text-primary">₹{calculateTotal().toLocaleString()}</div>
            <div className="small text-muted">
              {selectedBed ? `Bed ${selectedBed.bedNumber} selected` : 'Select a bed'}
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleBookingSubmit}
            disabled={!selectedBed || bedStats.availableBeds === 0 || isBooking}
          >
            {isBooking ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              'Book Now'
            )}
          </button>
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  )
}

export default HostelDetails