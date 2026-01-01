import React from 'react'

const LoadingSkeleton = ({ type = 'card', count = 6 }) => {
  if (type === 'card') {
    return (
      <div className="row">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="skeleton" style={{ height: '200px', borderRadius: '8px 8px 0 0' }}></div>
              <div className="card-body">
                <div className="skeleton mb-2" style={{ height: '24px', width: '80%' }}></div>
                <div className="skeleton mb-2" style={{ height: '16px', width: '60%' }}></div>
                <div className="skeleton mb-2" style={{ height: '20px', width: '40%' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '70%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '10px' }}></div>
  )
}

export default LoadingSkeleton