import React from 'react'
import { toast } from 'react-toastify'

const BedLayout = ({ bedLayout = [], selectedBed, onBedSelect }) => {
  const handleBedClick = (bed) => {
    if (!bed || bed.isBooked) {
      toast.error('This bed is already booked')
      return
    }
    if (onBedSelect) {
      onBedSelect(bed)
      toast.success(`Bed ${bed.bedNumber} in Room ${bed.roomNumber} selected`)
    }
  }

  if (!bedLayout || bedLayout.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-bed display-4 text-muted"></i>
        <p className="text-muted mt-2">No beds available at the moment</p>
      </div>
    )
  }

  return (
    <>
      <div className="row g-2 mb-3">
        {bedLayout.map((bed, index) => (
          <div key={bed.bedId || bed.bedNumber || index} className="col-2">
            <div 
              className={`bed-item text-center p-2 rounded position-relative ${
                bed.isBooked ? 'bg-danger text-white' : 
                selectedBed?.bedId === bed.bedId ? 'bg-primary text-white' :
                'bg-light border'
              }`}
              style={{
                cursor: bed.isBooked ? 'not-allowed' : 'pointer', 
                minHeight: '48px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleBedClick(bed)}
              role="button"
              tabIndex={bed.isBooked ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleBedClick(bed)
                }
              }}
              aria-label={`Bed ${bed.bedNumber} in Room ${bed.roomNumber} - ${bed.isBooked ? 'Booked' : 'Available'}`}
            >
              <i className={`bi ${bed.isBooked ? 'bi-lock-fill' : 'bi-bed'} d-block mb-1`}></i>
              <small>{bed.bedNumber}</small>
              <div style={{fontSize: '0.7rem', color: '#666'}}>R{bed.roomNumber}</div>
              {bed.isBooked && (
                <div className="position-absolute top-0 end-0">
                  <i className="bi bi-lock-fill text-white" style={{fontSize: '0.8rem'}}></i>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="d-flex gap-3 small mb-3">
        <div><i className="bi bi-bed text-muted me-1"></i> Available</div>
        <div><i className="bi bi-check-circle text-primary me-1"></i> Selected</div>
        <div><i className="bi bi-lock-fill text-danger me-1"></i> Booked</div>
      </div>
      
      {selectedBed && (
        <div className="alert alert-success mt-3 mb-0">
          <i className="bi bi-check-circle me-2"></i>
          Bed {selectedBed.bedNumber} in Room {selectedBed.roomNumber} selected. Proceed with booking details below.
        </div>
      )}
    </>
  )
}

export default BedLayout