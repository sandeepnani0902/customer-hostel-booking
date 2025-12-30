import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Signup.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
    }
  }

  return (
    <div className="signup-container">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center min-vh-100 g-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 d-flex justify-content-center">
            <div className="signup-card">
              <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating input-field">
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name">Full Name</label>
            <span className="input-icon">👤</span>
            <div className="error-message">{errors.name || ''}</div>
          </div>
          
          <div className="form-floating input-field">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email Address</label>
            <span className="input-icon">📧</span>
            <div className="error-message">{errors.email || ''}</div>
          </div>
          
          <div className="form-floating input-field">
            <input
              type="tel"
              className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
              id="mobile"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
            <label htmlFor="mobile">Mobile Number</label>
            <span className="input-icon">📱</span>
            <div className="error-message">{errors.mobile || ''}</div>
          </div>
          
          <div className="form-floating password-field">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
            <div className="error-message">{errors.password || ''}</div>
          </div>
          
          <div className="form-floating password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <span 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </span>
            <div className="error-message">{errors.confirmPassword || ''}</div>
          </div>
          
          <button type="submit" className="btn btn-signup w-100">
            Sign Up
          </button>
        </form>
        
        <div className="signup-footer">
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Sign In</a>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )
}

export default Signup