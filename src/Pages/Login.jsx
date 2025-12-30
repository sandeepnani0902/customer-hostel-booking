import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      console.log('Login submitted:', formData)
    }
  }

  return (
    <div className="login-container">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center min-vh-100 g-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 d-flex justify-content-center">
            <div className="login-card">
              <h2 className="login-title">Welcome Back</h2>
              <form onSubmit={handleSubmit}>
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
                    {showPassword ? '👁️' : '👁️🗨️'}
                  </span>
                  <div className="error-message">{errors.password || ''}</div>
                </div>
                
                <button type="submit" className="btn btn-login w-100">
                  Sign In
                </button>
              </form>
              
              <div className="login-footer">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign Up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login