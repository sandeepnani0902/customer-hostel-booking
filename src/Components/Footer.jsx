import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5 d-none d-md-block">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary">
              <i className="bi bi-house-heart-fill me-2"></i>
              HostelHub
            </h5>
            <p className="text-muted small">Find your perfect home away from home. Safe, comfortable, and affordable accommodation for students and professionals.</p>
          </div>
          <div className="col-md-2 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/home" className="text-muted text-decoration-none small">Home</Link></li>
              <li><Link to="/mens-pg" className="text-muted text-decoration-none small">Men's PG</Link></li>
              <li><Link to="/womens-pg" className="text-muted text-decoration-none small">Women's PG</Link></li>
              <li><Link to="/my-bookings" className="text-muted text-decoration-none small">My Bookings</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none small">About Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none small">Help Center</a></li>
              <li><a href="#" className="text-muted text-decoration-none small">Contact Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none small">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none small">Terms of Service</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6>Connect</h6>
            <div className="d-flex gap-2">
              <a href="#" className="text-muted"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-muted"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-muted"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted"><i className="bi bi-linkedin"></i></a>
            </div>
            <p className="text-muted small mt-2">
              <i className="bi bi-telephone me-1"></i>+91 98765 43210<br/>
              <i className="bi bi-envelope me-1"></i>srikanthsirangi7@gmail.com
            </p>
          </div>
        </div>
        <hr className="border-secondary"/>
        <div className="text-center">
        <p className="text-muted small mb-0">© 2026 HostelHub. All rights reserved. | Developed by Srikanth Sirangi</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer