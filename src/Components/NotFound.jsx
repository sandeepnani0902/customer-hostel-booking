import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = ({ 
  title = "Page Not Found", 
  message = "The page you're looking for doesn't exist.",
  showHomeButton = true 
}) => {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        </div>
        <h1 className="display-4 fw-bold text-dark mb-3">{title}</h1>
        <p className="fs-5 text-muted mb-4">{message}</p>
        {showHomeButton && (
          <Link to="/home" className="btn btn-primary btn-lg">
            <i className="bi bi-house-door me-2"></i>
            Go to Home
          </Link>
        )}
      </div>
    </div>
  )
}

export default NotFound