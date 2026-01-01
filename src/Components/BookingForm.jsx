import React from 'react'

const BookingForm = ({ 
  bookingDetails = {}, 
  setBookingDetails, 
  hostel = {}, 
  selectedBed, 
  getRoomPrice, 
  calculateTotal,
  securityDeposit = 1500,
  isMobile = false 
}) => {
  const handleInputChange = (field, value) => {
    if (setBookingDetails) {
      setBookingDetails(prev => ({ ...prev, [field]: value }))
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <>
      <div className="mb-3">
        <label className="form-label" htmlFor="checkInDate">Check-in Date *</label>
        <input 
          id="checkInDate"
          type="date" 
          className="form-control"
          value={bookingDetails.checkInDate || ''}
          onChange={(e) => handleInputChange('checkInDate', e.target.value)}
          min={today}
          max={maxDateStr}
          required
          aria-describedby="checkInHelp"
        />
        <div id="checkInHelp" className="form-text">Select your preferred check-in date</div>
      </div>
      
      <div className="mb-3">
        <label className="form-label" htmlFor="roomType">Room Type *</label>
        <select 
          id="roomType"
          className="form-select"
          value={bookingDetails.roomType || 'single'}
          onChange={(e) => handleInputChange('roomType', e.target.value)}
          required
        >
          <option value="single">Single Occupancy - ₹{hostel.price?.toLocaleString() || '8,500'}</option>
          <option value="double">Double Occupancy - ₹{Math.round((hostel.price || 8500) * 0.7).toLocaleString()}</option>
          <option value="triple">Triple Occupancy - ₹{Math.round((hostel.price || 8500) * 0.5).toLocaleString()}</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="form-label" htmlFor="duration">Duration *</label>
        <select 
          id="duration"
          className="form-select"
          value={bookingDetails.duration || '1'}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          required
        >
          <option value="1">1 Month</option>
          <option value="3">3 Months (5% discount)</option>
          <option value="6">6 Months (10% discount)</option>
          <option value="12">12 Months (15% discount)</option>
        </select>
      </div>
      
      {selectedBed && (
        <div className="alert alert-info mb-3">
          <i className="bi bi-bed me-2"></i>
          Selected Bed: <strong>{selectedBed.bedNumber}</strong> (Room {selectedBed.roomNumber})
        </div>
      )}
      
      {!isMobile && getRoomPrice && calculateTotal && (
        <>
          <hr />
          
          <div className="d-flex justify-content-between mb-2">
            <span>Monthly Rent:</span>
            <span>₹{getRoomPrice(bookingDetails.roomType || 'single', hostel.price || 8500).toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Duration:</span>
            <span>{bookingDetails.duration || 1} month(s)</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Security Deposit:</span>
            <span>₹{securityDeposit.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-3 fw-bold border-top pt-2">
            <span>Total Amount:</span>
            <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
          </div>
        </>
      )}
    </>
  )
}

export default BookingForm